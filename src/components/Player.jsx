import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMemories } from '../utils/storage'

function Player() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])
  const [currentMemoryId, setCurrentMemoryId] = useState(null)
  const [loading, setLoading] = useState(true)
  const audioPlayerRef = useRef(null)

  useEffect(() => {
    const loadMemories = async () => {
      try {
        setLoading(true)
        const loadedMemories = await getMemories()
        setMemories(loadedMemories)

        if (id !== undefined) {
          const memoryId = parseInt(id)
          const memory = loadedMemories.find(m => m.id === memoryId)
          if (memory) {
            setCurrentMemoryId(memoryId)
          } else {
            alert('Memory not found')
            navigate('/gallery')
          }
        } else if (loadedMemories.length > 0) {
          setCurrentMemoryId(loadedMemories[0].id)
        }
      } catch (error) {
        console.error('Error loading memories:', error)
        setMemories([])
      } finally {
        setLoading(false)
      }
    }
    loadMemories()
  }, [id, navigate])

  useEffect(() => {
    if (currentMemoryId && memories.length > 0) {
      const memory = memories.find(m => m.id === currentMemoryId)
      if (memory && audioPlayerRef.current) {
        audioPlayerRef.current.src = memory.audioData
        audioPlayerRef.current.load()
      }
    }
  }, [currentMemoryId, memories])

  const currentMemory = memories.find(m => m.id === currentMemoryId)
  const currentIndex = memories.findIndex(m => m.id === currentMemoryId)

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < memories.length - 1) {
      setCurrentMemoryId(memories[currentIndex + 1].id)
      navigate(`/player/${memories[currentIndex + 1].id}`, { replace: true })
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentMemoryId(memories[currentIndex - 1].id)
      navigate(`/player/${memories[currentIndex - 1].id}`, { replace: true })
    }
  }

  if (loading) {
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
              <div className="sticky-note empty-note">loading...</div>
            </div>
          </div>
        </main>
      </div>
    )
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

