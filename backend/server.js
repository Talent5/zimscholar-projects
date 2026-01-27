import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/database.js';
import { 
  uploadFile, 
  uploadMultipleFiles, 
  deleteFile, 
  BUCKETS,
  initializeBuckets 
} from './config/supabaseStorage.js';
import { 
  uploadFields, 
  handleMulterError 
} from './middleware/upload.js';
import Contact from './models/Contact.js';
import QuoteRequest from './models/QuoteRequest.js';
import ProjectRequest from './models/ProjectRequest.js';
import Service from './models/Service.js';
import PortfolioProject from './models/PortfolioProject.js';
import PricingPackage from './models/PricingPackage.js';
import Customer from './models/Customer.js';
import Payment from './models/Payment.js';
import { 
  sendContactNotification,
  sendQuoteRequestNotification,
  sendProjectRequestNotification,
  sendAdminReply
} from './config/emailService.js';
import { generateToken, verifyToken } from './middleware/auth.js';
import { 
  apiLimiter, 
  formLimiter, 
  authLimiter, 
  adminLimiter 
} from './middleware/rateLimiter.js';
import { 
  contactFormValidation, 
  quoteRequestValidation, 
  projectRequestValidation 
} from './middleware/validation.js';
import logger, { requestLogger, errorLogger } from './utils/logger.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase storage buckets
initializeBuckets().catch(err => 
  logger.error('Failed to initialize Supabase buckets:', err)
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use(requestLogger);

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== AUTHENTICATION ENDPOINTS ====================
// Admin login
app.post('/api/admin/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get admin credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    
    // For initial setup, use a default password (CHANGE THIS IN PRODUCTION)
    const defaultPasswordHash = await bcrypt.hash('admin123', 10);
    const adminPasswordHash = ADMIN_PASSWORD_HASH || defaultPasswordHash;

    // Verify username
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({ 
      username: ADMIN_USERNAME,
      role: 'admin',
      loginTime: Date.now()
    });

    res.json({ 
      success: true,
      token,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token
app.get('/api/admin/verify', verifyToken, (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});

// Contact Form Endpoint
app.post('/api/contact', formLimiter, contactFormValidation, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    await contact.save();
    console.log('Contact Form Submission saved:', contact._id);
    
    // Send email notification (don't wait for it)
    sendContactNotification(contact.toObject()).catch(err => 
      console.error('Failed to send contact notification email:', err)
    );
    
    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      data: { name, email, phone, id: contact._id }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form',
      message: error.message 
    });
  }
});

// Quote Request Endpoint
app.post('/api/quote-request', formLimiter, quoteRequestValidation, async (req, res) => {
  try {
    console.log('Received quote request body:', req.body);
    const { 
      name, email, phone, university, course, 
      projectType, packageTier, deadline, budget, description 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !university || !course || !projectType || !description) {
      console.log('Validation failed. Missing fields:', {
        name: !name, email: !email, phone: !phone, university: !university,
        course: !course, projectType: !projectType, description: !description
      });
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Save to database
    const quoteRequest = new QuoteRequest({
      name,
      email,
      phone,
      university,
      course,
      projectType,
      packageTier: packageTier || '',
      deadline: deadline || null,
      budget: budget || '',
      description
    });

    await quoteRequest.save();
    console.log('Quote Request saved:', quoteRequest._id);
    
    // Send email notification (don't wait for it)
    sendQuoteRequestNotification(quoteRequest.toObject()).catch(err => 
      console.error('Failed to send quote request notification email:', err)
    );
    
    res.json({ 
      success: true, 
      message: 'Quote request submitted successfully',
      data: { name, email, projectType, id: quoteRequest._id }
    });
  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({ 
      error: 'Failed to submit quote request',
      message: error.message 
    });
  }
});

// Project Request Endpoint
app.post('/api/project-request', formLimiter, projectRequestValidation, async (req, res) => {
  try {
    const { 
      name, email, phone, university, course,
      projectCategory, projectType, projectId, 
      customRequirements, deadline, additionalNotes
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !university || !course || !projectCategory || !projectType) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    if (projectCategory === 'ready-made' && !projectId) {
      return res.status(400).json({ error: 'Project ID is required for ready-made projects' });
    }

    if (projectCategory === 'custom' && !customRequirements) {
      return res.status(400).json({ error: 'Project requirements are required for custom projects' });
    }

    // Save to database
    const projectRequest = new ProjectRequest({
      name,
      email,
      phone,
      university,
      course,
      projectCategory,
      projectType,
      projectId: projectId || '',
      customRequirements: customRequirements || '',
      deadline: deadline || null,
      additionalNotes: additionalNotes || ''
    });

    await projectRequest.save();
    console.log('Project Request saved:', projectRequest._id);
    
    // Send email notification (don't wait for it)
    sendProjectRequestNotification(projectRequest.toObject()).catch(err => 
      console.error('Failed to send project request notification email:', err)
    );
    
    res.json({ 
      success: true, 
      message: 'Project request submitted successfully',
      data: { name, email, projectCategory, projectType, id: projectRequest._id }
    });
  } catch (error) {
    console.error('Project request error:', error);
    res.status(500).json({ 
      error: 'Failed to submit project request',
      message: error.message 
    });
  }
});

// Admin API Endpoints

// Get dashboard statistics
app.get('/api/admin/stats', verifyToken, adminLimiter, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const totalQuotes = await QuoteRequest.countDocuments();
    const totalProjects = await ProjectRequest.countDocuments();
    
    // Count submissions from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentContacts = await Contact.countDocuments({ submittedAt: { $gte: sevenDaysAgo } });
    const recentQuotes = await QuoteRequest.countDocuments({ submittedAt: { $gte: sevenDaysAgo } });
    const recentProjects = await ProjectRequest.countDocuments({ submittedAt: { $gte: sevenDaysAgo } });
    
    res.json({
      totalContacts,
      totalQuotes,
      totalProjects,
      recentSubmissions: recentContacts + recentQuotes + recentProjects
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all contacts
app.get('/api/admin/contacts', verifyToken, adminLimiter, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update contact status
app.patch('/api/admin/contacts/:id/status', verifyToken, adminLimiter, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

// Get all quote requests
app.get('/api/admin/quote-requests', verifyToken, adminLimiter, async (req, res) => {
  try {
    const quotes = await QuoteRequest.find().sort({ submittedAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote requests' });
  }
});

// Update quote request status
app.patch('/api/admin/quote-requests/:id/status', verifyToken, adminLimiter, async (req, res) => {
  try {
    const { status } = req.body;
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quote request status' });
  }
});

// Generate and send quotation
app.post('/api/admin/quote-requests/:id/generate-quotation', verifyToken, adminLimiter, async (req, res) => {
  try {
    const quoteRequest = await QuoteRequest.findById(req.params.id);
    
    if (!quoteRequest) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    const {
      lineItems,
      discount,
      discountType,
      taxRate,
      paymentTerms,
      quotationNotes,
      validityDays
    } = req.body;

    // Validate line items
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ error: 'Line items are required' });
    }

    // Calculate total
    const subtotal = lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    
    const discountAmount = discount ? 
      (discountType === 'percentage' ? subtotal * (discount / 100) : discount) : 0;
    
    const taxAmount = taxRate ? (subtotal - discountAmount) * (taxRate / 100) : 0;
    const totalAmount = subtotal - discountAmount + taxAmount;

    // Generate quotation number and dates
    const { generateQuotationNumber } = await import('./utils/pdfGenerator.js');
    const quotationNumber = generateQuotationNumber();
    const dateIssued = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (validityDays || 30));

    // Prepare quotation data
    const quotationData = {
      quotationNumber,
      dateIssued,
      validUntil,
      clientName: quoteRequest.name,
      clientEmail: quoteRequest.email,
      clientPhone: quoteRequest.phone,
      university: quoteRequest.university,
      course: quoteRequest.course,
      projectType: quoteRequest.projectType,
      description: quoteRequest.description,
      lineItems,
      discount,
      discountType,
      taxRate,
      subtotal,
      totalAmount,
      paymentTerms: paymentTerms || 'A 50% deposit is required before project commencement. Final balance is due upon project completion.',
      notes: quotationNotes,
      status: 'Pending Acceptance'
    };

    // Generate PDF
    const { generateQuotationPDF } = await import('./utils/pdfGenerator.js');
    const pdfFileName = `quotation-${quotationNumber}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', 'quotations', pdfFileName);
    
    // Ensure quotations directory exists
    const quotationsDir = path.join(process.cwd(), 'uploads', 'quotations');
    if (!fs.existsSync(quotationsDir)) {
      fs.mkdirSync(quotationsDir, { recursive: true });
    }

    console.log('Generating PDF at:', pdfPath);
    console.log('Quotation data:', JSON.stringify(quotationData, null, 2));
    
    await generateQuotationPDF(quotationData, pdfPath);
    
    console.log('PDF generated successfully');

    // Update quote request with quotation details
    quoteRequest.quotation = {
      quotationNumber,
      dateIssued,
      validUntil,
      lineItems,
      discount,
      discountType,
      taxRate,
      paymentTerms,
      quotationNotes,
      pdfPath,
      sentAt: new Date()
    };
    quoteRequest.quotedPrice = totalAmount;
    quoteRequest.status = 'quoted';
    await quoteRequest.save();

    // Send email with PDF
    const { sendQuotationEmail } = await import('./config/emailService.js');
    quotationData.pdfPath = pdfPath;
    
    let emailSent = false;
    let emailError = null;
    
    try {
      const emailResult = await sendQuotationEmail(quotationData);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
        console.error('Failed to send quotation email:', emailResult.error);
      }
    } catch (error) {
      console.error('Error sending quotation email:', error);
      emailError = error.message;
    }

    // Return success with appropriate message
    if (emailSent) {
      res.json({ 
        success: true,
        message: 'Quotation generated and sent successfully',
        quotation: quoteRequest.quotation,
        emailSent: true
      });
    } else {
      res.json({ 
        success: true,
        warning: true,
        message: 'Quotation generated successfully but email failed to send. You can download the quotation and send it manually.',
        quotation: quoteRequest.quotation,
        emailSent: false,
        emailError: emailError,
        downloadUrl: `/api/admin/quotations/${quotationNumber}/pdf`
      });
    }

  } catch (error) {
    console.error('Error generating quotation:', error);
    res.status(500).json({ 
      error: 'Failed to generate quotation',
      message: error.message 
    });
  }
});

// Get quotation PDF
app.get('/api/admin/quotations/:quotationNumber/pdf', verifyToken, adminLimiter, async (req, res) => {
  try {
    const quoteRequest = await QuoteRequest.findOne({
      'quotation.quotationNumber': req.params.quotationNumber
    });

    if (!quoteRequest || !quoteRequest.quotation?.pdfPath) {
      return res.status(404).json({ error: 'Quotation PDF not found' });
    }

    const pdfPath = quoteRequest.quotation.pdfPath;
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="quotation-${req.params.quotationNumber}.pdf"`);
    
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error retrieving quotation PDF:', error);
    res.status(500).json({ error: 'Failed to retrieve quotation PDF' });
  }
});

// Delete quotation
app.delete('/api/admin/quote-requests/:id/quotation', verifyToken, adminLimiter, async (req, res) => {
  try {
    const quoteRequest = await QuoteRequest.findById(req.params.id);
    
    if (!quoteRequest) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    if (!quoteRequest.quotation) {
      return res.status(404).json({ error: 'No quotation found for this request' });
    }

    // Delete PDF file if it exists
    if (quoteRequest.quotation.pdfPath && fs.existsSync(quoteRequest.quotation.pdfPath)) {
      try {
        fs.unlinkSync(quoteRequest.quotation.pdfPath);
        console.log('Deleted quotation PDF:', quoteRequest.quotation.pdfPath);
      } catch (err) {
        console.error('Error deleting PDF file:', err);
      }
    }

    // Remove quotation data from database
    quoteRequest.quotation = undefined;
    quoteRequest.status = 'pending';
    quoteRequest.quotedPrice = undefined;
    await quoteRequest.save();

    res.json({ 
      success: true,
      message: 'Quotation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting quotation:', error);
    res.status(500).json({ 
      error: 'Failed to delete quotation',
      message: error.message 
    });
  }
});

// Update/Edit quotation (regenerate with new data)
app.put('/api/admin/quote-requests/:id/quotation', verifyToken, adminLimiter, async (req, res) => {
  try {
    const quoteRequest = await QuoteRequest.findById(req.params.id);
    
    if (!quoteRequest) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    const {
      lineItems,
      discount,
      discountType,
      taxRate,
      paymentTerms,
      quotationNotes,
      validityDays
    } = req.body;

    // Validate line items
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ error: 'Line items are required' });
    }

    // Calculate total
    const subtotal = lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    
    const discountAmount = discount ? 
      (discountType === 'percentage' ? subtotal * (discount / 100) : discount) : 0;
    
    const taxAmount = taxRate ? (subtotal - discountAmount) * (taxRate / 100) : 0;
    const totalAmount = subtotal - discountAmount + taxAmount;

    // Keep existing quotation number if editing, or generate new one
    const { generateQuotationNumber } = await import('./utils/pdfGenerator.js');
    const quotationNumber = quoteRequest.quotation?.quotationNumber || generateQuotationNumber();
    const dateIssued = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (validityDays || 30));

    // Prepare quotation data
    const quotationData = {
      quotationNumber,
      dateIssued,
      validUntil,
      clientName: quoteRequest.name,
      clientEmail: quoteRequest.email,
      clientPhone: quoteRequest.phone,
      university: quoteRequest.university,
      course: quoteRequest.course,
      projectType: quoteRequest.projectType,
      description: quoteRequest.description,
      lineItems,
      discount,
      discountType,
      taxRate,
      subtotal,
      totalAmount,
      paymentTerms: paymentTerms || 'A 50% deposit is required before project commencement. Final balance is due upon project completion.',
      notes: quotationNotes,
      status: 'Pending Acceptance'
    };

    // Delete old PDF if it exists
    if (quoteRequest.quotation?.pdfPath && fs.existsSync(quoteRequest.quotation.pdfPath)) {
      try {
        fs.unlinkSync(quoteRequest.quotation.pdfPath);
        console.log('Deleted old quotation PDF:', quoteRequest.quotation.pdfPath);
      } catch (err) {
        console.error('Error deleting old PDF file:', err);
      }
    }

    // Generate new PDF
    const { generateQuotationPDF } = await import('./utils/pdfGenerator.js');
    const pdfFileName = `quotation-${quotationNumber}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', 'quotations', pdfFileName);
    
    // Ensure quotations directory exists
    const quotationsDir = path.join(process.cwd(), 'uploads', 'quotations');
    if (!fs.existsSync(quotationsDir)) {
      fs.mkdirSync(quotationsDir, { recursive: true });
    }

    console.log('Generating updated PDF at:', pdfPath);
    await generateQuotationPDF(quotationData, pdfPath);
    console.log('Updated PDF generated successfully');

    // Update quote request with new quotation details
    quoteRequest.quotation = {
      quotationNumber,
      dateIssued,
      validUntil,
      lineItems,
      discount,
      discountType,
      taxRate,
      paymentTerms,
      quotationNotes,
      pdfPath,
      sentAt: new Date()
    };
    quoteRequest.quotedPrice = totalAmount;
    quoteRequest.status = 'quoted';
    await quoteRequest.save();

    res.json({ 
      success: true,
      message: 'Quotation updated successfully',
      quotation: quoteRequest.quotation
    });

  } catch (error) {
    console.error('Error updating quotation:', error);
    res.status(500).json({ 
      error: 'Failed to update quotation',
      message: error.message 
    });
  }
});


// Get all project requests
app.get('/api/admin/project-requests', verifyToken, adminLimiter, async (req, res) => {
  try {
    const projects = await ProjectRequest.find().sort({ submittedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project requests' });
  }
});

// Update project request status
app.patch('/api/admin/project-requests/:id/status', verifyToken, adminLimiter, async (req, res) => {
  try {
    const { status } = req.body;
    const project = await ProjectRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project request status' });
  }
});

// Send reply email from admin with attachments
app.post('/api/admin/send-reply', verifyToken, adminLimiter, uploadFields([
  { name: 'attachments', maxCount: 10 }
]), handleMulterError, async (req, res) => {
  try {
    const { recipientEmail, recipientName, subject, message, submissionType, submissionId } = req.body;
    const attachments = req.files?.attachments || [];

    if (!recipientEmail || !subject || !message) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Upload attachments to Supabase if provided
    const emailAttachments = [];
    
    if (attachments.length > 0) {
      const uploadResults = await uploadMultipleFiles(
        attachments,
        BUCKETS.ATTACHMENTS,
        `replies/${Date.now()}`
      );
      
      for (const result of uploadResults) {
        if (result.success) {
          emailAttachments.push({
            filename: result.originalName,
            path: result.data.publicUrl
          });
        } else {
          logger.error('Attachment upload failed:', result.error);
        }
      }
    }

    // Send email
    const result = await sendAdminReply({
      recipientEmail,
      recipientName,
      subject,
      message,
      attachments: emailAttachments
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Update submission status based on type
    if (submissionType === 'contact') {
      await Contact.findByIdAndUpdate(submissionId, { status: 'replied' });
    } else if (submissionType === 'quote') {
      await QuoteRequest.findByIdAndUpdate(submissionId, { status: 'quoted' });
    } else if (submissionType === 'project') {
      await ProjectRequest.findByIdAndUpdate(submissionId, { status: 'delivered' });
    }

    logger.info('Reply email sent successfully', { recipientEmail, submissionId });
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    logger.error('Send reply error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

// ==================== SERVICES MANAGEMENT ====================
// Get all services
app.get('/api/admin/services', verifyToken, adminLimiter, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, title: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get public services (active only)
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, title: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get single service
app.get('/api/services/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service
app.post('/api/admin/services', verifyToken, adminLimiter, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
app.put('/api/admin/services/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Patch service (partial update)
app.patch('/api/admin/services/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
app.delete('/api/admin/services/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ==================== PRICING MANAGEMENT ====================
// Get all pricing packages (public)
app.get('/api/pricing', async (req, res) => {
  try {
    const packages = await PricingPackage.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json(packages);
  } catch (error) {
    logger.error('Error fetching pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing packages' });
  }
});

// Get all pricing packages (admin)
app.get('/api/admin/pricing', verifyToken, adminLimiter, async (req, res) => {
  try {
    const packages = await PricingPackage.find().sort({ order: 1, name: 1 });
    res.json(packages);
  } catch (error) {
    logger.error('Error fetching pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing packages' });
  }
});

// Create pricing package
app.post('/api/admin/pricing', verifyToken, adminLimiter, async (req, res) => {
  try {
    const pricingPackage = new PricingPackage(req.body);
    await pricingPackage.save();
    logger.info('Pricing package created:', { packageId: pricingPackage._id });
    res.status(201).json(pricingPackage);
  } catch (error) {
    logger.error('Error creating pricing package:', error);
    res.status(500).json({ error: 'Failed to create pricing package' });
  }
});

// Update pricing package
app.put('/api/admin/pricing/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const pricingPackage = await PricingPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pricingPackage) {
      return res.status(404).json({ error: 'Pricing package not found' });
    }
    logger.info('Pricing package updated:', { packageId: pricingPackage._id });
    res.json(pricingPackage);
  } catch (error) {
    logger.error('Error updating pricing package:', error);
    res.status(500).json({ error: 'Failed to update pricing package' });
  }
});

// Patch pricing package (partial update)
app.patch('/api/admin/pricing/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const pricingPackage = await PricingPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pricingPackage) {
      return res.status(404).json({ error: 'Pricing package not found' });
    }
    res.json(pricingPackage);
  } catch (error) {
    logger.error('Error updating pricing package:', error);
    res.status(500).json({ error: 'Failed to update pricing package' });
  }
});

// Delete pricing package
app.delete('/api/admin/pricing/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const pricingPackage = await PricingPackage.findByIdAndDelete(req.params.id);
    if (!pricingPackage) {
      return res.status(404).json({ error: 'Pricing package not found' });
    }
    logger.info('Pricing package deleted:', { packageId: req.params.id });
    res.json({ message: 'Pricing package deleted successfully' });
  } catch (error) {
    logger.error('Error deleting pricing package:', error);
    res.status(500).json({ error: 'Failed to delete pricing package' });
  }
});

// ==================== PORTFOLIO MANAGEMENT ====================
// Get all portfolio projects
app.get('/api/admin/portfolio', verifyToken, adminLimiter, async (req, res) => {
  try {
    const projects = await PortfolioProject.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get public portfolio projects (active only)
app.get('/api/portfolio', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    
    const projects = await PortfolioProject.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get single portfolio project
app.get('/api/portfolio/:slug', async (req, res) => {
  try {
    const project = await PortfolioProject.findOne({ slug: req.params.slug, isActive: true });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Increment view count
    project.viewCount += 1;
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create portfolio project
app.post('/api/admin/portfolio', verifyToken, adminLimiter, uploadFields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // Validate required fields
    if (!projectData.title) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Title is required' 
      });
    }
    
    // Auto-generate slug if not provided
    if (!projectData.slug && projectData.title) {
      projectData.slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Parse JSON fields
    if (req.body.technologies) {
      projectData.technologies = JSON.parse(req.body.technologies);
    }
    if (req.body.features) {
      projectData.features = JSON.parse(req.body.features);
    }
    
    // Auto-generate unique project ID if not provided
    if (!projectData.projectId) {
      const year = new Date().getFullYear();
      const count = await PortfolioProject.countDocuments();
      projectData.projectId = `ZS${year}${String(count + 1).padStart(4, '0')}`;
    }
    
    // Handle thumbnail upload to Supabase
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailFile = req.files.thumbnail[0];
      const thumbnailPath = `thumbnails/${Date.now()}-${thumbnailFile.originalname}`;
      
      const uploadResult = await uploadFile(
        thumbnailFile,
        BUCKETS.THUMBNAILS,
        thumbnailPath,
        { contentType: thumbnailFile.mimetype }
      );
      
      if (uploadResult.success) {
        projectData.thumbnail = uploadResult.data.publicUrl;
      } else {
        logger.error('Thumbnail upload failed:', uploadResult.error);
      }
    }
    
    const project = new PortfolioProject(projectData);
    await project.save();
    logger.info('Portfolio project created:', { projectId: project._id });
    res.status(201).json(project);
  } catch (error) {
    logger.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors,
        message: errors.join(', ')
      });
    }
    
    // Handle duplicate key error (e.g., slug already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: 'Duplicate entry', 
        message: `A project with this ${field} already exists`
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create project',
      message: error.message 
    });
  }
});

// Update portfolio project
app.put('/api/admin/portfolio/:id', verifyToken, adminLimiter, uploadFields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // Parse JSON fields
    if (req.body.technologies) {
      projectData.technologies = JSON.parse(req.body.technologies);
    }
    if (req.body.features) {
      projectData.features = JSON.parse(req.body.features);
    }
    
    // Handle thumbnail upload to Supabase
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailFile = req.files.thumbnail[0];
      const thumbnailPath = `thumbnails/${Date.now()}-${thumbnailFile.originalname}`;
      
      const uploadResult = await uploadFile(
        thumbnailFile,
        BUCKETS.THUMBNAILS,
        thumbnailPath,
        { contentType: thumbnailFile.mimetype }
      );
      
      if (uploadResult.success) {
        projectData.thumbnail = uploadResult.data.publicUrl;
      } else {
        logger.error('Thumbnail upload failed:', uploadResult.error);
      }
    }
    
    // Handle video file upload to Supabase
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      const videoFile = req.files.videoFile[0];
      const videoPath = `videos/${Date.now()}-${videoFile.originalname}`;
      
      const uploadResult = await uploadFile(
        videoFile,
        BUCKETS.PORTFOLIO,
        videoPath,
        { contentType: videoFile.mimetype }
      );
      
      if (uploadResult.success) {
        projectData.videoUrl = uploadResult.data.publicUrl;
      } else {
        logger.error('Video upload failed:', uploadResult.error);
      }
    }
    
    // Handle project files upload to Supabase
    if (req.files && req.files.projectFiles && req.files.projectFiles.length > 0) {
      const existingProject = await PortfolioProject.findById(req.params.id);
      const existingFiles = existingProject?.files || [];
      
      const uploadResults = await uploadMultipleFiles(
        req.files.projectFiles,
        BUCKETS.PORTFOLIO,
        'projects'
      );
      
      const newFiles = uploadResults
        .filter(result => result.success)
        .map(result => ({
          name: result.originalName,
          path: result.data.publicUrl,
          size: result.size,
          type: result.mimetype
        }));
      
      projectData.files = [...existingFiles, ...newFiles];
      
      // Log any failed uploads
      const failed = uploadResults.filter(r => !r.success);
      if (failed.length > 0) {
        logger.error('Some file uploads failed:', failed);
      }
    }
    
    const project = await PortfolioProject.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    logger.info('Portfolio project updated:', { projectId: project._id });
    res.json(project);
  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Patch portfolio project (partial update)
app.patch('/api/admin/portfolio/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const project = await PortfolioProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete portfolio project
app.delete('/api/admin/portfolio/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const project = await PortfolioProject.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// ==================== CUSTOMER MANAGEMENT ====================
// Get all customers
app.get('/api/admin/customers', verifyToken, adminLimiter, async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const customers = await Customer.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .lean();
    
    res.json(customers);
  } catch (error) {
    logger.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer
app.get('/api/admin/customers/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    logger.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
app.post('/api/admin/customers', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    
    // Calculate initial revenue
    await customer.calculateRevenue();
    
    logger.info('Customer created:', { customerId: customer._id });
    res.status(201).json(customer);
  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer', message: error.message });
  }
});

// Update customer
app.put('/api/admin/customers/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Recalculate revenue after updating customer
    await customer.calculateRevenue();
    
    logger.info('Customer updated:', { customerId: customer._id });
    res.json(customer);
  } catch (error) {
    logger.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Recalculate customer revenue manually
app.post('/api/admin/customers/:id/calculate-revenue', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customer.calculateRevenue();
    logger.info('Revenue recalculated for customer:', { customerId: customer._id });
    res.json({ message: 'Revenue calculated successfully', customer });
  } catch (error) {
    logger.error('Error calculating revenue:', error);
    res.status(500).json({ error: 'Failed to calculate revenue' });
  }
});

// Delete customer
app.delete('/api/admin/customers/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    logger.info('Customer deleted:', { customerId: req.params.id });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    logger.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Add project to customer
app.post('/api/admin/customers/:id/projects', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customer.projects.push(req.body);
    await customer.save();
    
    logger.info('Project added to customer:', { customerId: customer._id });
    res.status(201).json(customer);
  } catch (error) {
    logger.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Update project
app.put('/api/admin/customers/:customerId/projects/:projectId', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const project = customer.projects.id(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    Object.assign(project, req.body);
    await customer.save();
    
    logger.info('Project updated:', { customerId: customer._id, projectId: req.params.projectId });
    res.json(customer);
  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/admin/customers/:customerId/projects/:projectId', verifyToken, adminLimiter, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customer.projects.pull(req.params.projectId);
    await customer.save();
    
    logger.info('Project deleted:', { customerId: customer._id, projectId: req.params.projectId });
    res.json(customer);
  } catch (error) {
    logger.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ==================== PAYMENT MANAGEMENT ====================
// Get all payments
app.get('/api/admin/payments', verifyToken, adminLimiter, async (req, res) => {
  try {
    const { status, customer, startDate, endDate, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;
    if (startDate || endDate) {
      filter.paidDate = {};
      if (startDate) filter.paidDate.$gte = new Date(startDate);
      if (endDate) filter.paidDate.$lte = new Date(endDate);
    }
    
    const payments = await Payment.find(filter)
      .populate('customer', 'name email phone')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .lean();
    
    res.json(payments);
  } catch (error) {
    logger.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payments for a customer
app.get('/api/admin/customers/:id/payments', verifyToken, adminLimiter, async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(payments);
  } catch (error) {
    logger.error('Error fetching customer payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Create payment
app.post('/api/admin/payments', verifyToken, adminLimiter, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    
    logger.info('Payment created:', { paymentId: payment._id });
    res.status(201).json(payment);
  } catch (error) {
    logger.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment', message: error.message });
  }
});

// Update payment
app.put('/api/admin/payments/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer', 'name email');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    logger.info('Payment updated:', { paymentId: payment._id });
    res.json(payment);
  } catch (error) {
    logger.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete payment
app.delete('/api/admin/payments/:id', verifyToken, adminLimiter, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    logger.info('Payment deleted:', { paymentId: req.params.id });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    logger.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

// ==================== REVENUE ANALYTICS ====================
// Get revenue analytics
app.get('/api/admin/analytics/revenue', verifyToken, adminLimiter, async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    
    // Monthly revenue
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paidDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Yearly revenue
    const yearlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paidDate: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$paidDate' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);
    
    // Pending payments
    const pendingPayments = await Payment.aggregate([
      {
        $match: {
          status: { $in: ['pending', 'overdue'] }
        }
      },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Top customers by revenue
    const topCustomers = await Payment.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$customer',
          totalRevenue: { $sum: '$amount' },
          paymentCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $unwind: '$customerInfo'
      }
    ]);
    
    // Payment methods breakdown
    const paymentMethods = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paidDate: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      monthly: monthlyRevenue[0] || { total: 0, count: 0 },
      yearlyByMonth: yearlyRevenue,
      pending: pendingPayments,
      topCustomers,
      paymentMethods,
      period: {
        year: currentYear,
        month: currentMonth
      }
    });
  } catch (error) {
    logger.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get customer statistics
app.get('/api/admin/analytics/customers', verifyToken, adminLimiter, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: 'active' });
    const vipCustomers = await Customer.countDocuments({ status: 'vip' });
    const leadCustomers = await Customer.countDocuments({ status: 'lead' });
    
    const customersWithActiveProjects = await Customer.aggregate([
      {
        $match: {
          'projects.status': { $in: ['in-progress', 'review', 'accepted'] }
        }
      },
      {
        $count: 'count'
      }
    ]);
    
    res.json({
      total: totalCustomers,
      active: activeCustomers,
      vip: vipCustomers,
      leads: leadCustomers,
      withActiveProjects: customersWithActiveProjects[0]?.count || 0
    });
  } catch (error) {
    logger.error('Error fetching customer statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Serve static files from the client build
const clientBuildPath = path.join(__dirname, '../dist');
app.use(express.static(clientBuildPath));

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Add error logging middleware (should be last)
app.use(errorLogger);

app.listen(PORT, () => {
  logger.info('Server started successfully', { 
    port: PORT, 
    environment: process.env.NODE_ENV || 'development',
    clientBuildPath 
  });
});
