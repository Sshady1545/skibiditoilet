import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Environment configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- SECURITY MIDDLEWARE ---

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3001", "http://localhost:5173", "ws://localhost:5173", "https://api.mcsrvstat.us"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:5173"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allowed for dev/animations
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for dev
}));

// Allow CORS for dev
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

// --- API ROUTES ---

// Example: Moving business logic to backend
// Instead of hardcoding data in HTML/JS, fetch it from here
app.get('/api/stats', (req: Request, res: Response) => {
  // Simulate secure database retrieval
  const stats = {
    users: 1500,
    downloads: 4500,
    active: 300
  };
  res.json(stats);
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Handle React routing, return all requests to React app
app.get('*all', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running securely on http://localhost:${PORT}`);
});
