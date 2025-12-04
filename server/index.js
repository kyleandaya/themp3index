const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded audio files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio and video files
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed'));
    }
  }
});

// Initialize database
const dbPath = path.join(__dirname, 'memories.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create memories table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileName TEXT NOT NULL,
      filePath TEXT NOT NULL,
      memory TEXT NOT NULL,
      recipientName TEXT NOT NULL,
      labelColor TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      fileSize INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Memories table ready');
      }
    });
  }
});

// API Routes

// GET all memories
app.get('/api/memories', (req, res) => {
  db.all('SELECT * FROM memories ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching memories:', err);
      return res.status(500).json({ error: 'Failed to fetch memories' });
    }
    
    // Convert file paths to URLs
    const memories = rows.map(row => ({
      id: row.id,
      fileName: row.fileName,
      audioData: `/uploads/${path.basename(row.filePath)}`,
      memory: row.memory,
      recipientName: row.recipientName,
      labelColor: row.labelColor,
      timestamp: row.timestamp,
      fileSize: row.fileSize
    }));
    
    res.json(memories);
  });
});

// GET a specific memory by ID
app.get('/api/memories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching memory:', err);
      return res.status(500).json({ error: 'Failed to fetch memory' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    const memory = {
      id: row.id,
      fileName: row.fileName,
      audioData: `/uploads/${path.basename(row.filePath)}`,
      memory: row.memory,
      recipientName: row.recipientName,
      labelColor: row.labelColor,
      timestamp: row.timestamp,
      fileSize: row.fileSize
    };
    
    res.json(memory);
  });
});

// POST a new memory
app.post('/api/memories', upload.single('audioFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  const { recipientName, memory, labelColor } = req.body;

  if (!recipientName || !memory) {
    // Delete uploaded file if validation fails
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Recipient name and memory text are required' });
  }

  const memoryObj = {
    fileName: req.file.originalname,
    filePath: req.file.path,
    memory: memory.trim(),
    recipientName: recipientName.trim(),
    labelColor: labelColor || getRandomLabelColor(),
    timestamp: new Date().toISOString(),
    fileSize: req.file.size
  };

  db.run(
    'INSERT INTO memories (fileName, filePath, memory, recipientName, labelColor, timestamp, fileSize) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      memoryObj.fileName,
      memoryObj.filePath,
      memoryObj.memory,
      memoryObj.recipientName,
      memoryObj.labelColor,
      memoryObj.timestamp,
      memoryObj.fileSize
    ],
    function(err) {
      if (err) {
        console.error('Error saving memory:', err);
        // Delete uploaded file if database insert fails
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Failed to save memory' });
      }

      // Return the saved memory with the correct ID
      const savedMemory = {
        id: this.lastID,
        fileName: memoryObj.fileName,
        audioData: `/uploads/${path.basename(memoryObj.filePath)}`,
        memory: memoryObj.memory,
        recipientName: memoryObj.recipientName,
        labelColor: memoryObj.labelColor,
        timestamp: memoryObj.timestamp,
        fileSize: memoryObj.fileSize
      };

      res.status(201).json(savedMemory);
    }
  );
});

// Helper function to get random label color
function getRandomLabelColor() {
  const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

