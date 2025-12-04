# The MP3 Index - React Setup Guide

## 🎵 Portable Net Art Project

This is a React-based web art project designed to be distributed on a USB thumb drive. Each person who loads it can add their own audio files and memories, creating an ever-growing archive of musical connections.

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Mode** (for testing)
   ```bash
   npm run dev
   ```
   This will start a development server at `http://localhost:3000`

3. **Build for Production** (for thumb drive distribution)
   ```bash
   npm run build
   ```
   This creates a `dist` folder with all the files needed to run the app.

## 🚀 Running from a Thumb Drive

### Option 1: Using the Built Files (Recommended)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Copy the `dist` folder to your thumb drive**

3. **To run the app:**
   - **Windows**: Double-click `dist/index.html` (or use a local server)
   - **Mac/Linux**: Open `dist/index.html` in a browser (or use a local server)

   **Note**: For best results, use a local server. See "Option 2" below.

### Option 2: Using a Local Server (Best Experience)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Copy the entire project folder to your thumb drive**

3. **On any computer:**
   ```bash
   # Navigate to the project folder on the thumb drive
   cd /path/to/thumbdrive/the-mp3-index
   
   # Install dependencies (first time only, or if node_modules is missing)
   npm install
   
   # Run the preview server
   npm run serve
   ```
   
   This will start a server at `http://localhost:3000` that anyone can access.

### Option 3: Using Python (No Node.js Required)

If the target computer doesn't have Node.js:

1. **Build the project** (on a computer with Node.js):
   ```bash
   npm run build
   ```

2. **Copy the `dist` folder to your thumb drive**

3. **Create a simple server script** (`start-server.bat` for Windows or `start-server.sh` for Mac/Linux):

   **Windows (start-server.bat):**
   ```batch
   @echo off
   cd dist
   python -m http.server 3000
   pause
   ```

   **Mac/Linux (start-server.sh):**
   ```bash
   #!/bin/bash
   cd dist
   python3 -m http.server 3000
   ```

4. **Run the script** - it will start a server at `http://localhost:3000`

## 📁 Project Structure

```
the-mp3-index/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Home.jsx        # Upload and memory input page
│   │   ├── Gallery.jsx     # Library of all memories
│   │   └── Player.jsx      # Audio player with memory carousel
│   ├── utils/
│   │   └── storage.js      # localStorage helper functions
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # All styles
├── dist/                   # Built files (after npm run build)
├── package.json
├── vite.config.js
└── REACT_SETUP.md          # This file
```

## 🎨 Features

- **Audio Upload**: Users upload MP3/audio files
- **Memory Sharing**: Write messages addressed to someone the song reminds them of
- **Vinyl Record Gallery**: Browse memories as vinyl records with randomized label colors
- **Hover Audio Preview**: Hover over records to hear 3-second previews
- **Memory Carousel**: Navigate through all memories with audio playback
- **Portable**: Works completely offline, perfect for thumb drive distribution
- **Ever-Growing**: Each person adds their own memories to the collection

## 💾 Data Storage

- All memories are stored in **browser localStorage**
- Each person's browser will have its own collection
- To share across devices, you would need a backend (future enhancement)

## 🔧 Troubleshooting

### "Module not found" errors
- Run `npm install` to install dependencies

### Audio preview not working
- Make sure the browser allows autoplay
- Check browser console for errors

### Build fails
- Make sure you have Node.js v16+ installed
- Try deleting `node_modules` and running `npm install` again

### Port already in use
- Change the port in `vite.config.js` or use `npm run serve -- --port 3001`

## 📝 Notes

- The app works completely offline after building
- Google Fonts will load if internet is available, but system fonts work as fallbacks
- Large audio files (>5MB) may hit browser storage limits
- Each browser/computer will have its own collection of memories

## 🎯 For Thumb Drive Distribution

1. Build the project: `npm run build`
2. Copy the `dist` folder to your thumb drive
3. Include a README with instructions for running
4. Optionally include a simple server script (Python or Node.js)

Enjoy sharing your musical memories! 🎶

