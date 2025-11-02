// ADMIN PANEL FUNCTIONALITY
class AdminPanel {
    constructor() {
        this.modal = null;
        this.currentSection = 'add';
        this.formData = {
            games: [],
            writings: [],
            musics: [],
            experiments: []
        };
        
        this.init();
        this.loadStoredData();
    }
    
    // Helper function to format dates without ordinal suffixes
    formatDateWithOrdinal(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        // Return the date without any ordinal suffixes
        return formattedDate;
    }

    init() {
        console.log('AdminPanel initializing...');
        this.bindEvents();
        this.setupDynamicForms();
        console.log('AdminPanel initialized successfully');
    }

    bindEvents() {
        // Admin button click
        document.addEventListener('click', (e) => {
            if (e.target.matches('.admin-button')) {
                this.promptPassword();
            }
            
            if (e.target.matches('.admin-close')) {
                // Check if it's the edit close button
                if (e.target.classList.contains('edit-close')) {
                    this.closeEditModal();
                } else {
                    this.closeModal();
                }
            }
            
            if (e.target.matches('.admin-nav-btn')) {
                this.switchSection(e.target.dataset.section);
            }
            
            if (e.target.matches('#addContentBtn')) {
                e.preventDefault();
                this.handleFormSubmit();
            }
            
            if (e.target.matches('.admin-btn.danger')) {
                this.handleDelete(e.target);
            }
            
            if (e.target.matches('.admin-btn.edit')) {
                this.handleEdit(e.target);
            }
            
            if (e.target.matches('.admin-btn.pin')) {
                this.handlePin(e.target);
            }
            
            if (e.target.matches('#saveEditBtn')) {
                e.preventDefault();
                this.handleEditSave();
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.matches('.admin-modal')) {
                // Check if it's the edit modal
                if (e.target.id === 'editModal') {
                    this.closeEditModal();
                } else {
                    this.closeModal();
                }
            }
        });

        // Content type change
        document.addEventListener('change', (e) => {
            if (e.target.matches('#contentType')) {
                this.updateDynamicForm(e.target.value);
                // Enable/disable submit button
                const submitBtn = document.getElementById('addContentBtn');
                if (submitBtn) {
                    submitBtn.disabled = !e.target.value;
                }
            }
            
            if (e.target.matches('#manageType')) {
                this.filterContentList(e.target.value);
            }
        });
    }

    promptPassword() {
        const password = prompt('Enter admin password:');
        const correctPassword = 'rebel3030!knightMe'; // Admin password
        
        if (password === correctPassword) {
            this.openModal();
        } else if (password !== null) { // User didn't cancel
            alert('Incorrect password. Access denied.');
        }
    }

    openModal() {
        this.modal = document.querySelector('.admin-modal');
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            this.clearMessages();
        }
    }

    switchSection(section) {
        this.currentSection = section;
        
        // Update navigation
        document.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });
        
        // Update sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `admin-${section}`);
        });
        
        if (section === 'manage') {
            this.loadContentList();
        }
    }

    setupDynamicForms() {
        const forms = {
            game: [
                { type: 'text', name: 'title', label: 'Game Title', required: true },
                { type: 'date', name: 'gameDate', label: 'Game Date', required: true },
                { type: 'text', name: 'engine', label: 'Engine Used', required: true },
                { type: 'text', name: 'genre', label: 'Genre', required: true },
                { type: 'text', name: 'status', label: 'Status', required: true },
                { type: 'file', name: 'image', label: 'Screenshot Image', required: false, accept: 'image/*' },
                { type: 'url', name: 'demo', label: 'Demo/Play URL', required: false },
                { type: 'url', name: 'source', label: 'Source Code URL', required: false },
                { type: 'checkbox', name: 'pinned', label: 'Pin to Spotlight Section', required: false },
                { type: 'textarea', name: 'description', label: 'Description', required: true }
            ],
            writing: [
                { type: 'text', name: 'title', label: 'Title', required: true },
                { type: 'text', name: 'genre', label: 'Genre', required: true },
                { type: 'number', name: 'wordCount', label: 'Word Count', required: false },
                { type: 'date', name: 'published', label: 'Published Date', required: false },
                { type: 'text', name: 'status', label: 'Status', required: true },
                { type: 'url', name: 'link', label: 'Read URL', required: false },
                { type: 'checkbox', name: 'pinned', label: 'Pin to Spotlight Section', required: false },
                { type: 'textarea', name: 'excerpt', label: 'Excerpt/Description', required: true }
            ],
            music: [
                { type: 'text', name: 'title', label: 'Title', required: true },
                { type: 'select', name: 'musicCategory', label: 'Category', required: true, options: [
                    { value: 'original', label: 'Original' },
                    { value: 'cover', label: 'Cover' }
                ]},
                { type: 'select', name: 'musicType', label: 'Type', required: true, options: [
                    { value: 'single', label: 'Single' },
                    { value: 'album', label: 'Album' }
                ]},
                { type: 'text', name: 'genre', label: 'Genre', required: true },
                { type: 'date', name: 'releaseDate', label: 'Release Date', required: false },
                { type: 'file', name: 'cover', label: 'Cover Art Image', required: false, accept: 'image/*' },
                { type: 'url', name: 'listen', label: 'Listen URL', required: false },
                { type: 'custom', name: 'tracks', label: 'Tracks', required: false },
                { type: 'checkbox', name: 'pinned', label: 'Pin to Spotlight Section', required: false },
                { type: 'textarea', name: 'description', label: 'Description', required: true }
            ],
            experiment: [
                { type: 'text', name: 'title', label: 'Experiment Title', required: true },
                { type: 'select', name: 'category', label: 'Category', required: true, options: [
                    { value: 'world-building', label: 'World Building' },
                    { value: 'games', label: 'Games' },
                    { value: 'specifics', label: 'Specifics (Languages, Maps, etc.)' },
                    { value: 'other', label: 'Other' }
                ]},
                { type: 'text', name: 'tech', label: 'Technologies Used', required: true },
                { type: 'text', name: 'status', label: 'Status', required: true },
                { type: 'date', name: 'experimentDate', label: 'Experiment Date', required: false },
                { type: 'text', name: 'keywords', label: 'Keywords (comma separated)', required: false },
                { type: 'url', name: 'demo', label: 'Demo URL', required: false },
                { type: 'url', name: 'source', label: 'Source Code URL', required: false },
                { type: 'checkbox', name: 'pinned', label: 'Pin to Spotlight Section', required: false },
                { type: 'textarea', name: 'description', label: 'Description', required: true }
            ]
        };
        
        this.formTemplates = forms;
    }

    updateDynamicForm(contentType) {
        const dynamicForm = document.getElementById('dynamicForm');
        if (!dynamicForm || !this.formTemplates[contentType]) return;

        const template = this.formTemplates[contentType];
        let html = '';

        template.forEach(field => {
            if (field.type === 'textarea') {
                html += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <textarea 
                            id="${field.name}" 
                            name="${field.name}" 
                            class="admin-textarea"
                            ${field.required ? 'required' : ''}
                            placeholder="Enter ${field.label.toLowerCase()}..."
                        ></textarea>
                    </div>
                `;
            } else if (field.type === 'select') {
                html += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <select 
                            id="${field.name}" 
                            name="${field.name}" 
                            class="admin-select"
                            ${field.required ? 'required' : ''}
                        >
                            <option value="">Select ${field.label}...</option>
                            ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'custom' && field.name === 'tracks') {
                html += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <div id="tracksContainer" class="tracks-container">
                            <div class="track-item">
                                <input type="text" class="track-title" placeholder="Track title..." value="">
                                <input type="text" class="track-duration" placeholder="Duration (mm:ss)" value="">
                                <button type="button" class="remove-track-btn">-</button>
                            </div>
                        </div>
                        <button type="button" id="addTrackBtn" class="add-track-btn">+ Add Track</button>
                        <div class="total-duration">
                            Total Duration: <span id="totalDurationDisplay">0:00</span>
                        </div>
                    </div>
                `;
            } else if (field.type === 'file') {
                html += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <div class="file-input-container">
                            <input 
                                type="file" 
                                id="${field.name}" 
                                name="${field.name}" 
                                class="admin-file-input"
                                ${field.accept ? `accept="${field.accept}"` : ''}
                                ${field.required ? 'required' : ''}
                            >
                            <div class="file-preview" id="${field.name}_preview"></div>
                        </div>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                html += `
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                id="${field.name}" 
                                name="${field.name}" 
                                class="admin-checkbox"
                                value="true"
                            >
                            <span class="checkbox-text">${field.label}</span>
                        </label>
                    </div>
                `;
            } else {
                html += `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <input 
                            type="${field.type}" 
                            id="${field.name}" 
                            name="${field.name}" 
                            class="admin-input"
                            ${field.required ? 'required' : ''}
                            placeholder="Enter ${field.label.toLowerCase()}..."
                        >
                    </div>
                `;
            }
        });

        dynamicForm.innerHTML = html;
        
        // Set up file input handlers
        this.setupFileInputs();
        
        // Set up track management if music form
        if (contentType === 'music') {
            // Use a longer delay to ensure all DOM elements are ready
            setTimeout(() => {
                this.setupTrackManagement();
            }, 200);
        }
    }

    handleFormSubmit() {
        console.log('Form submission started...');
        const contentType = document.getElementById('contentType').value;
        console.log('Content type:', contentType);
        
        if (!contentType) {
            console.error('No content type selected');
            this.showMessage('Please select a content type', 'error');
            return;
        }

        // Collect form data manually
        const dynamicForm = document.getElementById('dynamicForm');
        const inputs = dynamicForm.querySelectorAll('input, textarea, select');
        
        const data = {
            id: Date.now().toString(),
            type: contentType,
            createdAt: new Date().toISOString()
        };

        // Collect all form data including files and checkboxes
        inputs.forEach(input => {
            if (input.type === 'file') {
                if (input.files && input.files[0]) {
                    // Convert file to base64 for storage
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        data[input.name] = e.target.result;
                        // Continue with submission after file is read
                        this.completeFormSubmission(data, contentType);
                    };
                    reader.readAsDataURL(file);
                    return; // Exit early, will continue in reader.onload
                }
            } else if (input.type === 'checkbox') {
                data[input.name] = input.checked;
            } else if (input.value && typeof input.value === 'string' && input.value.trim()) {
                data[input.name] = input.value.trim();
            }
        });
        
        // If no file uploads, continue immediately
        const hasFileInputs = Array.from(inputs).some(input => input.type === 'file' && input.files && input.files[0]);
        if (!hasFileInputs) {
            this.completeFormSubmission(data, contentType);
        }
        
    }
    
    completeFormSubmission(data, contentType) {
        // Handle tracks data for music
        if (contentType === 'music') {
            console.log('Processing music tracks...');
            const tracks = this.getTracksData();
            console.log('Tracks data:', tracks);
            data.tracks = JSON.stringify(tracks);
            
            // Calculate and store total duration
            let totalSeconds = 0;
            tracks.forEach((track, index) => {
                const [minutes, seconds] = track.duration.split(':').map(num => parseInt(num) || 0);
                const trackSeconds = minutes * 60 + seconds;
                totalSeconds += trackSeconds;
                console.log(`Processing track ${index + 1}: ${track.title} - ${track.duration} (${trackSeconds}s)`);
            });
            const totalMinutes = Math.floor(totalSeconds / 60);
            const remainingSeconds = totalSeconds % 60;
            data.duration = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            console.log('Total duration for submission:', data.duration);
        }

        // Validate required fields
        const template = this.formTemplates[contentType];
        const missingFields = template
            .filter(field => field.required && !data[field.name])
            .map(field => field.label);

        if (missingFields.length > 0) {
            this.showMessage(`Missing required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Handle pinned content - update pinned projects if needed
        if (data.pinned) {
            this.updatePinnedContent(data, contentType);
        }

        // Add to storage - handle proper plural forms
        let pluralType;
        if (contentType === 'game') pluralType = 'games';
        else if (contentType === 'writing') pluralType = 'writings';
        else if (contentType === 'music') pluralType = 'musics';
        else if (contentType === 'experiment') pluralType = 'experiments';
        else pluralType = contentType + 's';
        
        if (!this.formData[pluralType]) {
            this.formData[pluralType] = [];
        }
        this.formData[pluralType].push(data);
        
        this.saveData();
        this.addContentToPage(data);
        this.showMessage(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} added successfully!`, 'success');
        
        // Reset form
        document.getElementById('contentType').value = '';
        document.getElementById('dynamicForm').innerHTML = '';
        document.getElementById('addContentBtn').disabled = true;
    }

    addContentToPage(data) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch(data.type) {
            case 'game':
                this.addGameToPage(data);
                break;
            case 'writing':
                this.addWritingToPage(data);
                break;
            case 'music':
                this.addMusicToPage(data);
                break;
            case 'experiment':
                this.addExperimentToPage(data);
                break;
        }
    }

    addGameToPage(data) {
        const gameGrid = document.querySelector('.games-grid');
        if (!gameGrid) return;

        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.dataset.id = data.id;
        gameCard.dataset.date = new Date(data.createdAt).toISOString().split('T')[0];
        gameCard.dataset.keywords = `${data.genre}, ${data.engine}, ${data.status}, ${data.title.toLowerCase()}`;
        
        gameCard.innerHTML = `
            <h3 class="game-title">${data.title}</h3>
            <p class="game-date">${new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p class="game-description">${data.description}</p>
            <button class="play-button">${data.demo ? 'Play Game' : 'Coming Soon'}</button>
        `;
        
        // Add click handler for demo if available
        if (data.demo) {
            const playButton = gameCard.querySelector('.play-button');
            playButton.addEventListener('click', () => {
                window.open(data.demo, '_blank');
            });
        }
        
        gameGrid.appendChild(gameCard);
    }

    addWritingToPage(data) {
        const writingGrid = document.querySelector('.writing-grid');
        if (!writingGrid) return;

        const writingCard = document.createElement('article');
        writingCard.className = 'writing-card';
        writingCard.dataset.id = data.id;
        writingCard.dataset.date = data.published || data.createdAt.split('T')[0];
        writingCard.dataset.type = this.getWritingType(data.genre);
        writingCard.dataset.genre = data.genre.toLowerCase();
        writingCard.dataset.keywords = `${data.genre}, ${data.title.toLowerCase()}, ${data.excerpt.substring(0, 100).toLowerCase()}`;
        
        const displayDate = data.published ? new Date(data.published) : new Date(data.createdAt);
        const readTime = data.wordCount ? Math.ceil(data.wordCount / 200) : 5;
        
        writingCard.innerHTML = `
            <div class="writing-header">
                <span class="writing-type ${this.getWritingType(data.genre)}">${this.getWritingTypeLabel(data.genre)}</span>
                <span class="writing-genre ${data.genre.toLowerCase()}">${data.genre}</span>
            </div>
            <h3 class="writing-title">${data.title}</h3>
            <p class="writing-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p class="writing-description">${data.excerpt}</p>
            <div class="writing-stats">
                <span class="word-count">${data.wordCount || 'Unknown'} words</span>
                <span class="read-time">${readTime} min read</span>
            </div>
            <button class="read-button">${data.link ? 'Read More' : 'Coming Soon'}</button>
        `;
        
        // Add click handler if link is available
        if (data.link) {
            const readButton = writingCard.querySelector('.read-button');
            readButton.addEventListener('click', () => {
                window.open(data.link, '_blank');
            });
        }
        
        writingGrid.appendChild(writingCard);
    }
    
    getWritingType(genre) {
        const typeMap = {
            'tech': 'article',
            'technology': 'article',
            'philosophy': 'blog',
            'cyberpunk': 'short-story',
            'sci-fi': 'book',
            'horror': 'short-story',
            'mystery': 'short-story',
            'fantasy': 'book'
        };
        return typeMap[genre.toLowerCase()] || 'article';
    }
    
    getWritingTypeLabel(genre) {
        const labelMap = {
            'tech': 'Article',
            'technology': 'Article',
            'philosophy': 'Blog Post',
            'cyberpunk': 'Short Story',
            'sci-fi': 'Book',
            'horror': 'Short Story',
            'mystery': 'Short Story',
            'fantasy': 'Book'
        };
        return labelMap[genre.toLowerCase()] || 'Article';
    }

    addMusicToPage(data) {
        // Determine target grid based on category and type
        const category = data.musicCategory || 'original';
        const type = data.musicType || 'single';
        const gridClass = `${category}-${type}s-grid`;
        const targetGrid = document.querySelector(`.${gridClass}`);
        
        if (!targetGrid) return;

        const musicCard = document.createElement('article');
        musicCard.className = 'music-card';
        musicCard.dataset.id = data.id;
        musicCard.dataset.date = data.releaseDate || data.createdAt.split('T')[0];
        musicCard.dataset.type = (data.musicType || data.type || 'single').toLowerCase();
        
        const displayDate = data.releaseDate ? new Date(data.releaseDate) : new Date(data.createdAt);
        
        if (type === 'album') {
            // Album structure
            musicCard.classList.add('album-card');
            
            let trackData = [];
            if (data.tracks) {
                try {
                    trackData = JSON.parse(data.tracks);
                } catch (e) {
                    // Fallback for old format
                    const trackList = data.tracks.split('\n').filter(track => track.trim());
                    trackData = trackList.map((track, index) => ({
                        title: track.trim(),
                        duration: '3:45'
                    }));
                }
            }
            
            musicCard.dataset.tracks = JSON.stringify(trackData);
            
            const coverImageHtml = data.cover && data.cover.startsWith('data:') 
                ? `<img src="${data.cover}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` 
                : `<div class="cover-design">
                    <div class="album-title-text">${data.title.substring(0, 3).toUpperCase()}</div>
                    <div class="glitch-effect"></div>
                   </div>`;
            
            musicCard.innerHTML = `
                <div class="music-artwork">
                    <div class="album-cover custom-album">
                        ${coverImageHtml}
                    </div>
                </div>
                <div class="music-info">
                    <h3 class="music-title">${data.title}</h3>
                    <p class="music-type">Album</p>
                    <p class="release-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="track-count">${trackData.length} tracks</p>
                </div>
                <button class="listen-button" onclick="event.stopPropagation()">${data.listen ? 'Listen Now' : 'View Tracks'}</button>
            `;
            
            // Make album card clickable
            musicCard.style.cursor = 'pointer';
            musicCard.addEventListener('click', () => {
                this.showMusicModal(data, trackData);
            });
        } else {
            // Single/Cover structure
            const cardType = category === 'cover' ? 'cover-card' : 'single-card';
            musicCard.classList.add(cardType);
            
            // Parse track data for singles too (in case it's a multi-track single)
            let trackData = [];
            if (data.tracks) {
                try {
                    trackData = JSON.parse(data.tracks);
                } catch (e) {
                    // Fallback - create single track from title and duration
                    trackData = [{
                        title: data.title,
                        duration: data.duration || '3:45'
                    }];
                }
            } else if (data.duration) {
                // Create single track from title and duration
                trackData = [{
                    title: data.title,
                    duration: data.duration
                }];
            }
            
            const singleImageHtml = data.cover && data.cover.startsWith('data:') 
                ? `<img src="${data.cover}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` 
                : `<div class="custom-design">
                    <div class="title-overlay">${data.title.substring(0, 2).toUpperCase()}</div>
                   </div>`;
            
            musicCard.innerHTML = `
                <div class="music-artwork">
                    <div class="${category === 'cover' ? 'cover-art' : 'single-cover'} custom-${type}">
                        ${singleImageHtml}
                    </div>
                </div>
                <div class="music-info">
                    <h3 class="music-title">${data.title}</h3>
                    <p class="music-type">${category.charAt(0).toUpperCase() + category.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <p class="release-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div class="track-list">
                        <div class="track-item">
                            <span class="track-name">${data.title}</span>
                            <span class="track-duration">${data.duration || '3:45'}</span>
                        </div>
                    </div>
                </div>
                <button class="listen-button">${data.listen ? 'Listen Now' : 'Coming Soon'}</button>
            `;
            
            // Add click handler for listen button
            const listenButton = musicCard.querySelector('.listen-button');
            if (data.listen) {
                listenButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(data.listen, '_blank');
                });
            }
            
            // Make single clickable if it has track data
            if (trackData && trackData.length > 0) {
                musicCard.style.cursor = 'pointer';
                musicCard.addEventListener('click', () => {
                    this.showMusicModal(data, trackData);
                });
            }
        }
        
        targetGrid.appendChild(musicCard);
    }

    addExperimentToPage(data) {
        const experimentGrid = document.querySelector('.experiments-grid');
        if (!experimentGrid) return;

        const experimentCard = document.createElement('div');
        experimentCard.className = 'experiment-card';
        experimentCard.dataset.id = data.id;
        experimentCard.dataset.date = data.experimentDate || data.createdAt.split('T')[0];
        experimentCard.dataset.category = data.category || 'other';
        experimentCard.dataset.keywords = `${data.keywords || ''}, ${data.category}, ${data.tech}, ${data.status}, ${data.title.toLowerCase()}`;
        
        const displayDate = data.experimentDate ? new Date(data.experimentDate) : new Date(data.createdAt);
        
        experimentCard.innerHTML = `
            <h3 class="experiment-title">${data.title}</h3>
            <p class="experiment-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div class="experiment-meta">
                <span class="experiment-category">${data.category}</span>
                <span class="experiment-tech">${data.tech}</span>
                <span class="experiment-status">${data.status}</span>
            </div>
            <p class="experiment-description">${data.description}</p>
            <button class="experiment-button">${data.demo ? 'View Demo' : 'Coming Soon'}</button>
        `;
        
        // Add click handler for demo if available
        if (data.demo) {
            const demoButton = experimentCard.querySelector('.experiment-button');
            demoButton.addEventListener('click', () => {
                window.open(data.demo, '_blank');
            });
        }
        
        experimentGrid.appendChild(experimentCard);
    }

    loadContentList() {
        const contentList = document.getElementById('contentList');
        if (!contentList) return;

        let html = '';
        
        // Combine all content types
        const allContent = [];
        Object.keys(this.formData).forEach(pluralType => {
            this.formData[pluralType].forEach(item => {
                // Convert plural type to singular properly
                let singularType;
                if (pluralType === 'games') singularType = 'game';
                else if (pluralType === 'writings') singularType = 'writing';
                else if (pluralType === 'musics') singularType = 'music';
                else if (pluralType === 'experiments') singularType = 'experiment';
                else singularType = pluralType.slice(0, -1);
                
                allContent.push({...item, contentType: singularType});
            });
        });

        if (allContent.length === 0) {
            html = '<div class="content-item"><div class="content-info"><div class="content-title">No content found</div><div class="content-meta">Add some content to get started</div></div></div>';
        } else {
            allContent
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .forEach(item => {
                    // Determine the appropriate date to display
                    let displayDate = item.createdAt;
                    let dateLabel = 'Created';
                    
                    // Use specific date fields when available
                    if (item.contentType === 'game' && item.gameDate) {
                        displayDate = item.gameDate;
                        dateLabel = 'Released';
                    } else if (item.contentType === 'writing' && item.published) {
                        displayDate = item.published;
                        dateLabel = 'Published';
                    } else if (item.contentType === 'music' && item.releaseDate) {
                        displayDate = item.releaseDate;
                        dateLabel = 'Released';
                    } else {
                        // Use appropriate label for content type
                        if (item.contentType === 'game') {
                            dateLabel = 'Released';
                        } else if (item.contentType === 'writing') {
                            dateLabel = 'Published';
                        } else if (item.contentType === 'music') {
                            dateLabel = 'Released';
                        }
                    }
                    
                    const isPinned = item.pinned === true || item.pinned === 'true';
                    html += `
                        <div class="content-item" data-id="${item.id}" data-type="${item.contentType}">
                            <div class="content-info">
                                <div class="content-title">${item.title} ${isPinned ? '📌' : ''}</div>
                                <div class="content-meta">Type: ${item.contentType}</div>
                                <div class="content-meta">${dateLabel}: ${this.formatDate(displayDate)}</div>
                                ${item.genre ? `<div class="content-meta">Genre: ${item.genre}</div>` : ''}
                                ${item.status ? `<div class="content-meta">Status: ${item.status}</div>` : ''}
                            </div>
                            <div class="content-actions">
                                <button class="admin-btn pin small ${isPinned ? 'pinned' : ''}" data-id="${item.id}" data-type="${item.contentType}" title="${isPinned ? 'Unpin from Pinned Projects' : 'Pin to Pinned Projects'}">
                                    ${isPinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button class="admin-btn edit small" data-id="${item.id}" data-type="${item.contentType}">Edit</button>
                                <button class="admin-btn danger small" data-id="${item.id}" data-type="${item.contentType}">Delete</button>
                            </div>
                        </div>
                    `;
                });
        }
        
        contentList.innerHTML = html;
    }

    handleDelete(button) {
        const itemId = button.dataset.id;
        const itemType = button.dataset.type;
        
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        // Remove from data - handle plural type conversion
        let pluralType;
        if (itemType === 'game') pluralType = 'games';
        else if (itemType === 'writing') pluralType = 'writings';
        else if (itemType === 'music') pluralType = 'musics';
        else if (itemType === 'experiment') pluralType = 'experiments';
        else pluralType = itemType + 's'; // fallback
        
        if (this.formData[pluralType]) {
            this.formData[pluralType] = this.formData[pluralType].filter(item => item.id !== itemId);
        }

        // Remove from page
        const pageElement = document.querySelector(`[data-id="${itemId}"]`);
        if (pageElement) {
            pageElement.remove();
        }

        this.saveData();
        this.loadContentList();
        this.showMessage('Content deleted successfully', 'success');
    }

    handlePin(button) {
        const itemId = button.dataset.id;
        const itemType = button.dataset.type;
        
        // Find the item in formData - handle plural type conversion
        let pluralType;
        if (itemType === 'game') pluralType = 'games';
        else if (itemType === 'writing') pluralType = 'writings';
        else if (itemType === 'music') pluralType = 'musics';
        else if (itemType === 'experiment') pluralType = 'experiments';
        else pluralType = itemType + 's'; // fallback
        
        const item = this.formData[pluralType]?.find(item => item.id === itemId);
        
        if (!item) {
            this.showMessage('Item not found', 'error');
            return;
        }
        
        // Toggle pinned status
        const wasPinned = item.pinned === true || item.pinned === 'true';
        item.pinned = !wasPinned;
        
        // Ensure item has type property for updatePinnedContent
        const itemWithType = {...item, type: itemType};
        
        // Update pinned content display if on main page
        if (!wasPinned && document.querySelector('.pinned-projects')) {
            // Pin the item
            this.updatePinnedContent(itemWithType, itemType);
        } else if (wasPinned && document.querySelector('.pinned-projects')) {
            // Unpin the item - remove from pinned section
            const targetGrid = document.querySelector(`#pinned-${itemType === 'experiment' ? 'experiments' : itemType} .pinned-grid`);
            if (targetGrid) {
                const pinnedItem = targetGrid.querySelector(`[data-id="${itemId}"]`);
                if (pinnedItem) {
                    pinnedItem.remove();
                }
            }
            this.updateEmptyMessages();
        }
        
        // Save data
        this.saveData();
        
        // Refresh content list
        this.loadContentList();
        
        // Show message
        this.showMessage(item.pinned ? 'Content pinned successfully!' : 'Content unpinned successfully!', 'success');
    }

    saveData() {
        localStorage.setItem('portfolioAdminData', JSON.stringify(this.formData));
    }

    loadStoredData() {
        console.log('Loading stored data...');
        const stored = localStorage.getItem('portfolioAdminData');
        console.log('Stored data found:', !!stored);
        if (stored) {
            try {
                this.formData = JSON.parse(stored);
                console.log('Parsed data:', this.formData);
                this.loadExistingContent();
            } catch (error) {
                console.error('Failed to load stored data:', error);
            }
        } else {
            console.log('No stored data found - starting fresh');
        }
    }

    loadExistingContent() {
        console.log('Loading existing content to pages...');
        console.log('Current page path:', window.location.pathname);
        
        // Load content that matches current page
        Object.keys(this.formData).forEach(pluralType => {
            console.log(`Processing ${pluralType}:`, this.formData[pluralType].length, 'items');
            
            this.formData[pluralType].forEach(item => {
                // Convert plural type back to singular
                let singularType;
                if (pluralType === 'games') singularType = 'game';
                else if (pluralType === 'writings') singularType = 'writing';
                else if (pluralType === 'musics') singularType = 'music';
                else if (pluralType === 'experiments') singularType = 'experiment';
                else singularType = pluralType.slice(0, -1);
                
                console.log(`Adding ${singularType} to page:`, item.title || item.id);
                this.addContentToPage({...item, type: singularType});
                
                // If item is pinned and we're on the main page, add it to pinned section
                const isPinned = item.pinned === true || item.pinned === 'true';
                if (isPinned && document.querySelector('.pinned-projects')) {
                    this.updatePinnedContent({...item, type: singularType}, singularType);
                }
            });
        });
        
        // Update empty messages after loading
        if (document.querySelector('.pinned-projects')) {
            this.updateEmptyMessages();
        }
        
        console.log('Finished loading existing content');
    }

    showMessage(message, type = 'success') {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        const adminSection = document.getElementById('admin-add');
        if (adminSection) {
            adminSection.insertBefore(messageDiv, adminSection.firstChild);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
    }

    clearMessages() {
        document.querySelectorAll('.success-message, .error-message').forEach(msg => {
            msg.remove();
        });
    }
    
    
    filterContentList(filterType) {
        const contentItems = document.querySelectorAll('.content-item[data-type]');
        
        contentItems.forEach(item => {
            const itemType = item.dataset.type;
            
            if (!filterType || filterType === '' || itemType === filterType) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    handleEdit(button) {
        const itemId = button.dataset.id;
        const itemType = button.dataset.type;
        
        // Find the item in formData - handle plural type conversion
        let pluralType;
        if (itemType === 'game') pluralType = 'games';
        else if (itemType === 'writing') pluralType = 'writings';
        else if (itemType === 'music') pluralType = 'musics';
        else if (itemType === 'experiment') pluralType = 'experiments';
        else pluralType = itemType + 's'; // fallback
        
        const item = this.formData[pluralType]?.find(item => item.id === itemId);
        
        if (!item) {
            this.showMessage('Item not found', 'error');
            return;
        }
        
        this.currentEditItem = { ...item, originalType: pluralType };
        this.showEditModal(item);
    }
    
    showEditModal(item) {
        // Create edit modal if it doesn't exist
        let editModal = document.getElementById('editModal');
        if (!editModal) {
            editModal = this.createEditModal();
            document.body.appendChild(editModal);
        }
        
        // Populate the form with current values
        this.populateEditForm(item);
        
        // Show the modal
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    createEditModal() {
        const modal = document.createElement('div');
        modal.id = 'editModal';
        modal.className = 'admin-modal';
        
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-header">
                    <h2>Edit Content</h2>
                    <button class="admin-close edit-close">&times;</button>
                </div>
                <div class="admin-section active">
                    <form class="admin-form" id="editForm">
                        <div id="editFormFields"></div>
                        <button type="submit" id="saveEditBtn" class="admin-btn primary">Save Changes</button>
                        <button type="button" class="admin-btn" id="cancelEditBtn">Cancel</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.edit-close').addEventListener('click', () => this.closeEditModal());
        modal.querySelector('#cancelEditBtn').addEventListener('click', () => this.closeEditModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeEditModal();
        });
        
        return modal;
    }
    
    populateEditForm(item) {
        const formFields = document.getElementById('editFormFields');
        const template = this.formTemplates[item.type];
        
        if (!template) {
            console.error('No template found for type:', item.type, 'Available templates:', Object.keys(this.formTemplates));
            this.showEditMessage('Template not found for this content type', 'error');
            return;
        }
        
        let html = '';
        template.forEach(field => {
            let value = item[field.name] || '';
            
            // Format date fields for HTML date input (YYYY-MM-DD format)
            if (field.type === 'date' && value) {
                try {
                    // If value is an ISO string or date string, convert to YYYY-MM-DD
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        value = `${year}-${month}-${day}`;
                    }
                } catch (e) {
                    // If conversion fails, try to extract date from string
                    // Handle formats like "2024-01-15" or "January 15, 2024"
                    if (typeof value === 'string' && value.includes('-')) {
                        const parts = value.split('T')[0]; // Remove time if present
                        if (parts.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            value = parts;
                        }
                    }
                }
            }
            
            if (field.type === 'textarea') {
                html += `
                    <div class="form-group">
                        <label for="edit_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <textarea 
                            id="edit_${field.name}" 
                            name="${field.name}" 
                            class="admin-textarea"
                            ${field.required ? 'required' : ''}
                            placeholder="Enter ${field.label.toLowerCase()}..."
                        >${value}</textarea>
                    </div>
                `;
            } else if (field.type === 'select') {
                html += `
                    <div class="form-group">
                        <label for="edit_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <select 
                            id="edit_${field.name}" 
                            name="${field.name}" 
                            class="admin-select"
                            ${field.required ? 'required' : ''}
                        >
                            <option value="">Select ${field.label}...</option>
                            ${field.options.map(opt => `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                html += `
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                id="edit_${field.name}" 
                                name="${field.name}" 
                                class="admin-checkbox"
                                value="true"
                                ${value ? 'checked' : ''}
                            >
                            <span class="checkbox-text">${field.label}</span>
                        </label>
                    </div>
                `;
            } else if (field.type === 'file') {
                html += `
                    <div class="form-group">
                        <label for="edit_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <div class="file-input-container">
                            <input 
                                type="file" 
                                id="edit_${field.name}" 
                                name="${field.name}" 
                                class="admin-file-input"
                                ${field.accept ? `accept="${field.accept}"` : ''}
                                ${field.required ? 'required' : ''}
                            >
                            <div class="file-preview" id="edit_${field.name}_preview">
                                ${value ? `<img src="${value}" alt="Current" style="max-width: 200px; max-height: 200px; border-radius: 4px;"><p style="font-size: 12px; color: #666; margin-top: 8px;">Current image</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            } else if (field.type === 'custom' && field.name === 'tracks') {
                // Parse existing track data
                let trackData = [];
                if (value) {
                    try {
                        trackData = JSON.parse(value);
                    } catch (e) {
                        trackData = [];
                    }
                }
                
                html += `
                    <div class="form-group">
                        <label for="edit_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <div id="editTracksContainer" class="tracks-container">`;
                        
                // Add existing tracks or at least one empty track
                if (trackData.length > 0) {
                    trackData.forEach(track => {
                        html += `
                            <div class="track-item">
                                <input type="text" class="track-title" placeholder="Track title..." value="${track.title || ''}">
                                <input type="text" class="track-duration" placeholder="Duration (mm:ss)" value="${track.duration || ''}">
                                <button type="button" class="remove-track-btn">-</button>
                            </div>`;
                    });
                } else {
                    html += `
                        <div class="track-item">
                            <input type="text" class="track-title" placeholder="Track title..." value="">
                            <input type="text" class="track-duration" placeholder="Duration (mm:ss)" value="">
                            <button type="button" class="remove-track-btn">-</button>
                        </div>`;
                }
                        
                html += `
                        </div>
                        <button type="button" id="editAddTrackBtn" class="add-track-btn">+ Add Track</button>
                        <div class="total-duration">
                            Total Duration: <span id="editTotalDurationDisplay">0:00</span>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="form-group">
                        <label for="edit_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <input 
                            type="${field.type}" 
                            id="edit_${field.name}" 
                            name="${field.name}" 
                            class="admin-input"
                            value="${value}"
                            ${field.required ? 'required' : ''}
                            placeholder="Enter ${field.label.toLowerCase()}..."
                        >
                    </div>
                `;
            }
        });
        
        formFields.innerHTML = html;
        
        // Set up file input handlers for edit form
        this.setupEditFileInputs();
        
        // Set up track management for edit form if it's music
        if (this.currentEditItem && this.currentEditItem.type === 'music') {
            setTimeout(() => {
                this.setupEditTrackManagement();
            }, 100);
        }
    }
    
    handleEditSave() {
        if (!this.currentEditItem) return;
        
        const form = document.getElementById('editForm');
        if (!form) {
            this.showEditMessage('Edit form not found', 'error');
            return;
        }
        
        // Collect all form inputs directly (more reliable than FormData for all field types)
        const formInputs = form.querySelectorAll('input, textarea, select');
        const formValues = {};
        
        formInputs.forEach(input => {
            // Skip file inputs (handled separately) and track inputs (handled separately)
            if (input.type === 'file' || input.classList.contains('track-title') || input.classList.contains('track-duration')) {
                return;
            }
            
            const fieldName = input.name;
            if (!fieldName) return;
            
            if (input.type === 'checkbox') {
                formValues[fieldName] = input.checked;
            } else {
                const value = input.value;
                // Allow empty values for optional fields, but trim non-empty strings
                if (value !== null && value !== undefined) {
                    formValues[fieldName] = value.trim ? value.trim() : value;
                }
            }
        });
        
        // Validate required fields
        const template = this.formTemplates[this.currentEditItem.type];
        if (!template) {
            console.error('No template found for edit type:', this.currentEditItem.type);
            this.showEditMessage('Template not found for this content type', 'error');
            return;
        }
        
        const missingFields = template
            .filter(field => {
                const value = formValues[field.name];
                return field.required && (!value || (typeof value === 'string' && !value.trim()));
            })
            .map(field => field.label);
        
        if (missingFields.length > 0) {
            this.showEditMessage(`Missing required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }
        
        // Update the item with new values
        const updatedItem = { ...this.currentEditItem };
        
        // Handle tracks data for music items
        if (this.currentEditItem.type === 'music') {
            const tracks = this.getEditTracksData();
            if (tracks.length > 0) {
                updatedItem.tracks = JSON.stringify(tracks);
                
                // Calculate total duration
                let totalSeconds = 0;
                tracks.forEach((track) => {
                    const [minutes, seconds] = track.duration.split(':').map(num => parseInt(num) || 0);
                    const trackSeconds = minutes * 60 + seconds;
                    totalSeconds += trackSeconds;
                });
                const totalMinutes = Math.floor(totalSeconds / 60);
                const remainingSeconds = totalSeconds % 60;
                updatedItem.duration = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        }
        
        // Update all form fields
        Object.keys(formValues).forEach(key => {
            if (key === 'tracks') return; // Skip tracks, handled above
            
            const value = formValues[key];
            // Update the field - even if empty (for optional fields that can be cleared)
            if (value !== null && value !== undefined) {
                if (typeof value === 'string') {
                    // Store empty strings for optional fields, trimmed strings for non-empty
                    updatedItem[key] = value === '' ? '' : value.trim();
                } else {
                    // For checkboxes and other non-string types
                    updatedItem[key] = value;
                }
            }
        });
        
        // Handle file uploads in edit mode
        const fileInputs = document.querySelectorAll('#editModal .admin-file-input');
        let fileUploadPromises = [];
        
        fileInputs.forEach(input => {
            if (input.files && input.files[0]) {
                const promise = new Promise((resolve) => {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        updatedItem[input.name] = e.target.result;
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
                fileUploadPromises.push(promise);
            }
        });
        
        // Wait for file uploads then save
        Promise.all(fileUploadPromises).then(() => {
            this.completeEditSave(updatedItem);
        });
        
    }
    
    completeEditSave(updatedItem) {
        // Handle pinned content updates
        if (updatedItem.pinned) {
            this.updatePinnedContent(updatedItem, updatedItem.type);
        }
        
        // Update in formData
        const pluralType = this.currentEditItem.originalType;
        const itemIndex = this.formData[pluralType].findIndex(item => item.id === this.currentEditItem.id);
        if (itemIndex !== -1) {
            this.formData[pluralType][itemIndex] = updatedItem;
        }
        
        // Update on page
        this.updateContentOnPage(updatedItem);
        
        // Save data
        this.saveData();
        
        // Refresh content list
        this.loadContentList();
        
        // Close modal and show success
        this.closeEditModal();
        this.showMessage('Content updated successfully!', 'success');
    }
    
    updateContentOnPage(updatedItem) {
        const element = document.querySelector(`[data-id="${updatedItem.id}"]`);
        if (!element) return;
        
        // Remove the old element
        element.remove();
        
        // Add the updated element
        this.addContentToPage(updatedItem);
    }
    
    closeEditModal() {
        const editModal = document.getElementById('editModal');
        if (editModal) {
            editModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.currentEditItem = null;
    }
    
    showEditMessage(message, type = 'success') {
        const existingMessage = document.querySelector('#editModal .success-message, #editModal .error-message');
        if (existingMessage) existingMessage.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        const form = document.getElementById('editForm');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        }
    }
    
    formatDate(dateValue) {
        if (!dateValue) return 'Unknown';
        
        // If it's already a formatted string (like "2024-08-05"), try to parse it
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // If parsing fails, return the original value
        return dateValue;
    }
    
    // Track Management Methods
    setupTrackManagement() {
        console.log('Setting up track management...');
        const addTrackBtn = document.getElementById('addTrackBtn');
        const tracksContainer = document.getElementById('tracksContainer');
        const totalDisplay = document.getElementById('totalDurationDisplay');
        
        console.log('Elements found:', { addTrackBtn: !!addTrackBtn, tracksContainer: !!tracksContainer, totalDisplay: !!totalDisplay });
        
        if (addTrackBtn) {
            addTrackBtn.addEventListener('click', () => this.addTrack());
        }
        
        if (tracksContainer && totalDisplay) {
            // Set up existing track handlers
            this.updateTrackHandlers();
            // Force initial value setting on existing inputs
            const existingInputs = tracksContainer.querySelectorAll('.track-duration');
            existingInputs.forEach(input => {
                if (!input.value) input.value = '';
            });
            this.calculateTotalDuration();
        } else {
            console.error('Missing track management elements:', { tracksContainer: !!tracksContainer, totalDisplay: !!totalDisplay });
        }
    }
    
    addTrack() {
        const tracksContainer = document.getElementById('tracksContainer');
        if (!tracksContainer) return;
        
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
            <input type="text" class="track-title" placeholder="Track title..." value="">
            <input type="text" class="track-duration" placeholder="Duration (mm:ss)" value="">
            <button type="button" class="remove-track-btn">-</button>
        `;
        
        tracksContainer.appendChild(trackItem);
        this.updateTrackHandlers();
    }
    
    updateTrackHandlers() {
        // Remove track buttons
        document.querySelectorAll('.remove-track-btn').forEach(btn => {
            btn.removeEventListener('click', this.removeTrackHandler);
            btn.addEventListener('click', (e) => {
                const trackItem = e.target.closest('.track-item');
                const container = trackItem.parentNode;
                
                // Don't remove if it's the last track
                if (container.children.length > 1) {
                    trackItem.remove();
                    this.calculateTotalDuration();
                }
            });
        });
        
        // Duration input handlers
        document.querySelectorAll('.track-duration').forEach(input => {
            input.removeEventListener('input', this.durationInputHandler);
            input.addEventListener('input', () => this.calculateTotalDuration());
            
            // Format duration input
            input.addEventListener('blur', (e) => {
                const value = e.target.value ? e.target.value.trim() : '';
                if (value && !value.includes(':')) {
                    // If just numbers, assume it's seconds and convert to mm:ss
                    const seconds = parseInt(value);
                    if (!isNaN(seconds)) {
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = seconds % 60;
                        e.target.value = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                        this.calculateTotalDuration();
                    }
                }
            });
        });
    }
    
    calculateTotalDuration() {
        console.log('Calculating total duration...');
        const durationInputs = document.querySelectorAll('.track-duration');
        console.log('Found duration inputs:', durationInputs.length);
        
        let totalSeconds = 0;
        
        durationInputs.forEach((input, index) => {
            const duration = input.value ? input.value.trim() : '';
            console.log(`Track ${index + 1} duration:`, duration, 'Input element:', input);
            if (duration && duration.length > 0) {
                const parts = duration.split(':');
                const minutes = parseInt(parts[0]) || 0;
                const seconds = parseInt(parts[1]) || 0;
                const trackSeconds = minutes * 60 + seconds;
                totalSeconds += trackSeconds;
                console.log(`Track ${index + 1}: ${minutes}m ${seconds}s = ${trackSeconds}s`);
            }
        });
        
        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const totalDuration = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        console.log('Total duration calculated:', totalDuration);
        
        const totalDisplay = document.getElementById('totalDurationDisplay');
        if (totalDisplay) {
            totalDisplay.textContent = totalDuration;
            console.log('Total duration updated in display');
        } else {
            console.error('Total duration display element not found!');
        }
    }
    
    getTracksData() {
        console.log('Getting tracks data...');
        const trackItems = document.querySelectorAll('.track-item');
        console.log('Found track items:', trackItems.length);
        const tracks = [];
        
        trackItems.forEach((item, index) => {
            const titleInput = item.querySelector('.track-title');
            const durationInput = item.querySelector('.track-duration');
            
            console.log(`Track ${index + 1} inputs:`, { titleInput: !!titleInput, durationInput: !!durationInput });
            
            if (titleInput && durationInput) {
                const title = titleInput.value ? titleInput.value.trim() : '';
                const duration = durationInput.value ? durationInput.value.trim() : '';
                
                console.log(`Track ${index + 1} values:`, { title, duration });
                
                if (title && duration) {
                    tracks.push({ title, duration });
                }
            }
        });
        
        console.log('Final tracks array:', tracks);
        return tracks;
    }
    
    // File Input Methods
    setupFileInputs() {
        const fileInputs = document.querySelectorAll('.admin-file-input');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFilePreview(e.target);
            });
        });
    }
    
    handleFilePreview(input) {
        const preview = document.getElementById(input.name + '_preview');
        if (!preview) return;
        
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (file.type.startsWith('image/')) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
                    `;
                } else {
                    preview.innerHTML = `<p style="font-size: 12px; color: #666;">File selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>`;
                }
            };
            
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    }
    
    setupEditFileInputs() {
        const fileInputs = document.querySelectorAll('#editModal .admin-file-input');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleEditFilePreview(e.target);
            });
        });
    }
    
    setupEditTrackManagement() {
        console.log('Setting up edit track management...');
        const addTrackBtn = document.getElementById('editAddTrackBtn');
        const tracksContainer = document.getElementById('editTracksContainer');
        const totalDisplay = document.getElementById('editTotalDurationDisplay');
        
        if (addTrackBtn) {
            addTrackBtn.addEventListener('click', () => this.addEditTrack());
        }
        
        if (tracksContainer && totalDisplay) {
            this.updateEditTrackHandlers();
            this.calculateEditTotalDuration();
        }
    }
    
    addEditTrack() {
        const tracksContainer = document.getElementById('editTracksContainer');
        if (!tracksContainer) return;
        
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
            <input type="text" class="track-title" placeholder="Track title..." value="">
            <input type="text" class="track-duration" placeholder="Duration (mm:ss)" value="">
            <button type="button" class="remove-track-btn">-</button>
        `;
        
        tracksContainer.appendChild(trackItem);
        this.updateEditTrackHandlers();
    }
    
    updateEditTrackHandlers() {
        const container = document.getElementById('editTracksContainer');
        if (!container) return;
        
        // Remove track buttons
        container.querySelectorAll('.remove-track-btn').forEach(btn => {
            btn.onclick = (e) => {
                const trackItem = e.target.closest('.track-item');
                const container = trackItem.parentNode;
                
                if (container.children.length > 1) {
                    trackItem.remove();
                    this.calculateEditTotalDuration();
                }
            };
        });
        
        // Duration input handlers
        container.querySelectorAll('.track-duration').forEach(input => {
            input.oninput = () => this.calculateEditTotalDuration();
        });
    }
    
    calculateEditTotalDuration() {
        const durationInputs = document.querySelectorAll('#editTracksContainer .track-duration');
        let totalSeconds = 0;
        
        durationInputs.forEach((input) => {
            const duration = input.value ? input.value.trim() : '';
            if (duration && duration.length > 0) {
                const parts = duration.split(':');
                const minutes = parseInt(parts[0]) || 0;
                const seconds = parseInt(parts[1]) || 0;
                const trackSeconds = minutes * 60 + seconds;
                totalSeconds += trackSeconds;
            }
        });
        
        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const totalDuration = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        const totalDisplay = document.getElementById('editTotalDurationDisplay');
        if (totalDisplay) {
            totalDisplay.textContent = totalDuration;
        }
    }
    
    getEditTracksData() {
        const trackItems = document.querySelectorAll('#editTracksContainer .track-item');
        const tracks = [];
        
        trackItems.forEach((item) => {
            const titleInput = item.querySelector('.track-title');
            const durationInput = item.querySelector('.track-duration');
            
            if (titleInput && durationInput) {
                const title = titleInput.value ? titleInput.value.trim() : '';
                const duration = durationInput.value ? durationInput.value.trim() : '';
                
                if (title && duration) {
                    tracks.push({ title, duration });
                }
            }
        });
        
        return tracks;
    }
    
    handleEditFilePreview(input) {
        const preview = document.getElementById('edit_' + input.name + '_preview');
        if (!preview) return;
        
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (file.type.startsWith('image/')) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                        <p style="font-size: 12px; color: #666; margin-top: 8px;">${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
                    `;
                } else {
                    preview.innerHTML = `<p style="font-size: 12px; color: #666;">File selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>`;
                }
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // Pinned Projects Management
    updatePinnedContent(data, contentType) {
        // Only run on the main page
        if (!document.querySelector('.pinned-projects')) return;
        
        // Add to the appropriate pinned grid
        const targetGrid = document.querySelector(`#pinned-${contentType === 'experiment' ? 'experiments' : contentType} .pinned-grid`);
        if (!targetGrid) return;
        
        // Remove existing pinned item with same ID if it exists
        const existingItem = targetGrid.querySelector(`[data-id="${data.id}"]`);
        if (existingItem) {
            existingItem.remove();
        }
        
        // Add the new pinned item
        this.addPinnedItemToGrid(data, targetGrid);
        
        // Update empty message visibility
        this.updateEmptyMessages();
    }
    
    addPinnedItemToGrid(data, targetGrid) {
        // Create appropriate card based on content type
        let cardElement;
        
        switch(data.type) {
            case 'game':
                cardElement = this.createPinnedGameCard(data);
                break;
            case 'writing':
                cardElement = this.createPinnedWritingCard(data);
                break;
            case 'music':
                cardElement = this.createPinnedMusicCard(data);
                break;
            case 'experiment':
                cardElement = this.createPinnedExperimentCard(data);
                break;
            default:
                return;
        }
        
        if (cardElement) {
            targetGrid.appendChild(cardElement);
        }
    }
    
    createPinnedGameCard(data) {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.dataset.id = data.id;
        
        const displayDate = new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        gameCard.innerHTML = `
            <h3 class="game-title">${data.title}</h3>
            <p class="game-date">${displayDate}</p>
            <p class="game-description">${data.description}</p>
            <button class="play-button">${data.demo ? 'Play Game' : 'Coming Soon'}</button>
        `;
        
        if (data.demo) {
            const playButton = gameCard.querySelector('.play-button');
            playButton.addEventListener('click', () => {
                window.open(data.demo, '_blank');
            });
        }
        
        return gameCard;
    }
    
    createPinnedWritingCard(data) {
        const writingCard = document.createElement('div');
        writingCard.className = 'writing-card';
        writingCard.dataset.id = data.id;
        
        const displayDate = data.published ? new Date(data.published) : new Date(data.createdAt);
        const readTime = Math.ceil((data.wordCount || 1000) / 200);
        
        writingCard.innerHTML = `
            <div class="writing-header">
                <span class="writing-type">${this.getWritingTypeLabel(data.genre)}</span>
                <span class="writing-genre">${data.genre}</span>
            </div>
            <h3 class="writing-title">${data.title}</h3>
            <p class="writing-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p class="writing-description">${data.excerpt}</p>
            <div class="writing-stats">
                <span class="word-count">${data.wordCount || 'Unknown'} words</span>
                <span class="read-time">${readTime} min read</span>
            </div>
            <button class="read-button">${data.link ? 'Read More' : 'Coming Soon'}</button>
        `;
        
        if (data.link) {
            const readButton = writingCard.querySelector('.read-button');
            readButton.addEventListener('click', () => {
                window.open(data.link, '_blank');
            });
        }
        
        return writingCard;
    }
    
    createPinnedMusicCard(data) {
        const musicCard = document.createElement('article');
        musicCard.className = 'music-card';
        musicCard.dataset.id = data.id;
        
        const category = data.musicCategory || 'original';
        const type = data.musicType || 'single';
        const displayDate = data.releaseDate ? new Date(data.releaseDate) : new Date(data.createdAt);
        
        // Parse track data
        let trackData = [];
        if (data.tracks) {
            try {
                trackData = JSON.parse(data.tracks);
            } catch (e) {
                trackData = [];
            }
        }
        
        // Create appropriate music card (album or single)
        if (type === 'album') {
            musicCard.classList.add('album-card');
            
            const coverImageHtml = data.cover && data.cover.startsWith('data:') 
                ? `<img src="${data.cover}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` 
                : `<div class="cover-design">
                    <div class="album-title-text">${data.title.substring(0, 3).toUpperCase()}</div>
                    <div class="glitch-effect"></div>
                   </div>`;
            
            musicCard.innerHTML = `
                <div class="music-artwork">
                    <div class="album-cover custom-album">
                        ${coverImageHtml}
                    </div>
                </div>
                <div class="music-info">
                    <h3 class="music-title">${data.title}</h3>
                    <p class="music-type">Album</p>
                    <p class="release-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="track-count">${trackData.length} tracks</p>
                </div>
                <button class="listen-button">${data.listen ? 'Listen Now' : 'View Tracks'}</button>
            `;
            
            musicCard.addEventListener('click', () => {
                this.showMusicModal(data, trackData);
            });
        } else {
            // Single card
            musicCard.classList.add('single-card');
            
            const singleImageHtml = data.cover && data.cover.startsWith('data:') 
                ? `<img src="${data.cover}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` 
                : `<div class="custom-design">
                    <div class="title-overlay">${data.title.substring(0, 2).toUpperCase()}</div>
                   </div>`;
            
            musicCard.innerHTML = `
                <div class="music-artwork">
                    <div class="single-cover custom-single">
                        ${singleImageHtml}
                    </div>
                </div>
                <div class="music-info">
                    <h3 class="music-title">${data.title}</h3>
                    <p class="music-type">${category.charAt(0).toUpperCase() + category.slice(1)} Single</p>
                    <p class="release-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="track-duration">${data.duration || '3:45'}</p>
                </div>
                <button class="listen-button">${data.listen ? 'Listen Now' : 'Coming Soon'}</button>
            `;
            
            if (data.listen) {
                const listenButton = musicCard.querySelector('.listen-button');
                listenButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(data.listen, '_blank');
                });
            }
        }
        
        return musicCard;
    }
    
    createPinnedExperimentCard(data) {
        const experimentCard = document.createElement('div');
        experimentCard.className = 'experiment-card';
        experimentCard.dataset.id = data.id;
        
        const displayDate = data.experimentDate ? new Date(data.experimentDate) : new Date(data.createdAt);
        
        experimentCard.innerHTML = `
            <h3 class="experiment-title">${data.title}</h3>
            <p class="experiment-date">${displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div class="experiment-meta">
                <span class="experiment-category">${data.category}</span>
                <span class="experiment-tech">${data.tech}</span>
            </div>
            <p class="experiment-description">${data.description}</p>
            <button class="experiment-button">${data.demo ? 'View Demo' : 'Coming Soon'}</button>
        `;
        
        if (data.demo) {
            const demoButton = experimentCard.querySelector('.experiment-button');
            demoButton.addEventListener('click', () => {
                window.open(data.demo, '_blank');
            });
        }
        
        return experimentCard;
    }
    
    updateEmptyMessages() {
        const categories = ['games', 'writing', 'music', 'experiments'];
        
        categories.forEach(category => {
            const grid = document.querySelector(`#pinned-${category} .pinned-grid`);
            const emptyMessage = document.querySelector(`#pinned-${category} .empty-message`);
            
            if (grid && emptyMessage) {
                if (grid.children.length === 0) {
                    emptyMessage.style.display = 'block';
                } else {
                    emptyMessage.style.display = 'none';
                }
            }
        });
    }
    
    // Music Modal Methods
    showMusicModal(data, trackData) {
        // Create or get modal
        let modal = document.getElementById('musicModal');
        if (!modal) {
            modal = this.createMusicModal();
            document.body.appendChild(modal);
        }
        
        // Populate modal content
        const category = data.musicCategory || 'original';
        const type = data.musicType || 'single';
        const displayDate = data.releaseDate ? new Date(data.releaseDate) : new Date(data.createdAt);
        
        document.getElementById('modalMusicTitle').textContent = data.title;
        document.getElementById('modalMusicInfo').textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)} • ${trackData.length} track${trackData.length !== 1 ? 's' : ''}`;
        document.getElementById('modalReleaseDate').textContent = displayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // Generate track list
        const trackList = document.getElementById('modalTrackList');
        trackList.innerHTML = '';
        
        let totalSeconds = 0;
        
        trackData.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            
            // Convert duration to seconds for total calculation
            const [minutes, seconds] = track.duration.split(':').map(Number);
            totalSeconds += minutes * 60 + seconds;
            
            trackItem.innerHTML = `
                <span class="track-number">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="track-name">${track.title}</span>
                <span class="track-duration">${track.duration}</span>
            `;
            
            trackList.appendChild(trackItem);
        });
        
        // Calculate and display total duration
        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const totalDuration = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('modalTotalDuration').textContent = `Total Duration: ${totalDuration}`;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    createMusicModal() {
        const modal = document.createElement('div');
        modal.id = 'musicModal';
        modal.className = 'album-modal';
        
        modal.innerHTML = `
            <div class="album-modal-content">
                <button class="modal-close">&times;</button>
                <div class="album-header">
                    <div class="album-artwork-large">
                        <div class="custom-album">
                            <div class="cover-design">
                                <div class="album-title-text">♪</div>
                            </div>
                        </div>
                    </div>
                    <div class="album-details">
                        <h2 id="modalMusicTitle"></h2>
                        <p id="modalMusicInfo"></p>
                        <p id="modalReleaseDate"></p>
                    </div>
                </div>
                <div class="tracklist">
                    <h3>Track Listing</h3>
                    <div id="modalTrackList" class="track-list-container"></div>
                    <div class="album-total">
                        <span id="modalTotalDuration"></span>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.hideMusicModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.hideMusicModal();
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.hideMusicModal();
            }
        });
        
        return modal;
    }
    
    hideMusicModal() {
        const modal = document.getElementById('musicModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Initialize admin panel when DOM is loaded
console.log('Admin.js script loaded');
console.log('Document ready state:', document.readyState);

const initAdmin = () => {
    console.log('Initializing admin panel...');
    try {
        window.adminPanel = new AdminPanel();
        console.log('Admin panel created successfully');
        
        // Test admin button click
        const adminButton = document.querySelector('.admin-button');
        if (adminButton) {
            console.log('Admin button found');
            adminButton.addEventListener('click', () => {
                console.log('Admin button clicked directly!');
            });
        } else {
            console.log('Admin button NOT found');
        }
        
        // Load pinned content after admin panel is ready (only on main page)
        // Note: Pinned content is now loaded via loadExistingContent in loadStoredData
        // This ensures it loads when the page first loads
    } catch (error) {
        console.error('Error initializing admin panel:', error);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}
