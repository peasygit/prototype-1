import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { insforge } from '../utils/insforge';
import { authenticate } from '../middleware/auth';

// Define AuthRequest to include user
interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage (Local Disk Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp-originalName
    const userId = (req as AuthRequest).user?.id || 'anonymous';
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${userId}-${timestamp}-${sanitizedOriginalName}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// POST /api/upload - Upload file
router.post('/', authenticate, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.user) {
      // Clean up uploaded file if authentication fails (though middleware should catch this)
      fs.unlinkSync(req.file.path);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Construct Public URL
    // Assuming backend is served at process.env.API_URL or relative path
    // For local dev, we use relative path from frontend proxy or absolute URL if needed
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const publicUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
