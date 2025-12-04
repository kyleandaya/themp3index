// API configuration
// In development, Vite proxy handles /api and /uploads
// In production, use VITE_API_URL or default to same origin
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper functions for API-based memory management

export async function getMemories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memories`);
    if (!response.ok) {
      throw new Error('Failed to fetch memories');
    }
    const memories = await response.json();
    // Convert relative URLs to absolute URLs for audio playback
    return memories.map(memory => ({
      ...memory,
      audioData: memory.audioData.startsWith('http') 
        ? memory.audioData 
        : `${API_BASE_URL}${memory.audioData}`
    }));
  } catch (error) {
    console.error('Error loading memories:', error);
    return [];
  }
}

export async function getMemoryById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch memory');
    }
    const memory = await response.json();
    // Convert relative URL to absolute URL for audio playback
    return {
      ...memory,
      audioData: memory.audioData.startsWith('http') 
        ? memory.audioData 
        : `${API_BASE_URL}${memory.audioData}`
    };
  } catch (error) {
    console.error('Error loading memory:', error);
    return null;
  }
}

export async function saveMemory(file, recipientName, memory, labelColor) {
  try {
    const formData = new FormData();
    formData.append('audioFile', file);
    formData.append('recipientName', recipientName);
    formData.append('memory', memory);
    if (labelColor) {
      formData.append('labelColor', labelColor);
    }

    const response = await fetch(`${API_BASE_URL}/api/memories`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to save memory');
    }

    const savedMemory = await response.json();
    // Convert relative URL to absolute URL
    return {
      ...savedMemory,
      audioData: savedMemory.audioData.startsWith('http') 
        ? savedMemory.audioData 
        : `${API_BASE_URL}${savedMemory.audioData}`
    };
  } catch (error) {
    console.error('Error saving memory:', error);
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

