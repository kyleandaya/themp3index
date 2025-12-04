import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMemories } from '../utils/storage'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])
  const [currentIndex, setCurrentIndex] = useState(parseInt(id) || 0)
  const audioPlayerRef = useRef(null)

  useEffect(() => {
    const loadedMemories = getMemories()
    setMemories(loadedMemories)

    if (id !== undefined) {
      const index = parseInt(id)
      if (index >= 0 && index < loadedMemories.length) {
        setCurrentIndex(index)
      } else {
        alert('Memory not found')
        navigate('/gallery')
      }
    }
  }, [id, navigate])

  useEffect(() => {
    if (memories.length > 0 && currentIndex >= 0 && currentIndex < memories.length) {
      const memory = memories[currentIndex]
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = memory.audioData
        audioPlayerRef.current.load()
      }
    }
  }, [currentIndex, memories])

  const currentMemory = memories[currentIndex]

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (memories.length === 0) {
    return (
      <div className="player-container">
        <header className="player-header">
          <button className="back-btn" onClick={() => navigate('/gallery')} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
            <span className="material-icons">arrow_back</span> back to library
          </button>
          <h1 className="handwritten-title">memory</h1>
        </header>
        <main className="player-content">
          <div className="sticky-notes-container">
            <div className="sticky-notes">
              <div className="sticky-note empty-note">no memories yet. be the first to share your thoughts.</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!currentMemory) {
    return null
  }

  const recipientName = currentMemory.recipientName || 'someone'

  return (
    <div className="player-container">
      <header className="player-header">
        <a href="/gallery" className="back-btn">
          <span className="material-icons">arrow_back</span> back to library
        </a>
        <h1 className="handwritten-title">memory</h1>
      </header>

      <main className="player-content">
        <div className="player-section">
          <div className="audio-player-section">
            <p className="recipient-name-display">for {recipientName}</p>
            <audio ref={audioPlayerRef} controls className="audio-player"></audio>
            <p className="file-name-display">{currentMemory.fileName}</p>
          </div>
        </div>

        <div className="messages-section">
          <div className="sticky-notes-container">
            <div className="sticky-notes">
              <div className="sticky-note" style={{animation: 'fadeIn 0.5s ease-in'}}>
                {currentMemory.memory}
              </div>
            </div>
            <div className="carousel-controls">
              <button 
                className="carousel-btn" 
                disabled={currentIndex === 0}
                onClick={handlePrev}
              >
                <span className="material-icons">arrow_back</span> previous
              </button>
              <button 
                className="carousel-btn" 
                disabled={currentIndex === memories.length - 1}
                onClick={handleNext}
              >
                next <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Player

