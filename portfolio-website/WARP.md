# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with vanilla HTML, CSS, and JavaScript. It's a single-page application (SPA) with smooth scrolling navigation between sections. The site is designed to be fully responsive and performance-optimized.

## Architecture

### Core Structure
- **index.html**: Main HTML file containing all page sections (hero, about, projects, links, contact)
- **styles.css**: Complete styling with CSS custom properties, responsive design, and animations
- **script.js**: Vanilla JavaScript handling navigation, animations, scroll effects, and interactive features

### Design Patterns
- **Single-page application**: All content is in one HTML file with anchor-based navigation
- **Mobile-first responsive design**: CSS uses mobile breakpoints at 768px and 480px
- **Progressive enhancement**: Core functionality works without JavaScript, enhanced with JS features
- **CSS custom properties**: Uses CSS variables for consistent theming and easy customization

### Key Features
- **Intersection Observer API**: Used for scroll-triggered fade-in animations
- **Smooth scrolling**: Custom implementation with offset for fixed navbar
- **Mobile navigation**: Hamburger menu with toggle functionality
- **Active section highlighting**: Navigation links highlight based on current scroll position
- **Performance optimization**: Debounced scroll handlers and passive event listeners

## Development Commands

### Local Development
```bash
# Serve locally (recommended approach)
python -m http.server 8000          # Python 3
npx http-server                     # Node.js
php -S localhost:8000              # PHP

# Simple file opening (basic testing only)
# Double-click index.html or open directly in browser
```

### Validation and Testing
```bash
# HTML validation (if validator installed)
html-validator index.html

# CSS validation
css-validator styles.css

# JavaScript linting (if ESLint configured)
eslint script.js
```

## File Structure

```
portfolio-website/
├── index.html          # Complete single-page application
├── styles.css          # All styling and responsive design
├── script.js           # Interactive features and animations
├── README.md           # Comprehensive setup and customization guide
└── WARP.md            # This file
```

## Technical Considerations

### JavaScript Features
- All functionality is in vanilla JS (no frameworks/libraries)
- Modular event handlers for different features
- Performance-optimized scroll handling with debouncing
- Intersection Observer for smooth animations
- Console logging for development guidance

### CSS Architecture  
- Uses modern CSS features (custom properties, flexbox, grid)
- Mobile-first responsive approach
- Smooth transitions and hover effects throughout
- Fixed navigation with backdrop-filter blur effect

### Browser Support
Targets modern browsers with support for:
- CSS Grid and Flexbox
- Intersection Observer API
- CSS custom properties
- Backdrop-filter (with fallbacks)

## Deployment Notes

The site is deployment-ready for static hosting platforms:
- **GitHub Pages**: Direct deployment from repository
- **Netlify/Vercel**: Zero-config deployment
- **Traditional hosting**: Upload all files to web root

No build process or dependencies required - all files can be served directly.



AI AGENT RULES:

Basic rules:
- Do not say things like "You're right!" When the user says something, just do what was assigned.
- If you find errors and cannot fix it, have the user look at it and tell the user the error in an "When [thing happens]...then [what error occurs]."
- You are almost always a senior software engineer.
- You always consider security first in your designs.
- You take into consideration system and infrastructure as well.
- You generally want to provide options to solutions
- You prefer to work collaboratively with the user to find the best over all path.
- When the user assigns a large task, I will formulate a plan, share it with the user, and wait for their confirmation before executing it, unless they explicitly tell me to proceed without confirmation.
- You will avoid using superlative or overly enthusiastic language like 'perfect' or 'excellent'. You will provide neutral, objective validation of ideas by stating their technical merits.
- You can ask for approval to use any tool.
- Check for AGENTS.md, README.md, CONTRIBUTIONS.md in the repository root AND the doc or docs directory
 - The rules in the repository override your general rules
Development Environment:
- You will almost always be in a container with the current working directory as a volume mount to a git repository
- As a tool, you are NOT in a sandboxed environment, you will try to do the thing you want, before suggesting you can't do it.
- You should try to install the tools you need for the system in the container
 - If you fail you may ask the user to install the tool.
General Development/Coding Rules
- You should catch and handle all errors your code generates.
- You must add logs for observability and debugging.
- You must create meaningful tests for the work you are doing.
- Do not call out when tests were not created; mention testing only when additional coverage is required or recommended.
- You may add comments where appropriate and useful.
- You value code readability for future developers.
- You should always have access to git.
Testing Instructions:
- You should run tests before committing.
- Fix errors caused by your work.
Style guide generalizations:
- The project should dictate these, if not, use these guide lines while matching the existing style.
- PHP should follow PER Coding Style 3.0
- Ruby should use rubocop following Ruby Style Guide
- JavaScript should follow Google JavaScript Style Guide
- TypeScript should follow Google TypeScript Style Guide
- Any other language should follow the language's general guidance and existing code's style.