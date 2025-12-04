# The MP3 Index 🎵

A portable net art  where users upload their favorite songs and share the strongest memories attached to them—whether good, bad, sad, happy, or anything in between.

## The Concept

This website creates a space for people to share the emotional connections they have with music. Each song becomes a vessel for memories—those moments, people, and feelings that become forever intertwined with a piece of music.

**Designed as a portable net art piece** - copy this folder to a USB thumb drive and share it. Each person who loads it can add their own audio files and memories, building a collective archive of musical memories.

## Quick Start (React Version)

### For Development:
```bash
npm install
npm run dev
```

### For Thumb Drive Distribution:
```bash
npm install
npm run build
```

Then copy the `dist` folder to your thumb drive. See `REACT_SETUP.md` for detailed instructions.

## Features

- **Audio Upload**: Upload your favorite song (MP3, MP4, WAV, or any audio file)
- **Memory Sharing**: Share one of the strongest memories attached to that music
- **Recipient Names**: Write to someone the song reminds you of
- **Hover Audio Preview**: Hover over memories in the gallery to hear a 3-second preview
- **Intimate Gallery**: Browse all shared memories as vinyl records
- **Memory Carousel**: Read through memories displayed as sticky notes, one at a time
- **Portable Design**: Works completely offline - perfect for thumb drive distribution

## Design Aesthetic

Inspired by "The Unsent Project," the website features:
- **American Typewriter font** throughout for a typewritten letter aesthetic
- **White/off-white background** with dark text - simulating handwritten letters on paper
- **Raw, vulnerable presentation** - minimal design that lets memories speak
- **Sticky note memories** - memories appear as handwritten notes in a carousel
- **Vinyl record gallery** - memories displayed as vinyl records with randomized label colors

## How to Use

### As a Portable Net Art Piece

1. **Build the project** (see REACT_SETUP.md)
2. **Copy the `dist` folder** to a USB thumb drive
3. **Open `index.html`** in any modern web browser (works offline!)
4. Each person can:
   - Upload their favorite song
   - Share a memory addressed to someone
   - Browse all memories in the library
   - Hover over vinyl records to hear audio previews
   - Click to listen to full songs and read memories

### Individual Use

1. **Share a Memory** (`/`):
   - Click to upload your favorite song (any audio file format)
   - Once uploaded, you'll see an audio player
   - Enter the name of someone this song reminds you of
   - Write to them as if they could hear this song with you right now
   - Click "share your memory"

2. **Browse Library** (`/gallery`):
   - View all shared memories as vinyl record cards
   - **Hover over any card** to hear a 3-second audio preview and see the recipient's name
   - Each card shows a vinyl record with a randomized label color
   - Click any card to listen to the song and read the full memory

3. **Listen & Read** (`/player/:id`):
   - Play the uploaded audio file
   - See the recipient's name
   - Read memories shared by others
   - Navigate through memories using Previous/Next buttons
   - Memories appear as handwritten sticky notes

## File Structure

```
The MP3 Index/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Home.jsx        # Upload and memory input page
│   │   ├── Gallery.jsx     # Library of all memories
│   │   └── Player.jsx       # Audio player with memory carousel
│   ├── utils/
│   │   └── storage.js      # localStorage helper functions
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # All styles
├── dist/                   # Built files (after npm run build)
├── package.json
├── vite.config.js
├── REACT_SETUP.md          # Detailed setup instructions
└── README.md               # This file
```

## Technical Details

- **Framework**: React 18 with React Router
- **Build Tool**: Vite
- **Storage**: Uses browser localStorage to persist audio files and memories
- **Audio Support**: Accepts MP3, MP4, WAV, and other audio formats
- **File Size**: Large files (>5MB) may have storage limitations
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capable**: Works completely offline - perfect for portable distribution
- **Font Fallbacks**: Uses system fonts if Google Fonts aren't available offline

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage
- FileReader API
- HTML5 Audio
- CSS Grid and Flexbox

## Notes

- **Storage Limitations**: Browser localStorage typically has a 5-10MB limit. Very large audio files may not save properly.
- **Portable Design**: All data is stored locally in each browser. When shared on a thumb drive, each person's browser will have its own collection of memories.
- **File Formats**: The website accepts any audio file format supported by HTML5 audio (MP3, MP4, WAV, OGG, etc.)
- **Offline Use**: The website works completely offline. Google Fonts will load if internet is available, but system font fallbacks ensure it works without internet.

## Hover Audio Preview

When browsing the library, hover over any vinyl record to hear a 3-second preview of the audio. The vinyl record will spin while the preview plays. This creates an intimate, exploratory experience as you discover memories through sound.

## Design Philosophy

This project is inspired by "The Unsent Project" - a web art piece that displays unsent text messages. Like that project, The MP3 Index creates a space for vulnerability, honesty, and emotional connection. The typewriter font on a paper-like background, muted colors, and intimate presentation are designed to make sharing feel safe and personal.

The white background with dark text simulates typewritten letters, creating a more intimate, personal feeling compared to digital interfaces.

## Credits

Design inspired by [The Unsent Project](https://unsentproject.com/) by Rora Blue.

---

*Share the songs that hold your memories.*

**Portable Net Art Piece** - Copy to a thumb drive and share. Each person adds their own memories, building a collective archive.
