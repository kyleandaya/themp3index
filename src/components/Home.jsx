import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveMemory, getRandomLabelColor } from '../utils/storage'

function Home() {
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [audioDataUrl, setAudioDataUrl] = useState(null)
  const [fileName, setFileName] = useState('')
  const [showAudioPreview, setShowAudioPreview] = useState(false)
  const [showMemorySection, setShowMemorySection] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [memory, setMemory] = useState('')
  const fileInputRef = useRef(null)
  const audioPlayerRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) {
      return
    }

    // Check if it's an audio or video file
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      alert('Please upload an audio or video file')
      fileInputRef.current.value = ''
      return
    }

    setUploadedFile(file)
    setFileName(file.name)

    // Read file as data URL for storage
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setAudioDataUrl(dataUrl)
      
      // Show audio preview
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = dataUrl
      }
      setShowAudioPreview(true)
      setShowMemorySection(true)
    }
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
      fileInputRef.current.value = ''
    }
    
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert('Please upload a song first')
      return
    }

    if (!recipientName.trim()) {
      alert('Please enter the name of someone this song reminds you of')
      return
    }

    if (!memory.trim()) {
      alert('Please share your memory')
      return
    }

    // Check file size limit (50MB server limit)
    const fileSizeMB = uploadedFile.size / (1024 * 1024)
    if (fileSizeMB > 50) {
      alert('File is too large. Maximum size is 50MB.')
      return
    }

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn')
    const originalText = submitBtn?.textContent
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Uploading...'
    }

    try {
      const labelColor = getRandomLabelColor()
      await saveMemory(uploadedFile, recipientName.trim(), memory.trim(), labelColor)
      
      // Clear form
      fileInputRef.current.value = ''
      setUploadedFile(null)
      setAudioDataUrl(null)
      setFileName('')
      setShowAudioPreview(false)
      setShowMemorySection(false)
      setRecipientName('')
      setMemory('')
      
      // Show success message
      alert('Your memory has been shared. Thank you.')
      
      // Optionally redirect to gallery
      // navigate('/gallery')
    } catch (error) {
      alert(error.message || 'Error saving memory. Please try again.')
      console.error('Error:', error)
    } finally {
      // Restore button state
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = originalText || 'share your memory'
      }
    }
  }

  return (
    <div className="container">
      <header>
        <h1 className="handwritten-title">the mp3 index</h1>
        <p className="subtitle">share the song that holds your memory</p>
      </header>

      <main className="main-content">
        <div className="form-section">
          <div className="upload-section">
            <label htmlFor="audioFile" className="upload-label">
              <div className="upload-box">
                <span className="upload-icon material-icons">library_music</span>
                <span className="upload-text">upload your song</span>
                <span className="upload-hint">(mp3, mp4, wav, or any audio file)</span>
                <span className="upload-suggestion">
                  <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>lightbulb</span> 
                  {' '}tip: use mp3 format for longer songs or audios
                </span>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                id="audioFile" 
                accept="audio/*,video/mp4"
                className="file-input"
                onChange={handleFileChange}
              />
            </label>
            {fileName && (
              <div className="file-name" style={{display: 'block'}}>{fileName}</div>
            )}
          </div>

          {showAudioPreview && (
            <div className="audio-preview" style={{display: 'block'}}>
              <audio ref={audioPlayerRef} controls className="audio-player"></audio>
            </div>
          )}

          {showMemorySection && (
            <div className="memory-section" style={{display: 'block'}}>
              <div className="recipient-section">
                <h3 className="recipient-prompt">who does this song remind you of?</h3>
                <p className="recipient-hint">this can be a full name, just the first name, a nickname, or something you remember them by</p>
                <input 
                  type="text" 
                  id="recipientName" 
                  placeholder="enter their name..."
                  className="recipient-input"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>

              <h3 className="memory-prompt">write to them as if they could hear this song with you right now</h3>
              <p className="memory-hint">what would you say to them in this moment? you can be gentle, honest, messy, or unfinished</p>
              <textarea 
                id="memoryText" 
                placeholder="start your note to them here..."
                className="memory-input"
                rows="8"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
              ></textarea>
            </div>
          )}

          <button 
            className="submit-btn" 
            disabled={!uploadedFile || !audioDataUrl || !recipientName.trim() || !memory.trim()}
            onClick={handleSubmit}
          >
            share your memory
          </button>
        </div>
      </main>

      <footer>
        <button className="gallery-link" onClick={() => navigate('/gallery')} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
          view library <span className="material-icons">arrow_forward</span>
        </button>
      </footer>
    </div>
  )
}

export default Home

