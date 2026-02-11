import { Router, Request } from 'express';
import multer from 'multer';
import { insforge } from '../utils/insforge';
import { authenticate } from '../middleware/auth';

// Define AuthRequest to include user
interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
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
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // 1. Upload to InsForge Storage
    // Using 'avatars' bucket. Ensure this bucket exists in InsForge Dashboard or create it via MCP if possible (but I can't).
    // Filename: userId/timestamp-filename
    const timestamp = Date.now();
    // Sanitize filename
    const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${req.user.id}/${timestamp}-${sanitizedOriginalName}`;

    // Convert Buffer to Blob for SDK
    const blob = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype });

    const { data, error } = await insforge.storage
      .from('avatars')
      .upload(filename, blob);

    if (error) {
      console.error('Storage upload error:', error);
      return res.status(500).json({ error: error.message });
    }

    // 2. Get Public URL
    const publicUrl = insforge.storage
      .from('avatars')
      .getPublicUrl(filename);

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
