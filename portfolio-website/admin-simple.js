console.log('Admin.js loading...');

// Basic Admin Panel
class AdminPanel {
    constructor() {
        this.formData = {
            games: [],
            writings: [],
            musics: [],
            experiments: []
        };
        this.init();
        this.loadStoredData();
    }
    
    init() {
        console.log('AdminPanel initializing...');
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.admin-button')) {
                this.promptPassword();
            }
            
            if (e.target.matches('.admin-close')) {
                this.closeModal();
            }
            
            if (e.target.matches('#addContentBtn')) {
                e.preventDefault();
                this.handleFormSubmit();
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.matches('#contentType')) {
                this.updateForm(e.target.value);
            }
        });
    }
    
    promptPassword() {
        const password = prompt('Enter admin password:');
        if (password === 'rebel3030!knightMe') {
            this.openModal();
        } else if (password !== null) {
            alert('Incorrect password');
        }
    }
    
    openModal() {
        const modal = document.querySelector('.admin-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        const modal = document.querySelector('.admin-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    updateForm(contentType) {
        const dynamicForm = document.getElementById('dynamicForm');
        const submitBtn = document.getElementById('addContentBtn');
        
        if (!dynamicForm) return;
        
        let html = '';
        
        if (contentType === 'music') {
            html = `
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="musicCategory" required>
                        <option value="">Select...</option>
                        <option value="original">Original</option>
                        <option value="cover">Cover</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Type *</label>
                    <select name="musicType" required>
                        <option value="">Select...</option>
                        <option value="single">Single</option>
                        <option value="album">Album</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Genre *</label>
                    <input type="text" name="genre" required>
                </div>
                <div class="form-group">
                    <label>Release Date</label>
                    <input type="date" name="releaseDate">
                </div>
                <div class="form-group">
                    <label>Tracks</label>
                    <div id="tracksContainer" class="tracks-container">
                        <div class="track-item">
                            <input type="text" class="track-title" placeholder="Track title...">
                            <input type="text" class="track-duration" placeholder="Duration (mm:ss)">
                            <button type="button" class="remove-track-btn">-</button>
                        </div>
                    </div>
                    <button type="button" id="addTrackBtn" class="add-track-btn">+ Add Track</button>
                    <div class="total-duration">
                        Total Duration: <span id="totalDurationDisplay">0:00</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description *</label>
                    <textarea name="description" required></textarea>
                </div>
            `;
        } else if (contentType === 'game') {
            html = `
                <div class="form-group">
                    <label>Game Title *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Engine Used *</label>
                    <input type="text" name="engine" required>
                </div>
                <div class="form-group">
                    <label>Genre *</label>
                    <input type="text" name="genre" required>
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <input type="text" name="status" required>
                </div>
                <div class="form-group">
                    <label>Demo URL</label>
                    <input type="url" name="demo">
                </div>
                <div class="form-group">
                    <label>Description *</label>
                    <textarea name="description" required></textarea>
                </div>
            `;
        } else if (contentType === 'writing') {
            html = `
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Genre *</label>
                    <input type="text" name="genre" required>
                </div>
                <div class="form-group">
                    <label>Word Count</label>
                    <input type="number" name="wordCount">
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <input type="text" name="status" required>
                </div>
                <div class="form-group">
                    <label>Read URL</label>
                    <input type="url" name="link">
                </div>
                <div class="form-group">
                    <label>Excerpt/Description *</label>
                    <textarea name="excerpt" required></textarea>
                </div>
            `;
        } else if (contentType === 'experiment') {
            html = `
                <div class="form-group">
                    <label>Experiment Title *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required>
                        <option value="">Select...</option>
                        <option value="world-building">World Building</option>
                        <option value="games">Games</option>
                        <option value="specifics">Specifics (Languages, Maps, etc.)</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Technologies Used *</label>
                    <input type="text" name="tech" required>
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <input type="text" name="status" required>
                </div>
                <div class="form-group">
                    <label>Demo URL</label>
                    <input type="url" name="demo">
                </div>
                <div class="form-group">
                    <label>Description *</label>
                    <textarea name="description" required></textarea>
                </div>
            `;
        }
        
        dynamicForm.innerHTML = html;
        if (submitBtn) {
            submitBtn.disabled = !contentType;
        }
        
        // Set up track management if music
        if (contentType === 'music') {
            this.setupTrackManagement();
        }
    }
    
    handleFormSubmit() {
        const contentType = document.getElementById('contentType').value;
        if (!contentType) return;
        
        const formInputs = document.querySelectorAll('#dynamicForm input:not(.track-title):not(.track-duration), #dynamicForm select, #dynamicForm textarea');
        const data = {
            id: Date.now().toString(),
            type: contentType,
            createdAt: new Date().toISOString()
        };
        
        formInputs.forEach(input => {
            if (input.value && input.value.trim()) {
                data[input.name] = input.value.trim();
            }
        });
        
        // Handle tracks for music
        if (contentType === 'music') {
            const tracks = this.getTracksData();
            if (tracks.length > 0) {
                data.tracks = JSON.stringify(tracks);
                
                // Calculate total duration
                let totalSeconds = 0;
                tracks.forEach(track => {
                    const [minutes, seconds] = track.duration.split(':').map(num => parseInt(num) || 0);
                    totalSeconds += minutes * 60 + seconds;
                });
                const totalMinutes = Math.floor(totalSeconds / 60);
                const remainingSeconds = totalSeconds % 60;
                data.duration = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        }
        
        // Add to storage
        let pluralType;
        if (contentType === 'game') pluralType = 'games';
        else if (contentType === 'writing') pluralType = 'writings';
        else if (contentType === 'music') pluralType = 'musics';
        else if (contentType === 'experiment') pluralType = 'experiments';
        else pluralType = contentType + 's';
        
        this.formData[pluralType].push(data);
        
        // Add to page
        this.addContentToPage(data);
        
        // Save data
        this.saveData();
        
        // Reset form
        document.getElementById('contentType').value = '';
        document.getElementById('dynamicForm').innerHTML = '';
        document.getElementById('addContentBtn').disabled = true;
        
        alert(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} added successfully!`);
        this.closeModal();
    }
    
    addContentToPage(data) {
        if (data.type === 'music') {
            this.addMusicToPage(data);
        }
        // Future: Add other content types
    }
    
    addMusicToPage(data) {
        if (data.type !== 'music') return;
        
        const category = data.musicCategory || 'original';
        const type = data.musicType || 'single';
        const gridClass = `${category}-${type}s-grid`;
        const targetGrid = document.querySelector(`.${gridClass}`);
        
        if (!targetGrid) return;
        
        const musicCard = document.createElement('article');
        musicCard.className = 'music-card';
        musicCard.dataset.id = data.id;
        
        if (type === 'album') {
            musicCard.classList.add('album-card');
            
            // Add track data to the card
            if (data.tracks) {
                try {
                    const trackData = JSON.parse(data.tracks);
                    musicCard.dataset.tracks = data.tracks;
                } catch (e) {
                    console.error('Error parsing track data:', e);
                }
            }
        }
        
        const displayDate = data.releaseDate ? new Date(data.releaseDate) : new Date(data.createdAt);
        
        musicCard.innerHTML = `
            <div class="music-artwork">
                <div class="album-cover custom-album">
                    <div class="cover-design">
                        <div class="album-title-text">${data.title.substring(0, 3).toUpperCase()}</div>
                    </div>
                </div>
            </div>
            <div class="music-info">
                <h3 class="music-title">${data.title}</h3>
                <p class="music-type">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p class="release-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${type === 'album' ? `<p class="track-count">${data.tracks ? JSON.parse(data.tracks).length : 0} tracks</p>` : ''}
            </div>
            <button class="listen-button">${type === 'album' ? 'View Tracks' : 'Coming Soon'}</button>
        `;
        
        // Add click handler for album cards to show tracks
        if (type === 'album') {
            musicCard.addEventListener('click', () => {
                this.showAlbumModal(musicCard);
            });
        }
        
        targetGrid.appendChild(musicCard);
        console.log(`Added ${data.title} to ${gridClass}`);
    }
    
    saveData() {
        localStorage.setItem('portfolioAdminData', JSON.stringify(this.formData));
    }
    
    loadStoredData() {
        const stored = localStorage.getItem('portfolioAdminData');
        if (stored) {
            try {
                this.formData = JSON.parse(stored);
                this.loadExistingContent();
            } catch (error) {
                console.error('Failed to load stored data:', error);
            }
        }
    }
    
    loadExistingContent() {
        console.log('Loading existing content...');
        Object.keys(this.formData).forEach(pluralType => {
            this.formData[pluralType].forEach(item => {
                let singularType = pluralType.slice(0, -1);
                if (pluralType === 'musics') singularType = 'music';
                
                this.addMusicToPage({...item, type: singularType});
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing admin panel');
    window.adminPanel = new AdminPanel();
});

console.log('Admin.js loaded successfully');
