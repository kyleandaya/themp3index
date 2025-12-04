// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        initializeHomePage();
    }
});

function initializeHomePage() {
    const audioFileInput = document.getElementById('audioFile');
    const fileNameDisplay = document.getElementById('fileName');
    const audioPreview = document.getElementById('audioPreview');
    const audioPlayer = document.getElementById('audioPlayer');
    const memorySection = document.getElementById('memorySection');
    const submitBtn = document.getElementById('submitBtn');
    
    let uploadedFile = null;
    let audioDataUrl = null;

    audioFileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        
        if (!file) {
            return;
        }

        // Check if it's an audio or video file
        if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
            alert('Please upload an audio or video file');
            audioFileInput.value = '';
            return;
        }

        uploadedFile = file;
        fileNameDisplay.textContent = file.name;
        fileNameDisplay.style.display = 'block';

        // Read file as data URL for storage
        const reader = new FileReader();
        reader.onload = function(event) {
            audioDataUrl = event.target.result;
            
            // Show audio preview
            audioPlayer.src = audioDataUrl;
            audioPreview.style.display = 'block';
            memorySection.style.display = 'block';
            submitBtn.disabled = false;
            
            // Scroll to memory section
            memorySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        
        reader.onerror = function() {
            alert('Error reading file. Please try again.');
            audioFileInput.value = '';
        };
        
        reader.readAsDataURL(file);
    });

    submitBtn.addEventListener('click', handleSubmit);

    function handleSubmit() {
        const memory = document.getElementById('memoryText').value.trim();
        const recipientName = document.getElementById('recipientName').value.trim();
        
        if (!uploadedFile || !audioDataUrl) {
            alert('Please upload a song first');
            return;
        }

        if (!recipientName) {
            alert('Please enter the name of someone this song reminds you of');
            return;
        }

        if (!memory) {
            alert('Please share your memory');
            return;
        }

        // Check localStorage size limit (usually 5-10MB)
        // For larger files, we'll need to warn the user
        const fileSizeMB = uploadedFile.size / (1024 * 1024);
        if (fileSizeMB > 5) {
            if (!confirm(`Your file is ${fileSizeMB.toFixed(1)}MB. Large files may not save properly in browser storage. Continue anyway?`)) {
                return;
            }
        }

        // Save to localStorage
        const memories = JSON.parse(localStorage.getItem('musicMemories') || '[]');
        
        // Generate random label color for vinyl record
        const labelColors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
        const randomLabelColor = labelColors[Math.floor(Math.random() * labelColors.length)];

        // Create memory object
        const memoryObj = {
            id: Date.now(),
            fileName: uploadedFile.name,
            audioData: audioDataUrl,
            memory: memory,
            recipientName: recipientName,
            labelColor: randomLabelColor,
            timestamp: new Date().toISOString(),
            fileSize: uploadedFile.size
        };

        memories.push(memoryObj);
        
        try {
            localStorage.setItem('musicMemories', JSON.stringify(memories));
            
            // Clear form
            audioFileInput.value = '';
            fileNameDisplay.textContent = '';
            fileNameDisplay.style.display = 'none';
            audioPreview.style.display = 'none';
            memorySection.style.display = 'none';
            document.getElementById('memoryText').value = '';
            document.getElementById('recipientName').value = '';
            submitBtn.disabled = true;
            uploadedFile = null;
            audioDataUrl = null;
            
            // Show success message
            alert('Your memory has been shared. Thank you.');
            
            // Optionally redirect to gallery
            // window.location.href = 'gallery.html';
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                alert('Storage is full. Please try a smaller audio file or clear some data.');
            } else {
                alert('Error saving memory. Please try again.');
                console.error('Error:', error);
            }
        }
    }
}

// Helper function for gallery/player pages
function getMemories() {
    try {
        return JSON.parse(localStorage.getItem('musicMemories') || '[]');
    } catch (error) {
        console.error('Error loading memories:', error);
        return [];
    }
}
