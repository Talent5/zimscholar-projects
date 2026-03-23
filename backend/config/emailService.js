import nodemailer from 'nodemailer';

const resolveEmailConfig = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
  const isGmailUser = Boolean(user && user.toLowerCase().includes('@gmail.com'));

  const host = process.env.EMAIL_HOST || (isGmailUser ? 'smtp.gmail.com' : undefined);
  const secure = process.env.EMAIL_SECURE === 'true';
  const port = Number(process.env.EMAIL_PORT) || (secure ? 465 : 587);

  if (!user || !pass) {
    throw new Error('Email configuration error: EMAIL_USER and EMAIL_PASSWORD (or EMAIL_PASS) are required.');
  }

  if (!host) {
    throw new Error('Email configuration error: EMAIL_HOST is required.');
  }

  return { host, port, secure, user, pass };
};

// Create reusable transporter
const createTransporter = () => {
  const config = resolveEmailConfig();

  return (nodemailer.default || nodemailer).createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Add timeout configurations for document delivery
    connectionTimeout: 12000, // fail fast when SMTP is unreachable
    socketTimeout: 60000,     // 60 seconds for socket operations
    greetingTimeout: 10000,   // 10 seconds for SMTP greeting
    // Enable connection pooling for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 10,
  });
};

const createTransporterWithOverrides = (overrides = {}) => {
  const config = resolveEmailConfig();
  const host = overrides.host || config.host;
  const secure = typeof overrides.secure === 'boolean' ? overrides.secure : config.secure;
  const port = Number(overrides.port) || config.port;

  return (nodemailer.default || nodemailer).createTransport({
    host,
    port,
    secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 12000,
    socketTimeout: 60000,
    greetingTimeout: 10000,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 10,
  });
};

const shouldTryGmailSslFallback = (error) => {
  const host = (process.env.EMAIL_HOST || '').toLowerCase();
  const isGmailHost = host === 'smtp.gmail.com' || host === '';
  const configuredPort = Number(process.env.EMAIL_PORT) || 587;
  const isConnectFailure = ['ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENOTFOUND'].includes(error?.code);

  return isGmailHost && configuredPort === 587 && isConnectFailure;
};

const sendMailWithFallback = async (mailOptions) => {
  const primary = createTransporter();

  try {
    return await primary.sendMail(mailOptions);
  } catch (error) {
    if (!shouldTryGmailSslFallback(error)) {
      throw error;
    }

    const fallback = createTransporterWithOverrides({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
    });

    try {
      return await fallback.sendMail(mailOptions);
    } catch (fallbackError) {
      fallbackError.originalError = error;
      throw fallbackError;
    }
  }
};

// Send email notification for contact form
export const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ZimScholar Notifications" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🔔 New Contact Form Submission - ZimScholar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5; border-bottom: 3px solid #4f46e5; padding-bottom: 10px;">
            📧 New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            <p><strong>Phone/WhatsApp:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4f46e5; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #666; font-size: 14px;">
              📅 Submitted: ${new Date(contactData.submittedAt).toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}
            </p>
            <p style="color: #666; font-size: 14px;">
              🔗 <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5000'}/admin" 
                     style="color: #4f46e5;">View in Admin Dashboard</a>
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send email notification for quote request
export const sendQuoteRequestNotification = async (quoteData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ZimScholar Notifications" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '💰 New Quote Request - ZimScholar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
            💰 New Quote Request Received
          </h2>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Student Information:</h3>
            <p><strong>Name:</strong> ${quoteData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${quoteData.email}">${quoteData.email}</a></p>
            <p><strong>Phone/WhatsApp:</strong> <a href="tel:${quoteData.phone}">${quoteData.phone}</a></p>
            <p><strong>University:</strong> ${quoteData.university}</p>
            <p><strong>Course:</strong> ${quoteData.course}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details:</h3>
            <p><strong>Project Type:</strong> <span style="background-color: #dbeafe; padding: 4px 8px; border-radius: 4px;">${quoteData.projectType}</span></p>
            ${quoteData.packageTier ? `<p><strong>Package Tier:</strong> ${quoteData.packageTier}</p>` : ''}
            ${quoteData.deadline ? `<p><strong>Deadline:</strong> ${new Date(quoteData.deadline).toLocaleDateString('en-GB')}</p>` : ''}
            ${quoteData.budget ? `<p><strong>Budget:</strong> ${quoteData.budget}</p>` : ''}
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Description:</h3>
            <p style="white-space: pre-wrap;">${quoteData.description}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #666; font-size: 14px;">
              📅 Submitted: ${new Date(quoteData.submittedAt).toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}
            </p>
            <p style="color: #666; font-size: 14px;">
              🔗 <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5000'}/admin" 
                     style="color: #10b981;">View in Admin Dashboard</a>
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Quote request notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending quote request notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send email notification for project request
export const sendProjectRequestNotification = async (projectData) => {
  try {
    const transporter = createTransporter();

    const categoryEmoji = projectData.projectCategory === 'ready-made' ? '📦' : '🛠️';
    const categoryColor = projectData.projectCategory === 'ready-made' ? '#f59e0b' : '#8b5cf6';

    const mailOptions = {
      from: `"ZimScholar Notifications" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `${categoryEmoji} New Project Request (${projectData.projectCategory.toUpperCase()}) - ZimScholar`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${categoryColor}; border-bottom: 3px solid ${categoryColor}; padding-bottom: 10px;">
            ${categoryEmoji} New Project Request - ${projectData.projectCategory === 'ready-made' ? 'Ready-Made' : 'Custom'}
          </h2>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Student Information:</h3>
            <p><strong>Name:</strong> ${projectData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${projectData.email}">${projectData.email}</a></p>
            <p><strong>Phone/WhatsApp:</strong> <a href="tel:${projectData.phone}">${projectData.phone}</a></p>
            <p><strong>University:</strong> ${projectData.university}</p>
            <p><strong>Course:</strong> ${projectData.course}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid ${categoryColor}; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details:</h3>
            <p><strong>Category:</strong> <span style="background-color: ${categoryColor}20; color: ${categoryColor}; padding: 4px 12px; border-radius: 4px; font-weight: 600;">${projectData.projectCategory.toUpperCase()}</span></p>
            <p><strong>Project Type:</strong> ${projectData.projectType}</p>
            ${projectData.projectId ? `<p><strong>Project ID:</strong> <code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${projectData.projectId}</code></p>` : ''}
            ${projectData.deadline ? `<p><strong>Deadline:</strong> ${new Date(projectData.deadline).toLocaleDateString('en-GB')}</p>` : ''}
          </div>
          
          ${projectData.customRequirements ? `
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Custom Requirements:</h3>
            <p style="white-space: pre-wrap;">${projectData.customRequirements}</p>
          </div>
          ` : ''}
          
          ${projectData.additionalNotes ? `
          <div style="background-color: #fff; padding: 15px; border-left: 3px solid #d1d5db; margin: 20px 0;">
            <h4 style="color: #666; margin-top: 0;">Additional Notes:</h4>
            <p style="white-space: pre-wrap; color: #666;">${projectData.additionalNotes}</p>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #666; font-size: 14px;">
              📅 Submitted: ${new Date(projectData.submittedAt).toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}
            </p>
            <p style="color: #666; font-size: 14px;">
              🔗 <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5000'}/admin" 
                     style="color: ${categoryColor};">View in Admin Dashboard</a>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">
              💬 Quick Reply: <a href="https://wa.me/${projectData.phone.replace(/\D/g, '')}" 
                     style="color: #25D366;">WhatsApp ${projectData.name}</a>
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Project request notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending project request notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin reply to student
export const sendAdminReply = async (replyData) => {
  try {
    const mailOptions = {
      from: `"ZimScholar" <${process.env.EMAIL_USER}>`,
      to: replyData.recipientEmail,
      subject: replyData.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ZimScholar</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Academic Project Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none;">
            ${replyData.recipientName ? `<p style="font-size: 16px; color: #333;">Hello <strong>${replyData.recipientName}</strong>,</p>` : ''}
            
            <div style="margin: 20px 0; line-height: 1.8; color: #333; white-space: pre-wrap;">
              ${replyData.message}
            </div>
            
            ${replyData.attachments && replyData.attachments.length > 0 ? `
            <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📎 Attached Files:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${replyData.attachments.map(att => `<li style="margin: 5px 0; color: #666;">${att.filename}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
              <p style="color: #666; font-size: 14px; margin: 5px 0;">
                If you have any questions, feel free to reply to this email or contact us via WhatsApp.
              </p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">
                Best regards,<br>
                <strong style="color: #667eea;">ZimScholar Team</strong>
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} ZimScholar. All rights reserved.
            </p>
          </div>
        </div>
      `,
      attachments: replyData.attachments || []
    };

    const info = await sendMailWithFallback(mailOptions);
    console.log('Admin reply email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin reply email:', {
      message: error.message,
      code: error.code || null,
      command: error.command || null,
      host: process.env.EMAIL_HOST || null,
      port: Number(process.env.EMAIL_PORT) || null,
      fallback: error.originalError ? {
        message: error.originalError.message,
        code: error.originalError.code || null,
        command: error.originalError.command || null,
      } : null,
    });
    return { success: false, error: error.message, code: error.code || null };
  }
};

// Send professional quotation PDF to client
export const sendQuotationEmail = async (quotationData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ZimScholar" <${process.env.EMAIL_USER}>`,
      to: quotationData.clientEmail,
      subject: `Your Quotation from ZimScholar - ${quotationData.quotationNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">ZimScholar</h1>
            <p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 16px;">Academic Project Services</p>
          </div>
          
          <div style="background: white; padding: 40px; border: 1px solid #e5e5e5; border-top: none;">
            <h2 style="color: #4f46e5; margin: 0 0 20px 0; font-size: 24px;">Your Professional Quotation</h2>
            
            <p style="font-size: 16px; color: #333; line-height: 1.8;">
              Dear <strong>${quotationData.clientName}</strong>,
            </p>
            
            <p style="font-size: 15px; color: #555; line-height: 1.8;">
              Thank you for your interest in ZimScholar's services. We are pleased to provide you with a detailed 
              quotation for your <strong>${quotationData.projectType}</strong> project.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 5px solid #4f46e5;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📋 Quotation Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Quote Number:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${quotationData.quotationNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Date Issued:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${new Date(quotationData.dateIssued).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Valid Until:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; text-align: right;">${new Date(quotationData.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr style="border-top: 2px solid #4f46e5;">
                  <td style="padding: 15px 0 8px 0; color: #1e40af; font-size: 16px;"><strong>Total Amount:</strong></td>
                  <td style="padding: 15px 0 8px 0; color: #1e40af; font-size: 20px; font-weight: bold; text-align: right;">$${quotationData.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 15px; color: #555; line-height: 1.8;">
              Please find the complete quotation details attached as a PDF document. This quotation includes:
            </p>
            
            <ul style="color: #555; line-height: 2; margin: 20px 0; padding-left: 25px;">
              <li>Detailed breakdown of services</li>
              <li>Pricing and payment terms</li>
              <li>Project timeline expectations</li>
              <li>Terms and conditions</li>
            </ul>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                ⏰ <strong>Please Note:</strong> This quotation is valid until ${new Date(quotationData.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}. 
                To secure your project and our services, please confirm your acceptance before this date.
              </p>
            </div>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 10px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 16px;">💚 Next Steps</h3>
              <ol style="color: #065f46; line-height: 2; margin: 0; padding-left: 25px;">
                <li>Review the attached quotation carefully</li>
                <li>Contact us if you have any questions</li>
                <li>Reply to confirm your acceptance</li>
                <li>Arrange the initial deposit payment</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 40px 0 30px 0;">
              <a href="mailto:${process.env.EMAIL_USER}?subject=Re: Quotation ${quotationData.quotationNumber}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; 
                        font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Accept Quotation
              </a>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📞 Need Clarification?</h3>
              <p style="color: #666; margin: 5px 0; font-size: 14px;">
                <strong>Email:</strong> <a href="mailto:zimscholarprojects@gmail.com" style="color: #4f46e5;">zimscholarprojects@gmail.com</a>
              </p>
              <p style="color: #666; margin: 5px 0; font-size: 14px;">
                <strong>WhatsApp:</strong> <a href="https://wa.me/263785183361" style="color: #25D366;">+263 78 518 3361</a>
              </p>
              <p style="color: #666; margin: 5px 0; font-size: 14px;">
                <strong>Response Time:</strong> Within 2-4 hours during business hours
              </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e5e5e5;">
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 10px 0;">
                We look forward to working with you on your academic project. Our team is committed to 
                delivering high-quality work that meets your requirements and exceeds expectations.
              </p>
              <p style="color: #666; font-size: 14px; margin: 15px 0 5px 0;">
                Best regards,<br>
                <strong style="color: #4f46e5; font-size: 16px;">The ZimScholar Team</strong>
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} ZimScholar. All rights reserved.
            </p>
            <p style="color: #6b7280; font-size: 11px; margin: 0;">
              Professional Academic Project Services | Zimbabwe
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: `ZimScholar-Quotation-${quotationData.quotationNumber}.pdf`,
        path: quotationData.pdfPath,
        contentType: 'application/pdf'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Quotation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending quotation email:', error);
    return { success: false, error: error.message };
  }
};

// Send professional project document delivery email to customer
export const sendDocumentDeliveryEmail = async (deliveryData) => {
  const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB per attachment
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024;    // 100MB total
  
  try {
    const transporter = createTransporter();
    
    // Validate attachment sizes before attempting to send
    let totalSize = 0;
    const validAttachments = [];
    
    if (deliveryData.attachments && Array.isArray(deliveryData.attachments)) {
      for (const att of deliveryData.attachments) {
        const attSize = att.content ? att.content.length : 0;
        
        if (attSize > MAX_ATTACHMENT_SIZE) {
          console.warn(`Attachment ${att.filename} exceeds size limit (${(attSize / 1024 / 1024).toFixed(2)}MB), skipping`);
          continue;
        }
        
        totalSize += attSize;
        if (totalSize > MAX_TOTAL_SIZE) {
          console.warn('Total attachment size exceeds limit, stopping here');
          break;
        }
        
        validAttachments.push(att);
      }
    }
    
    if (validAttachments.length === 0 && deliveryData.attachments?.length > 0) {
      return { 
        success: false, 
        error: 'All attachments exceed maximum allowed size. Please send files separately.' 
      };
    }

    const attachmentsList = validAttachments && validAttachments.length > 0
      ? validAttachments.map(att => 
          `<tr>
            <td style="padding: 10px 15px; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 10px;">📄</span>
                  <span style="color: #374151; font-size: 14px;">${att.filename}</span>
                </div>
                <span style="color: #9ca3af; font-size: 12px;">${att.content ? (att.content.length / 1024 / 1024).toFixed(2) : '0'}MB</span>
              </div>
            </td>
          </tr>`
        ).join('')
      : '';

    const mailOptions = {
      from: `"ScholarXAfrica" <${process.env.EMAIL_USER}>`,
      to: deliveryData.recipientEmail,
      subject: `📦 Project Delivery: ${deliveryData.projectTitle} - ScholarXAfrica`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #4f46e5 100%); padding: 45px 40px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">ScholarXAfrica</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 15px; font-weight: 400;">Professional Academic Project Services</p>
            <div style="margin-top: 25px; background: rgba(255,255,255,0.15); border-radius: 10px; padding: 15px 25px; display: inline-block;">
              <p style="color: white; margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">📦 Project Delivery</p>
            </div>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; padding: 40px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            <!-- Greeting -->
            <p style="font-size: 17px; color: #1f2937; line-height: 1.6; margin: 0 0 8px 0;">
              Dear <strong>${deliveryData.recipientName}</strong>,
            </p>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.7; margin: 0 0 25px 0;">
              We are excited to deliver your completed project! Your documents have been carefully prepared and are attached to this email.
            </p>
            
            <!-- Project Details Card -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #bfdbfe;">
              <h3 style="margin: 0 0 18px 0; color: #1e40af; font-size: 18px; font-weight: 700;">📋 Project Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;"><strong>Project:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${deliveryData.projectTitle}</td>
                </tr>
                ${deliveryData.projectType ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Type:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${deliveryData.projectType}</td>
                </tr>` : ''}
                ${deliveryData.university ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>University:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${deliveryData.university}</td>
                </tr>` : ''}
                ${deliveryData.course ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Course:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${deliveryData.course}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Delivery Date:</strong></td>
                  <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                </tr>
              </table>
            </div>

            <!-- Custom Message -->
            ${deliveryData.message ? `
            <div style="background: #f9fafb; border-radius: 10px; padding: 20px 25px; margin: 25px 0; border-left: 4px solid #7c3aed;">
              <h3 style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message from our team:</h3>
              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${deliveryData.message}</p>
            </div>` : ''}
            
            <!-- Attached Documents -->
            ${attachmentsList ? `
            <div style="margin: 30px 0;">
              <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0; font-weight: 700;">📎 Attached Documents (${validAttachments.length} file${validAttachments.length !== 1 ? 's' : ''})</h3>
              <div style="border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f3f4f6;">
                      <th style="padding: 12px 15px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">File Name & Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${attachmentsList}
                  </tbody>
                </table>
              </div>
            </div>` : ''}
            
            <!-- Important Notes -->
            <div style="background: #fffbeb; border-radius: 10px; padding: 20px 25px; margin: 30px 0; border: 1px solid #fde68a;">
              <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 15px;">⚠️ Important Notes</h3>
              <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 2; font-size: 14px;">
                <li>Please review all delivered files carefully</li>
                <li>If you need any revisions, contact us within 7 days</li>
                <li>Keep these files in a secure location</li>
                <li>Do not share these files with others</li>
              </ul>
            </div>
            
            <!-- Satisfaction Section -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 10px; padding: 25px; margin: 30px 0; border: 1px solid #bbf7d0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px;">🌟 Your Satisfaction Matters</h3>
              <p style="color: #047857; font-size: 14px; line-height: 1.6; margin: 0;">
                We strive for excellence in every project. If you're happy with our work,<br>
                we'd appreciate a recommendation to fellow students!
              </p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 35px 0 25px 0;">
              <a href="mailto:${process.env.EMAIL_USER}?subject=Re: Project Delivery - ${deliveryData.projectTitle}" 
                 style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); 
                        color: white; padding: 14px 35px; text-decoration: none; border-radius: 10px; 
                        font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                Need Revisions? Contact Us
              </a>
            </div>
            
            <!-- Contact Info -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 15px;">📞 Get in Touch</h3>
              <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
                <strong>Email:</strong> <a href="mailto:zimscholarprojects@gmail.com" style="color: #4f46e5; text-decoration: none;">zimscholarprojects@gmail.com</a>
              </p>
              <p style="color: #6b7280; margin: 4px 0; font-size: 14px;">
                <strong>WhatsApp:</strong> <a href="https://wa.me/263785183361" style="color: #25D366; text-decoration: none;">+263 78 518 3361</a>
              </p>
            </div>
            
            <!-- Sign off -->
            <div style="margin-top: 30px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                Thank you for choosing ScholarXAfrica for your academic project needs. We wish you the very best with your studies!
              </p>
              <p style="color: #4b5563; font-size: 14px; margin: 15px 0 0 0;">
                Warm regards,<br>
                <strong style="color: #4f46e5; font-size: 16px;">The ScholarXAfrica Team</strong>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #111827; padding: 30px 40px; text-align: center; border-radius: 0 0 16px 16px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
              © ${new Date().getFullYear()} ScholarXAfrica. All rights reserved.
            </p>
            <p style="color: #6b7280; font-size: 11px; margin: 0;">
              Professional Academic Project Services • Supporting African Students Worldwide
            </p>
            <p style="color: #4b5563; font-size: 11px; margin: 8px 0 0 0;">
              This email contains confidential project deliverables. Please do not forward.
            </p>
          </div>
        </div>
      `,
      attachments: validAttachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Document delivery email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending document delivery email:', error);
    
    // Provide specific error messages for debugging
    let errorMessage = error.message;
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      errorMessage = 'Email server connection timeout. Large attachments may need time to upload.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Could not connect to email server. Please verify email configuration.';
    } else if (error.message.includes('size')) {
      errorMessage = 'Attachment size exceeds limit. Please send fewer or smaller documents.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Helper function to send documents via streaming/chunks if needed
export const sendLargeDocumentDelivery = async (deliveryData) => {
  // This sends documents in multiple emails if they exceed size limits
  const MAX_EMAIL_SIZE = 20 * 1024 * 1024; // 20MB per email
  
  try {
    const allAttachments = deliveryData.attachments || [];
    if (allAttachments.length === 0) {
      return await sendDocumentDeliveryEmail(deliveryData);
    }
    
    let currentBatch = [];
    let currentSize = 0;
    const results = [];
    
    for (const attachment of allAttachments) {
      const attSize = attachment.content ? attachment.content.length : 0;
      
      if (currentSize + attSize > MAX_EMAIL_SIZE && currentBatch.length > 0) {
        // Send current batch
        const result = await sendDocumentDeliveryEmail({
          ...deliveryData,
          attachments: currentBatch,
          message: `${deliveryData.message}\n\n[Part ${results.length + 1} of multiple deliveries]`
        });
        
        results.push(result);
        if (!result.success) {
          return result;
        }
        
        currentBatch = [];
        currentSize = 0;
      }
      
      currentBatch.push(attachment);
      currentSize += attSize;
    }
    
    // Send remaining batch
    if (currentBatch.length > 0) {
      const result = await sendDocumentDeliveryEmail({
        ...deliveryData,
        attachments: currentBatch,
        message: results.length > 0 
          ? `${deliveryData.message}\n\n[Final batch of documents]`
          : deliveryData.message
      });
      
      results.push(result);
    }
    
    return results[results.length - 1];
  } catch (error) {
    console.error('Error in large document delivery:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendContactNotification,
  sendQuoteRequestNotification,
  sendProjectRequestNotification,
  sendAdminReply,
  sendQuotationEmail,
  sendDocumentDeliveryEmail,
  sendLargeDocumentDelivery,
};
