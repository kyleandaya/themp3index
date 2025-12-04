// Helper functions for localStorage management

export function getMemories() {
  try {
    return JSON.parse(localStorage.getItem('musicMemories') || '[]');
  } catch (error) {
    console.error('Error loading memories:', error);
    return [];
  }
}

export function saveMemory(memoryObj) {
  try {
    const memories = getMemories();
    memories.push(memoryObj);
    localStorage.setItem('musicMemories', JSON.stringify(memories));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage is full. Please try a smaller audio file or clear some data.');
    }
    throw error;
  }
}

export function getLabelColors() {
  return ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
}

export function getRandomLabelColor() {
  const colors = getLabelColors();
  return colors[Math.floor(Math.random() * colors.length)];
}

