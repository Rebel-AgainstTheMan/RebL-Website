console.log('Script.js is loading...');

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// Music Section Navigation
const showMusicCategory = (category) => {
    console.log('Switching music category to:', category);
    
    // Update main navigation
    const mainNavButtons = document.querySelectorAll('.music-main-nav-btn');
    mainNavButtons.forEach(btn => btn.classList.remove('active'));
    
    const categoryBtn = document.querySelector(`[data-category="${category}"]`);
    if (categoryBtn) {
        categoryBtn.classList.add('active');
    }
    
    // Show/hide sub navigation
    const subNavContainers = document.querySelectorAll('.music-sub-nav-container');
    subNavContainers.forEach(container => {
        const shouldShow = container.id === `${category}-nav`;
        container.style.display = shouldShow ? 'flex' : 'none';
    });
    
    // Show appropriate section (default to singles)
    showMusicSection(`${category}-singles`);
};

const showMusicSection = (sectionName) => {
    console.log('Switching music section to:', sectionName);
    
    // Hide all sections
    const sections = document.querySelectorAll('.music-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update sub navigation buttons
    const category = sectionName.split('-')[0];
    const subNavContainer = document.getElementById(`${category}-nav`);
    if (subNavContainer) {
        const subNavButtons = subNavContainer.querySelectorAll('.music-sub-nav-btn');
        subNavButtons.forEach(btn => btn.classList.remove('active'));
        
        const activeBtn = subNavContainer.querySelector(`[data-section="${sectionName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
};

// Initialize Music Section
const initMusicSection = () => {
    console.log('Initializing music section...');
    
    // Set up main navigation buttons
    const mainNavButtons = document.querySelectorAll('.music-main-nav-btn');
    mainNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            showMusicCategory(category);
        });
    });
    
    // Set up sub navigation buttons
    const subNavButtons = document.querySelectorAll('.music-sub-nav-btn');
    subNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            showMusicSection(section);
        });
    });
    
    // Initialize with default state
    setTimeout(() => {
        showMusicCategory('original');
    }, 100);
};

// Initialize music section when DOM is loaded (only on music page)
const initMusicPageIfNeeded = () => {
    if (!document.querySelector('.music-nav-section')) {
        return;
    }
    
    console.log('On music page, initializing music section');
    initMusicSection();
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
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing all sections');
    initMusicPageIfNeeded();
    initPinnedProjects();
});

console.log('Script.js loaded successfully');