/**
 * FKTI Learning Hub JavaScript
 * Handles navigation, interactions, and course routing
 */

// Global variables
let mobileMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHub();
    setupEventListeners();
    setupScrollEffects();
});

/**
 * Initialize the hub
 */
function initializeHub() {
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Initialize intersection observer for animations
    setupIntersectionObserver();
    
    // Setup course cards hover effects
    setupCourseCardEffects();
    
    // Initialize DataBot interactions
    initializeDataBot();
    
    // Initialize theme system
    initializeThemes();
    
    console.log('FKTI Learning Hub initialized');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Scroll handler for navbar
    window.addEventListener('scroll', handleScroll);
    
    // Course card click handlers
    setupCourseClickHandlers();
}

/**
 * Handle navigation link clicks
 */
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenuOpen) {
            toggleMobileMenu();
        }
    }
}

/**
 * Handle scroll effects
 */
function handleScroll() {
    const nav = document.querySelector('.main-nav');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
}

/**
 * Setup intersection observer for animations
 */
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.course-card, .feature-item, .path-step');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Setup course card effects
 */
function setupCourseCardEffects() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Setup course click handlers
 */
function setupCourseClickHandlers() {
    // Course buttons
    const courseBtns = document.querySelectorAll('[onclick*="enterCourse"]');
    courseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const course = this.onclick.toString().match(/'(\w+)'/)[1];
            enterCourse(course);
        });
    });
}

/**
 * Enter a specific course
 */
function enterCourse(courseType) {
    // Show loading animation
    showLoadingAnimation();
    
    // Course routing
    const courseUrls = {
        'python': 'python_course/index.html',
        'airflow': 'airflow_course/index.html',
        'terraform': 'terraform_course/index.html',
        'redshift': 'redshift_course/index.html',
        'mssql': 'mssql_course/index.html',
        'dbt': 'dbt_course/index.html',
        'metabase': 'metabase_course/index.html'
    };
    
    const url = courseUrls[courseType];
    if (url) {
        // Add a slight delay for better UX
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    } else {
        console.error('Course type not found:', courseType);
        hideLoadingAnimation();
    }
}

/**
 * Scroll to courses section
 */
function scrollToCourses() {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = coursesSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        navLinks.style.padding = '20px';
        navLinks.style.borderTop = '1px solid #e2e8f0';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        navLinks.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Reset nav links display on desktop
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'relative';
        navLinks.style.top = 'auto';
        navLinks.style.left = 'auto';
        navLinks.style.right = 'auto';
        navLinks.style.background = 'none';
        navLinks.style.boxShadow = 'none';
        navLinks.style.padding = '0';
        navLinks.style.borderTop = 'none';
    }
}

/**
 * Show loading animation
 */
function showLoadingAnimation() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading Course...</div>
        </div>
    `;
    
    // Add loading styles
    const loadingStyles = `
        <style>
            #loadingOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
            
            .loading-container {
                text-align: center;
                padding: 40px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #e2e8f0;
                border-top: 4px solid #0077be;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            .loading-text {
                color: #4a4a4a;
                font-weight: 600;
                font-size: 1.125rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', loadingStyles);
    document.body.appendChild(overlay);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Hide loading animation
 */
function hideLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = 'auto';
}

/**
 * Open demo modal (placeholder function)
 */
function openDemo() {
    alert('Demo video coming soon! For now, explore our interactive courses by clicking on the course buttons below.');
}

/**
 * Setup scroll effects for floating animations
 */
function setupScrollEffects() {
    const floatingElements = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // Only trigger if not in input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Press 'P' to go to Python course
    if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey) {
        enterCourse('python');
    }
    
    // Press 'A' to go to Airflow course
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.altKey) {
        enterCourse('airflow');
    }
    
    // Press 'T' to go to Terraform course
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey) {
        enterCourse('terraform');
    }
    
    // Press 'R' to go to Redshift course
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey) {
        enterCourse('redshift');
    }
    
    // Press 'M' to go to MSSQL course
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
        enterCourse('mssql');
    }
    
    // Press 'D' to go to DBT course
    if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.altKey) {
        enterCourse('dbt');
    }
    
    // Press 'B' to go to Metabase course
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.altKey) {
        enterCourse('metabase');
    }
    
    // Press 'Escape' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

/**
 * Add course progress tracking (if returning from a course)
 */
function checkCourseProgress() {
    const pythonProgress = localStorage.getItem('fkti-python-progress');
    const airflowProgress = localStorage.getItem('fkti-airflow-progress');
    
    if (pythonProgress) {
        const progress = JSON.parse(pythonProgress);
        updateCourseCardProgress('python', progress.completedSections || 0);
    }
    
    if (airflowProgress) {
        const progress = JSON.parse(airflowProgress);
        updateCourseCardProgress('airflow', progress.completedSections || 0);
    }
}

/**
 * Update course card with progress indicator
 */
function updateCourseCardProgress(courseType, completedSections) {
    const courseCard = document.querySelector(`.${courseType}-card`);
    if (courseCard && completedSections > 0) {
        const progressBadge = document.createElement('div');
        progressBadge.className = 'progress-badge';
        progressBadge.innerHTML = `<i class="fas fa-check-circle"></i> ${completedSections} sections completed`;
        progressBadge.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.1);
            color: #4caf50;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        courseCard.style.position = 'relative';
        courseCard.appendChild(progressBadge);
    }
}

// Initialize progress checking when page loads
document.addEventListener('DOMContentLoaded', checkCourseProgress);

/**
 * Scroll to top of page (for logo click)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Initialize DataBot interactions
 */
function initializeDataBot() {
    const databotSpeech = document.getElementById('databot-speech');
    const journeySteps = document.querySelectorAll('.journey-step');
    
    if (!databotSpeech || journeySteps.length === 0) return;
    
    // DataBot speech messages for each step
    const speechMessages = {
        default: "Let me show you how we turn chaos into insights! 🤖",
        1: "Look at this mess! MSSQL has data everywhere! 😵",
        2: "Python to the rescue! Let me investigate this data! 🔍",
        3: "Time to build our cloud empire with Terraform! 🏗️",
        4: "Redshift will organize everything perfectly! ✨",
        5: "Airflow will automate everything! No more manual work! 🤖",
        6: "DBT time! Let's cook up some insights! 👨‍🍳",
        7: "Metabase will make beautiful dashboards! 📊",
        result: "Mission accomplished! From chaos to clarity! 🎉"
    };
    
    // Intersection Observer for DataBot speech
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target.getAttribute('data-step');
                if (step && speechMessages[step]) {
                    updateDatabotSpeech(speechMessages[step]);
                }
            }
        });
    }, {
        threshold: 0.6,
        rootMargin: '-50px 0px'
    });
    
    // Observe all journey steps
    journeySteps.forEach(step => {
        observer.observe(step);
    });
    
    // Also observe the result card
    const resultCard = document.querySelector('.journey-result');
    if (resultCard) {
        const resultObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateDatabotSpeech(speechMessages.result);
                }
            });
        }, {
            threshold: 0.5
        });
        resultObserver.observe(resultCard);
    }
    
    // Add click interaction to DataBot
    const databot = document.querySelector('.databot');
    if (databot) {
        databot.addEventListener('click', () => {
            const funnyMessages = [
                "Beep boop! Want to learn data engineering? 🤖",
                "I love organizing messy data! It's like LEGO for adults! 🧱",
                "Fun fact: I run on coffee and SQL queries! ☕",
                "My favorite hobby? Making data pipelines go BRRRR! 🚀",
                "I dream in JSON and wake up in SQL! 💭",
                "Click a course below to start your data journey! 👇"
            ];
            const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            updateDatabotSpeech(randomMessage);
            
            // Add bounce animation
            databot.style.animation = 'bounce 0.6s ease-in-out';
            setTimeout(() => {
                databot.style.animation = 'bounce 2s ease-in-out infinite';
            }, 600);
        });
    }
}

/**
 * Update DataBot speech bubble
 */
function updateDatabotSpeech(message) {
    const speechElement = document.getElementById('databot-speech');
    if (speechElement) {
        // Add typing animation
        speechElement.style.opacity = '0.5';
        setTimeout(() => {
            speechElement.textContent = message;
            speechElement.style.opacity = '1';
            
            // Add pulse animation to speech bubble
            const speechBubble = speechElement.parentElement;
            speechBubble.style.animation = 'pulse 0.8s ease-in-out';
            setTimeout(() => {
                speechBubble.style.animation = 'pulse 2s ease-in-out infinite';
            }, 800);
        }, 300);
    }
}

/**
 * Theme Management Functions
 */

// Initialize theme system
function initializeThemes() {
    // Load saved theme or default to blue
    const savedTheme = localStorage.getItem('fkti-theme') || 'blue';
    setTheme(savedTheme);
    
    // Close theme dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });
}

// Toggle theme selector dropdown
function toggleThemeSelector() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Set theme
function setTheme(themeName) {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save to localStorage
    localStorage.setItem('fkti-theme', themeName);
    
    // Close dropdown
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    
    console.log(`Theme changed to: ${themeName}`);
}

// Export functions for global access
window.enterCourse = enterCourse;
window.scrollToCourses = scrollToCourses;
window.toggleMobileMenu = toggleMobileMenu;
window.openDemo = openDemo;
window.toggleThemeSelector = toggleThemeSelector;
window.setTheme = setTheme;
window.scrollToTop = scrollToTop;
