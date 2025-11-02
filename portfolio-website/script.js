console.log('Script.js is loading...');
console.log('Current page:', window.location.pathname);

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 70; // Height of fixed navbar
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
const animateElements = document.querySelectorAll('.project-card, .link-card, .about-content, .contact-content');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinksArray = Array.from(navLinks);

const highlightNavigation = () => {
    let current = '';
    const scrollPosition = window.scrollY + 100; // Offset for fixed navbar
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // If we're near the bottom of the page (within 200px), activate the last section
    if (scrollPosition + windowHeight >= documentHeight - 200) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
            current = lastSection.getAttribute('id');
        }
    } else {
        // Normal section detection with improved logic for small sections
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if scroll position is within this section, with some tolerance
            if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionBottom + 50) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
};

// Navbar background opacity on scroll
const navbar = document.querySelector('.navbar');

const handleScroll = () => {
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.4)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
    }
    
    // Also update active navigation
    highlightNavigation();
};

// Event listeners for scroll effects
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', highlightNavigation);

// Add loading animation to hero section
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);
});

// Add hover effects for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});


// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #007acc !important;
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: #007acc;
        border-radius: 1px;
    }
`;
document.head.appendChild(style);



// Performance optimization: Debounced scroll handler
let scrollTimeout;
const debouncedScrollHandler = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 10);
};

// Replace the direct scroll listener with debounced version for better performance
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

// Game functions using consolidated utilities
const sortGames = (sortType = 'date-newest') => {
    const gamesGrid = document.querySelector('.games-grid');
    const gameCards = Array.from(gamesGrid?.querySelectorAll('.game-card') || []);
    sortContent(sortType, gamesGrid, gameCards, '.game-title');
};


// Generic search function for all content types
const searchContent = (searchTerm, cards, selectors) => {
    const filteredSearch = searchTerm.toLowerCase().trim();
    
    cards.forEach(card => {
        let isMatch = filteredSearch === '';
        
        if (!isMatch) {
            // Check each selector for matches
            for (const selector of selectors) {
                const element = card.querySelector(selector.element);
                if (element && element.textContent.toLowerCase().includes(filteredSearch)) {
                    isMatch = true;
                    break;
                }
            }
        }
        
        if (isMatch) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (card.style.opacity === '0') {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
};

// Generic sort function for all content types
const sortContent = (sortType, grid, cards, titleSelector) => {
    if (!grid) return;
    
    const sortedCards = [...cards].sort((a, b) => {
        switch (sortType) {
            case 'date-newest':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'date-oldest':
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            case 'alpha-az':
                const titleA = a.querySelector(titleSelector).textContent;
                const titleB = b.querySelector(titleSelector).textContent;
                return titleA.localeCompare(titleB);
            case 'alpha-za':
                const titleA2 = a.querySelector(titleSelector).textContent;
                const titleB2 = b.querySelector(titleSelector).textContent;
                return titleB2.localeCompare(titleA2);
            default:
                return 0;
        }
    });
    
    grid.innerHTML = '';
    sortedCards.forEach(card => grid.appendChild(card));
};

// Game Search Functionality
const searchGames = (searchTerm) => {
    const gameCards = document.querySelectorAll('.game-card');
    const filteredSearch = searchTerm.toLowerCase().trim();
    
    gameCards.forEach(card => {
        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const description = card.querySelector('.game-description').textContent.toLowerCase();
        const keywords = card.dataset.keywords ? card.dataset.keywords.toLowerCase() : '';
        
        // Search in title, description, and keywords
        const isMatch = filteredSearch === '' || 
                       title.includes(filteredSearch) || 
                       description.includes(filteredSearch) || 
                       keywords.includes(filteredSearch);
        
        if (isMatch) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (card.style.opacity === '0') {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
};

// Initialize games section
const initGamesSection = () => {
    if (!document.querySelector('.games-grid')) return;
    
    sortGames('date-newest');
    
    const searchInput = document.getElementById('gameSearch');
    const sortSelect = document.getElementById('sortSelect');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchGames(e.target.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchGames('');
                searchInput.blur();
            }
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => sortGames(e.target.value));
    }
    
    // Add fade-in animation
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
};

document.addEventListener('DOMContentLoaded', initGamesSection);

// WRITING SECTION FUNCTIONALITY

// Writing functions using consolidated utilities
const searchWritings = (searchTerm) => {
    const writingCards = document.querySelectorAll('.writing-card');
    const selectors = [
        { element: '.writing-title' },
        { element: '.writing-description' }
    ];
    searchContent(searchTerm, writingCards, selectors);
};

const sortWritings = (sortType = 'date-newest') => {
    const writingGrid = document.querySelector('.writing-grid');
    const writingCards = Array.from(writingGrid?.querySelectorAll('.writing-card') || []);
    sortContent(sortType, writingGrid, writingCards, '.writing-title');
};

// Writing Filtering System
const filterWritings = () => {
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const genreFilter = document.getElementById('genreFilter')?.value || 'all';
    const excludeTypeFilter = document.getElementById('excludeTypeFilter')?.value || 'none';
    const excludeGenreFilter = document.getElementById('excludeGenreFilter')?.value || 'none';
    const writingCards = document.querySelectorAll('.writing-card');
    
    writingCards.forEach(card => {
        const cardType = card.dataset.type;
        const cardGenre = card.dataset.genre;
        
        // Include filters
        const typeMatch = typeFilter === 'all' || cardType === typeFilter;
        const genreMatch = genreFilter === 'all' || cardGenre === genreFilter;
        
        // Exclude filters
        const typeNotExcluded = excludeTypeFilter === 'none' || cardType !== excludeTypeFilter;
        const genreNotExcluded = excludeGenreFilter === 'none' || cardGenre !== excludeGenreFilter;
        
        if (typeMatch && genreMatch && typeNotExcluded && genreNotExcluded) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (card.style.opacity === '0') {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
};

// Writing Preview Modal System
const showWritingPreview = (card) => {
    const modal = document.getElementById('writingPreview');
    if (!modal) return;
    
    const title = card.querySelector('.writing-title').textContent;
    const preview = card.dataset.preview;
    const typeSpan = card.querySelector('.writing-type');
    const genreSpan = card.querySelector('.writing-genre');
    const type = card.dataset.type;
    
    // Only show preview for stories, books, poems, and writing challenges
    if (!['short-story', 'book', 'poem', 'writing-challenge'].includes(type)) {
        return; // Don't show preview for articles or blogs
    }
    
    if (!preview) {
        return; // Don't show if no preview data
    }
    
    // Populate modal content
    const previewTitle = document.getElementById('previewTitle');
    const previewText = document.getElementById('previewText');
    
    if (previewTitle) previewTitle.textContent = title;
    if (previewText) previewText.textContent = preview;
    
    // Copy badges
    const badgesContainer = document.getElementById('previewBadges');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
        if (typeSpan) badgesContainer.appendChild(typeSpan.cloneNode(true));
        if (genreSpan) badgesContainer.appendChild(genreSpan.cloneNode(true));
    }
    
    // Show modal
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    // Update read button text based on type
    const readBtn = document.getElementById('previewReadButton');
    if (readBtn) {
        switch(type) {
            case 'book': readBtn.textContent = 'Read Preview'; break;
            case 'poem': readBtn.textContent = 'Read Poems'; break;
            case 'writing-challenge': readBtn.textContent = 'Read Challenge'; break;
            default: readBtn.textContent = 'Read Story';
        }
    }
};

const hideWritingPreview = () => {
    const modal = document.getElementById('writingPreview');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
};

// Initialize Writing Section
const initWritingSection = () => {
    // Set up search functionality
    const writingSearch = document.getElementById('writingSearch');
    if (writingSearch) {
        writingSearch.addEventListener('input', (e) => {
            searchWritings(e.target.value);
        });
        
        writingSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                writingSearch.value = '';
                searchWritings('');
                writingSearch.blur();
            }
        });
    }
    
    // Set up sort functionality
    const sortWriting = document.getElementById('sortWriting');
    if (sortWriting) {
        sortWriting.addEventListener('change', (e) => {
            sortWritings(e.target.value);
        });
    }
    
    // Set up filter functionality
    const typeFilter = document.getElementById('typeFilter');
    const genreFilter = document.getElementById('genreFilter');
    const excludeTypeFilter = document.getElementById('excludeTypeFilter');
    const excludeGenreFilter = document.getElementById('excludeGenreFilter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterWritings);
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', filterWritings);
    }
    
    if (excludeTypeFilter) {
        excludeTypeFilter.addEventListener('change', filterWritings);
    }
    
    if (excludeGenreFilter) {
        excludeGenreFilter.addEventListener('change', filterWritings);
    }
    
    // Set up preview modal functionality
    const modal = document.getElementById('writingPreview');
    const closeBtn = document.querySelector('.preview-close');
    
    // Add click listeners to writing cards (after cards are loaded)
    setTimeout(() => {
        const writingCards = document.querySelectorAll('.writing-card');
        writingCards.forEach(card => {
            // Only add click listener to cards with preview data
            const type = card.dataset.type;
            const hasPreview = card.dataset.preview;
            
            if (['short-story', 'book', 'poem', 'writing-challenge'].includes(type) && hasPreview) {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    showWritingPreview(card);
                });
                card.style.cursor = 'pointer';
                card.title = 'Click to preview';
            }
        });
    }, 100);
    
    // Close modal functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', hideWritingPreview);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideWritingPreview();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            hideWritingPreview();
        }
    });
    
    // Initial sort by newest first
    sortWritings('date-newest');
    
    // Add fade-in animation to writing cards
    const writingCards = document.querySelectorAll('.writing-card');
    writingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
};

// Initialize writing section when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWritingSection);
} else {
    initWritingSection();
}

// MUSIC SECTION FUNCTIONALITY

// Music Section Navigation
const showMusicCategory = (category) => {
    console.log('Switching music category to:', category);
    // Update main navigation
    const mainNavButtons = document.querySelectorAll('.music-main-nav-btn');
    console.log('Found main nav buttons:', mainNavButtons.length);
    mainNavButtons.forEach(btn => btn.classList.remove('active'));
    const categoryBtn = document.querySelector(`[data-category="${category}"]`);
    if (categoryBtn) {
        categoryBtn.classList.add('active');
        console.log('Activated category button for:', category);
    } else {
        console.error('Category button not found for:', category);
    }
    
    // Show/hide sub navigation
    const subNavContainers = document.querySelectorAll('.music-sub-nav-container');
    console.log('Found sub nav containers:', subNavContainers.length);
    subNavContainers.forEach(container => {
        const shouldShow = container.id === `${category}-nav`;
        container.style.display = shouldShow ? 'flex' : 'none';
        console.log(`Container ${container.id}: ${shouldShow ? 'shown' : 'hidden'}`);
    });
    
    // Show appropriate section (default to singles)
    showMusicSection(`${category}-singles`);
};

const showMusicSection = (sectionName) => {
    console.log('Switching music section to:', sectionName);
    // Hide all sections
    const sections = document.querySelectorAll('.music-section');
    console.log('Found music sections:', sections.length);
    sections.forEach(section => {
        section.classList.remove('active');
        console.log('Hidden section:', section.id);
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    console.log('Target section:', `${sectionName}-section`, 'Found:', !!targetSection);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Activated section:', targetSection.id);
    } else {
        console.error('Target section not found:', `${sectionName}-section`);
    }
    
    // Update sub navigation buttons
    const category = sectionName.split('-')[0]; // original or cover
    const subNavContainer = document.getElementById(`${category}-nav`);
    console.log('Sub nav container:', `${category}-nav`, 'Found:', !!subNavContainer);
    if (subNavContainer) {
        const subNavButtons = subNavContainer.querySelectorAll('.music-sub-nav-btn');
        console.log('Found sub nav buttons:', subNavButtons.length);
        subNavButtons.forEach(btn => btn.classList.remove('active'));
        
        const activeBtn = subNavContainer.querySelector(`[data-section="${sectionName}"]`);
        console.log('Active button for section:', sectionName, 'Found:', !!activeBtn);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log('Activated sub nav button for:', sectionName);
        } else {
            console.error('Sub nav button not found for section:', sectionName);
        }
    }
};

// Music Sorting System
const sortMusic = (sortType = 'newest') => {
    const sections = ['original-singles', 'original-albums', 'cover-singles', 'cover-albums'];
    
    sections.forEach(sectionType => {
        const grid = document.querySelector(`#${sectionType}-section .music-grid`);
        if (!grid) return;
        
        const cards = Array.from(grid.querySelectorAll('.music-card'));
        
        cards.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            
            if (sortType === 'newest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
        
        // Clear grid and re-append in sorted order
        grid.innerHTML = '';
        cards.forEach(card => grid.appendChild(card));
    });
};

// Album Modal System
const showAlbumModal = (albumCard) => {
    const modal = document.getElementById('albumModal');
    if (!modal) return;
    
    const title = albumCard.querySelector('.music-title').textContent;
    const releaseDate = albumCard.querySelector('.release-date').textContent;
    const trackData = albumCard.dataset.tracks;
    
    if (!trackData) return;
    
    try {
        const tracks = JSON.parse(trackData);
        
        // Populate modal content
        document.getElementById('modalAlbumTitle').textContent = title;
        document.getElementById('modalAlbumInfo').textContent = `Album • ${tracks.length} tracks`;
        document.getElementById('modalReleaseDate').textContent = releaseDate;
        
        // Set album artwork
        const artwork = modal.querySelector('.album-artwork-large');
        const originalCover = albumCard.querySelector('.album-cover');
        if (originalCover && artwork) {
            artwork.className = 'album-artwork-large ' + originalCover.className.replace('album-cover', '');
            artwork.innerHTML = originalCover.innerHTML;
        }
        
        // Generate track list
        const trackList = document.getElementById('trackList');
        trackList.innerHTML = '';
        
        let totalSeconds = 0;
        
        tracks.forEach((track, index) => {
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
        document.getElementById('totalDuration').textContent = `Total Duration: ${totalDuration}`;
        
        // Show modal
        modal.classList.add('active');
        
    } catch (error) {
        console.error('Error parsing track data:', error);
    }
};

const hideAlbumModal = () => {
    const modal = document.getElementById('albumModal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// Initialize Music Section
const initMusicSection = () => {
    console.log('Initializing music section...');
    // Set up main navigation buttons
    const mainNavButtons = document.querySelectorAll('.music-main-nav-btn');
    console.log('Setting up main nav buttons:', mainNavButtons.length);
    mainNavButtons.forEach((btn, index) => {
        console.log(`Main nav button ${index}:`, btn.dataset.category);
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            console.log('Main nav button clicked:', category);
            showMusicCategory(category);
        });
    });
    
    // Set up sub navigation buttons
    const subNavButtons = document.querySelectorAll('.music-sub-nav-btn');
    console.log('Setting up sub nav buttons:', subNavButtons.length);
    subNavButtons.forEach((btn, index) => {
        console.log(`Sub nav button ${index}:`, btn.dataset.section);
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            console.log('Sub nav button clicked:', section);
            showMusicSection(section);
        });
    });
    
    // Set up sort functionality
    const musicSort = document.getElementById('musicSort');
    if (musicSort) {
        musicSort.addEventListener('change', (e) => {
            sortMusic(e.target.value);
        });
    }
    
    // Set up album click handlers
    const albumCards = document.querySelectorAll('.album-card');
    albumCards.forEach(card => {
        card.addEventListener('click', () => {
            showAlbumModal(card);
        });
        card.style.cursor = 'pointer';
        card.title = 'Click to view tracks';
    });
    
    // Set up modal close functionality
    const modal = document.getElementById('albumModal');
    const closeBtn = modal?.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAlbumModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideAlbumModal();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            hideAlbumModal();
        }
    });
    
    // Initial sort by newest first
    sortMusic('newest');
    
    // Add fade-in animation to music cards
    const musicCards = document.querySelectorAll('.music-card');
    musicCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
};

// Initialize music section when DOM is loaded (only on music page)
const initMusicPageIfNeeded = () => {
    // Only run on music page
    if (!document.querySelector('.music-nav-section')) {
        console.log('Not on music page, skipping music section initialization');
        return;
    }
    
    console.log('On music page, initializing music section');
    
    // Check what sections exist
    const sections = document.querySelectorAll('.music-section');
    console.log('Found music sections:', sections.length);
    sections.forEach(section => {
        console.log('Section:', section.id, 'Classes:', section.className);
    });
    
    initMusicSection();
    
    // Initialize with default state - make sure original singles is active
    setTimeout(() => {
        console.log('Setting default music section state');
        
        // Force set the initial state
        const originalSinglesSection = document.getElementById('original-singles-section');
        if (originalSinglesSection) {
            // Hide all sections first
            document.querySelectorAll('.music-section').forEach(s => s.classList.remove('active'));
            // Show original singles
            originalSinglesSection.classList.add('active');
            console.log('Forced original-singles-section to be active');
        }
        
        // Set button states
        document.querySelectorAll('.music-main-nav-btn').forEach(btn => btn.classList.remove('active'));
        const originalBtn = document.querySelector('[data-category="original"]');
        if (originalBtn) {
            originalBtn.classList.add('active');
            console.log('Activated original button');
        }
        
        // Show original sub nav, hide cover sub nav
        const originalNav = document.getElementById('original-nav');
        const coverNav = document.getElementById('cover-nav');
        if (originalNav) {
            originalNav.style.display = 'flex';
            console.log('Showed original nav');
        }
        if (coverNav) {
            coverNav.style.display = 'none';
            console.log('Hid cover nav');
        }
        
        // Set sub button active state
        document.querySelectorAll('.music-sub-nav-btn').forEach(btn => btn.classList.remove('active'));
        const singlesBtn = document.querySelector('[data-section="original-singles"]');
        if (singlesBtn) {
            singlesBtn.classList.add('active');
            console.log('Activated singles button');
        }
    }, 200);
};

// Debug function to check music section state
window.debugMusicSections = () => {
    console.log('=== Music Section Debug ===');
    
    const sections = document.querySelectorAll('.music-section');
    console.log('Music sections found:', sections.length);
    sections.forEach(section => {
        console.log(`Section ${section.id}: ${section.classList.contains('active') ? 'ACTIVE' : 'inactive'}`);
    });
    
    const mainBtns = document.querySelectorAll('.music-main-nav-btn');
    console.log('Main nav buttons:', mainBtns.length);
    mainBtns.forEach(btn => {
        console.log(`Main button ${btn.dataset.category}: ${btn.classList.contains('active') ? 'ACTIVE' : 'inactive'}`);
    });
    
    const subContainers = document.querySelectorAll('.music-sub-nav-container');
    console.log('Sub nav containers:', subContainers.length);
    subContainers.forEach(container => {
        console.log(`Container ${container.id}: ${container.style.display !== 'none' ? 'VISIBLE' : 'hidden'}`);
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicPageIfNeeded);
} else {
    initMusicPageIfNeeded();
}

// Define loadPinnedContent function first
window.loadPinnedContent = () => {
    // Get stored data from localStorage
    const storedData = localStorage.getItem('portfolioData');
    if (!storedData) return;
    
    try {
        const data = JSON.parse(storedData);
        
        // Load pinned items from each category
        ['games', 'writings', 'musics', 'experiments'].forEach(category => {
            if (data[category]) {
                data[category].forEach(item => {
                    if (item.pinned && window.adminPanel) {
                        const contentType = category === 'writings' ? 'writing' : 
                                          category === 'musics' ? 'music' : 
                                          category === 'experiments' ? 'experiment' : 'game';
                        window.adminPanel.updatePinnedContent(item, contentType);
                    }
                });
            }
        });
    } catch (e) {
        console.error('Error loading pinned content:', e);
    }
};

// Initialize pinned projects section (only on main page)
const initPinnedProjects = () => {
    if (!document.querySelector('.pinned-projects')) return;
    
    console.log('Initializing pinned projects section');
    
    const navButtons = document.querySelectorAll('.pinned-nav-btn');
    const categories = document.querySelectorAll('.pinned-category');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCategory = btn.dataset.category;
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active category
            categories.forEach(cat => {
                if (cat.id === `pinned-${targetCategory}`) {
                    cat.classList.add('active');
                } else {
                    cat.classList.remove('active');
                }
            });
        });
    });
    
    // Initialize with stored pinned content
    loadPinnedContent();
};

// Initialize pinned projects when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPinnedProjects);
} else {
    initPinnedProjects();
}

// EXPERIMENTS PAGE FUNCTIONALITY
const initExperimentsSection = () => {
    // Only run on experiments page
    if (!document.querySelector('.experiments-section')) return;
    
    // Experiments functions using consolidated utilities
    const sortExperiments = (sortType = 'date-newest') => {
        const experimentsGrid = document.querySelector('.experiments-grid');
        const experimentCards = Array.from(experimentsGrid?.querySelectorAll('.experiment-card') || []);
        sortContent(sortType, experimentsGrid, experimentCards, '.experiment-title');
    };
    
    const searchExperiments = (searchTerm) => {
        const experimentCards = document.querySelectorAll('.experiment-card');
        const selectors = [
            { element: '.experiment-title' },
            { element: '.experiment-description' },
            { element: '.experiment-tech' }
        ];
        searchContent(searchTerm, experimentCards, selectors);
    };
    
    // Category Filter Functionality
    const filterByCategory = (category) => {
        const experimentCards = document.querySelectorAll('.experiment-card');
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        // Update active button
        categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        experimentCards.forEach(card => {
            const cardCategory = card.dataset.category || card.querySelector('.experiment-category')?.textContent.toLowerCase() || 'other';
            const matches = category === 'all' || cardCategory === category || cardCategory.includes(category);
            
            card.style.display = matches ? 'block' : 'none';
            
            if (matches) {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            }
        });
    };
    
    // Set up search functionality
    const searchInput = document.getElementById('experimentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchExperiments(e.target.value);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchExperiments('');
                searchInput.blur();
            }
        });
    }
    
    // Set up sort functionality
    const sortSelect = document.getElementById('experimentSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortExperiments(e.target.value);
        });
    }
    
    // Set up category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Auto-sort experiments when page loads
    sortExperiments('date-newest');
    
    // Add fade-in animation to experiment cards
    const experimentCards = document.querySelectorAll('.experiment-card');
    experimentCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
};

// Initialize experiments section when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExperimentsSection);
} else {
    initExperimentsSection();
}

// Fix dropdown focus highlight persistence
document.addEventListener('DOMContentLoaded', () => {
    const allSelects = document.querySelectorAll('select');
    
    allSelects.forEach(select => {
        // Auto-blur dropdown after selection
        select.addEventListener('change', function() {
            setTimeout(() => {
                this.blur();
            }, 100);
        });
        
        // Auto-blur dropdown after keyboard navigation
        select.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === 'Tab') {
                setTimeout(() => {
                    this.blur();
                }, 100);
            }
        });
    });
});
