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
        'airflow': 'airflow_course/index.html'
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
    // Press 'P' to go to Python course
    if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey) {
        enterCourse('python');
    }
    
    // Press 'A' to go to Airflow course
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.altKey) {
        enterCourse('airflow');
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

// Export functions for global access
window.enterCourse = enterCourse;
window.scrollToCourses = scrollToCourses;
window.toggleMobileMenu = toggleMobileMenu;
window.openDemo = openDemo;
