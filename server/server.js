import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date(),
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Demo login endpoint (works without database)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  if (email === 'admin@example.com' && password === 'password123') {
    res.json({
      _id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      token: 'demo_admin_token_123'
    });
  } else if (email === 'supervisor@example.com' && password === 'password123') {
    res.json({
      _id: '2',
      name: 'Supervisor User',
      email: 'supervisor@example.com',
      role: 'supervisor',
      token: 'demo_supervisor_token_456'
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Demo dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalStudents: 25,
    totalCamps: 2,
    totalGroups: 5,
    topPerformers: [
      { name: 'Ahmed Ali', memorized: 45, score: 95 },
      { name: 'Fatima Hassan', memorized: 42, score: 90 },
      { name: 'Omar Mahmoud', memorized: 38, score: 85 }
    ]
  });
});

// MongoDB Connection (optional - app works without it)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4 // Force IPv4
    });
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    console.log('⚠️  Continuing without database - using demo data...');
  }
};

// Try to connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for http://localhost:3000`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
});
