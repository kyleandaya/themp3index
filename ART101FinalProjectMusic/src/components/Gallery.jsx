import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMemories } from '../utils/storage'

function Gallery() {
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])
  const previewAudioRef = useRef(null)
  const fadeInIntervalRef = useRef(null)
  const fadeOutIntervalRef = useRef(null)
  const previewTimeoutRef = useRef(null)

  useEffect(() => {
    const loadedMemories = getMemories()
    setMemories(loadedMemories)
  }, [])

  const playPreview = (memory, cardElement) => {
    stopPreview(null)

    if (!memory.audioData) {
      console.log('No audio data for this memory')
      return
    }

    // Add spinning class to vinyl
    const vinylContainer = cardElement.querySelector('.vinyl-container-default')
    const vinylRecord = vinylContainer ? vinylContainer.querySelector('.vinyl-record') : null
    if (vinylRecord) {
      vinylRecord.classList.add('spinning')
    }

    // Create audio element if it doesn't exist
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio()
      previewAudioRef.current.volume = 0
    } else {
      previewAudioRef.current.volume = 0
    }

    // Set source and load
    previewAudioRef.current.src = memory.audioData
    previewAudioRef.current.currentTime = 0

    // Wait for audio to be ready
    previewAudioRef.current.addEventListener('loadeddata', () => {
      previewAudioRef.current.play().catch(e => {
        console.log('Preview play failed:', e)
        if (vinylRecord) {
          vinylRecord.classList.remove('spinning')
        }
        if (fadeInIntervalRef.current) {
          clearInterval(fadeInIntervalRef.current)
          fadeInIntervalRef.current = null
        }
      })
    }, { once: true })

    previewAudioRef.current.load()

    // Fade in
    fadeInIntervalRef.current = setInterval(() => {
      if (previewAudioRef.current && previewAudioRef.current.volume < 0.4) {
        previewAudioRef.current.volume = Math.min(previewAudioRef.current.volume + 0.05, 0.4)
      } else {
        if (fadeInIntervalRef.current) {
          clearInterval(fadeInIntervalRef.current)
          fadeInIntervalRef.current = null
        }
      }
    }, 50)

    // Stop after 3 seconds with fade out
    previewTimeoutRef.current = setTimeout(() => {
      if (previewAudioRef.current && previewAudioRef.current.currentTime < 3) {
        stopPreview(cardElement)
      }
    }, 3000)
  }

  const stopPreview = (cardElement) => {
    // Remove spinning class from vinyl
    if (cardElement) {
      const vinylContainer = cardElement.querySelector('.vinyl-container-default')
      const vinylRecord = vinylContainer ? vinylContainer.querySelector('.vinyl-record') : null
      if (vinylRecord) {
        vinylRecord.classList.remove('spinning')
      }
    }

    // Clear any pending timeouts
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
      previewTimeoutRef.current = null
    }

    // Clear fade intervals
    if (fadeInIntervalRef.current) {
      clearInterval(fadeInIntervalRef.current)
      fadeInIntervalRef.current = null
    }

    if (previewAudioRef.current) {
      // Fade out quickly
      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current)
      }

      fadeOutIntervalRef.current = setInterval(() => {
        if (previewAudioRef.current && previewAudioRef.current.volume > 0) {
          previewAudioRef.current.volume = Math.max(previewAudioRef.current.volume - 0.2, 0)
        } else {
          if (fadeOutIntervalRef.current) {
            clearInterval(fadeOutIntervalRef.current)
            fadeOutIntervalRef.current = null
          }
          if (previewAudioRef.current) {
            previewAudioRef.current.pause()
            previewAudioRef.current.currentTime = 0
            previewAudioRef.current.volume = 0.4
          }
        }
      }, 30)
    }
  }

  useEffect(() => {
    // Clean up on unmount
    return () => {
      stopPreview(null)
    }
  }, [])

  const VinylRecord = ({ labelColor }) => (
    <svg className="vinyl-record" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="100" cy="100" r="75" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="100" cy="100" r="65" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="100" cy="100" r="55" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="100" cy="100" r="35" fill={labelColor}/>
      <circle cx="100" cy="100" r="30" fill={labelColor} opacity="0.8"/>
      <circle cx="100" cy="100" r="8" fill="#1a1a1a"/>
    </svg>
  )

  return (
    <div className="container">
      <header>
        <div className="logo-mark">the mp3 index</div>
        <h1 className="handwritten-title">library</h1>
        <p className="subtitle">The mp3 index is a project to peek into others' relationships with music and sound. "Nostalgia is a mixed emotion that is often evoked by music."</p>
      </header>

      <main className="gallery-content">
        <div className="gallery-grid">
          {memories.length === 0 ? (
            <div className="empty-state">
              <p>no memories shared yet</p>
              <p style={{marginTop: '1rem', fontSize: '1.2rem'}}>be the first to share yours</p>
              <button className="btn-primary" onClick={() => navigate('/')}>share a memory</button>
            </div>
          ) : (
            memories.map((memory, index) => {
              const labelColor = memory.labelColor || ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'][Math.floor(Math.random() * 6)]
              const recipientName = memory.recipientName || 'someone'

              return (
                <div
                  key={memory.id || index}
                  className="gallery-card"
                  onClick={() => {
                    stopPreview(null)
                    navigate(`/player/${index}`)
                  }}
                  onMouseEnter={(e) => playPreview(memory, e.currentTarget)}
                  onMouseLeave={(e) => stopPreview(e.currentTarget)}
                >
                  <div className="memory-card-content">
                    <div className="vinyl-container-default">
                      <VinylRecord labelColor={labelColor} />
                    </div>
                    <div className="recipient-name-hover">for {recipientName}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>

      <footer>
        <button className="gallery-link" onClick={() => navigate('/')} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
          <span className="material-icons">arrow_back</span> share your memory
        </button>
      </footer>
    </div>
  )
}

export default Gallery

