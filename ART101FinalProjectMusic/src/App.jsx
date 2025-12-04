import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Gallery from './components/Gallery'
import Player from './components/Player'

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

