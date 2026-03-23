# Supabase MIME Type Validation Fix

## 🐛 Problem
When uploading `.ipynb` (Jupyter notebook) files to Supabase, the upload fails with:
```
[ERROR] Supabase upload error: {
  error: 'mime type application/octet-stream is not supported',
  bucket: 'attachments'
}
```

**Root Cause:** 
- Multer defaults unknown file types (like `.ipynb`) to `application/octet-stream`
- Supabase's attachments bucket rejects this MIME type
- No mapping existed to convert file extensions to proper MIME types

---

## ✅ Solution Implemented

### 1. **Created MIME Type Mapper** (`backend/utils/mimeTypes.js`)
Comprehensive utility that:
- Maps 50+ file extensions to proper MIME types
- Includes Jupyter notebooks → `application/x-ipynb+json`
- Handles scientific, code, and common file formats
- Provides intelligent fallback for unknown types

**Key Mappings:**
```javascript
'ipynb' → 'application/x-ipynb+json'
'pdf' → 'application/pdf'
'docx' → 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
'csv' → 'text/csv'
'zip' → 'application/zip'
// ... 50+ more
```

### 2. **Updated Supabase Storage** (`backend/config/supabaseStorage.js`)
- Imported `processFileMimeType` from mimeTypes utility
- Processes MIME type before Supabase upload
- Ensures proper type detection from filename

**Code Change:**
```javascript
// Before
const result = await uploadFile(file, bucket, filePath, 
  { contentType: file.mimetype || file.type }
);

// After
const mimeType = processFileMimeType(file);
const result = await uploadFile(file, bucket, filePath, 
  { contentType: mimeType }
);
```

### 3. **Updated Upload Middleware** (`backend/middleware/upload.js`)
- Added `'application/x-ipynb+json'` to allowed MIME types
- Allows `.ipynb` files to pass multer validation
- Supports portfolio project files with notebooks

---

## 📋 How It Works

**Upload Flow (Before vs After):**

**Before (❌ Failed):**
```
.ipynb file
  ↓
Multer (unknown type) → application/octet-stream
  ↓
Supabase validation ✗ REJECTED
```

**After (✅ Works):**
```
.ipynb file
  ↓
Multer passes (added to allowed list)
  ↓
processFileMimeType()
  - Detects .ipynb extension
  - Maps to application/x-ipynb+json
  ↓
Supabase validation ✓ ACCEPTED
  ↓
Upload successful
```

---

## 🧪 Testing the Fix

### Test 1: Upload Jupyter Notebook
```bash
# Using admin dashboard:
1. Go to Admin → Deliver Documents
2. Upload a .ipynb file
3. Should succeed (no 500 error)
```

### Test 2: Upload Other File Types
Test these file types to ensure nothing broke:
- `.pdf` - PDF documents
- `.docx` - Word documents
- `.xlsx` - Excel spreadsheets
- `.zip` - Archive files
- `.py` - Python scripts
- `.csv` - CSV data files
- `.json` - JSON files

### Test 3: Check Logs
```bash
# Should see:
✅ "File uploaded successfully"

# Should NOT see:
❌ "mime type ... is not supported"
❌ "application/octet-stream"
```

---

## 🚀 Deployment

### Step 1: Push Changes
```bash
git add backend/utils/mimeTypes.js
git add backend/config/supabaseStorage.js
git add backend/middleware/upload.js
git commit -m "Fix: Add MIME type mapping for Jupyter notebooks and file uploads"
git push origin main
```

### Step 2: Render Auto-Deploys
- Render watches GitHub and auto-deploys
- Check dashboard: https://dashboard.render.com
- Should see "Deploy successful" within 2-3 minutes

### Step 3: Verify Production
1. Test uploading an `.ipynb` file
2. Check admin dashboard logs
3. Monitor for errors in Render logs

---

## 📊 Supported File Types After Fix

### Notebooks & Scientific
- `ipynb` (Jupyter Notebooks) ✅ **[NOW FIXED]**

### Documents  
- `pdf`, `doc`, `docx`, `txt`, `rtf`, `md`

### Spreadsheets
- `xls`, `xlsx`, `csv`, `ods`

### Presentations
- `ppt`, `pptx`

### Archives
- `zip`, `rar`, `7z`, `tar`, `gz`, `bz2`

### Images
- `jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`, `bmp`

### Videos
- `mp4`, `mpeg`, `webm`, `mov`, `avi`, `mkv`

### Code
- `py`, `js`, `ts`, `java`, `cpp`, `sql`, `xml`, `json`

### Other
- `mp3` (audio), `flac` (audio), `html`, `css`

---

## ⚙️ How the MIME Type Mapper Works

Three-step process:

**Step 1: Extract Extension**
```javascript
filename = "clean_imbalanced_pipeline.ipynb"
ext = "ipynb"
```

**Step 2: Look Up Mapping**
```javascript
MIME_TYPES_MAP["ipynb"] = "application/x-ipynb+json"
```

**Step 3: Return Proper Type**
```javascript
contentType = "application/x-ipynb+json" (not application/octet-stream)
```

---

## 🔍 If Issues Persist

### Check 1: Verify Deployment
```bash
# SSH into Render
git log --oneline | head -1
# Should show your recent commit
```

### Check 2: Check File Extension
- Ensure file is actually named `.ipynb`
- Some editors may hide the extension
- Windows: Show file extensions in File Explorer

### Check 3: Monitor Logs
```bash
# Render Dashboard → Logs
# Search for: "File uploaded successfully"
# Or: "mime type"
```

### Check 4: Test Different File
Try uploading a `.pdf` file to isolate if it's Jupiter-specific

---

## 📝 Files Modified

| File | Change |
|------|--------|
| `backend/utils/mimeTypes.js` | **NEW** - MIME type mapper utility |
| `backend/config/supabaseStorage.js` | Updated - Use MIME type processor |
| `backend/middleware/upload.js` | Updated - Added ipynb to allowed types |

**Total Changes:** 3 files, ~150 lines added

---

## 🎯 Expected Results

✅ **Before Fix:** Upload `.ipynb` → 500 Error  
✅ **After Fix:** Upload `.ipynb` → Success  
✅ **Other formats:** Continue to work as expected  
✅ **Performance:** No degradation (MIME mapping is instant)

---

## 💡 Why This Approach?

**Alternative Solutions (Not Used):**
1. Disable Supabase MIME validation - Too risky for security
2. Manual case-by-case handling - Not scalable
3. Change file extension on upload - Breaks user experience

**Our Solution is Best Because:**
- ✅ Scalable - Handles 50+ file types
- ✅ Secure - Doesn't disable validation
- ✅ User-friendly - Transparent to end users
- ✅ Maintainable - Centralized MIME mapping
- ✅ Extensible - Easy to add new file types

---

**Status:** ✅ Ready for production deployment
**Test Date:** March 23, 2026
**Urgency:** High - Blocks document uploads with notebooks
