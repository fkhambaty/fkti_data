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
        'datascience': 'data-science.html',
        'airflow': 'airflow_course/index.html',
        'terraform': 'terraform_course/index.html',
        'redshift': 'redshift_course/index.html',
        'mssql': 'mssql_course/index.html',
        'dbt': 'dbt_course/index.html',
        'metabase': 'metabase_course/index.html',
        'postgres': 'postgres_course/index.html',
        'dms': 'dms_course/index.html'
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
 * Scroll to specific course card in courses section
 */
function scrollToCourseCard(courseType) {
    // First scroll to courses section
    const coursesSection = document.getElementById('courses');
    if (!coursesSection) return;
    
    // Map course types to CSS class names
    const courseClassMap = {
        'python': 'python-card',
        'datascience': 'datascience-card', // Data Science card
        'airflow': 'airflow-card',
        'terraform': 'terraform-card',
        'redshift': 'redshift-card',
        'mssql': 'mssql-card',
        'dbt': 'dbt-card',
        'metabase': 'metabase-card',
        'postgres': 'postgres-card',
        'dms': 'dms-card'
    };
    
    const courseClass = courseClassMap[courseType];
    if (!courseClass) {
        // Fallback: just scroll to courses section
        coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    
    // Scroll to courses section first
    coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Then find and scroll to the specific course card
    setTimeout(() => {
        let courseCard;
        
        if (courseType === 'datascience') {
            // Try to find by class first, then by data attribute or content
            courseCard = document.querySelector('.datascience-card') || 
                        document.querySelector('.course-card[data-course="datascience"]') ||
                        Array.from(document.querySelectorAll('.course-card')).find(card => 
                            card.querySelector('.course-title') && 
                            card.querySelector('.course-title').textContent.includes('Data Science')
                        );
        } else {
            courseCard = document.querySelector(`.${courseClass}`);
        }
        
        if (courseCard) {
            courseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a highlight effect
            courseCard.style.transition = 'all 0.3s ease';
            courseCard.style.transform = 'scale(1.02)';
            courseCard.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            
            setTimeout(() => {
                courseCard.style.transform = 'scale(1)';
                courseCard.style.boxShadow = '';
            }, 1000);
        }
    }, 500); // Wait for initial scroll to complete
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

// ═══════════════════════════════════════════════════════════════
// STORY THEME SYSTEM - Interactive Industry Scenarios
// ═══════════════════════════════════════════════════════════════

const storyThemes = {
    walmart: {
        name: "Retail Giant",
        icon: "🛒",
        badge: "RETAIL",
        title: "Meet DataBot 🤖 - Your Retail Data Guide!",
        subtitle: "Follow DataBot as he transforms messy store data into sales insights using our 9 essential tools!",
        speech: "Welcome to the world of Retail! Let me show you how we turn messy store data into golden sales insights!",
        steps: {
            step1: {
                title: "PostgreSQL - The Busy Store Register",
                desc: "Imagine thousands of cash registers across 5,000 stores! 🏪 Every beep, every scan, every 'Have a nice day!' creates data. But it's all scattered - frozen pizza in one table, customer info in another, inventory somewhere else. Like finding a specific sock in a warehouse of socks!",
                example: "Customer Sarah bought diapers, beer, and chips at Store #4521 at 8:47 PM. But this data is split across 12 different tables! 😱"
            },
            step2: {
                title: "DBeaver - The X-Ray Vision Glasses",
                desc: "DBeaver is like putting on magical X-ray glasses! 👓 You can SEE inside any database. 'Oh look, there's the customers table! And there's the products! Let me write a query to peek at Sarah's shopping cart!'",
                example: "Connected to 15 different stores! I can see 2.3 million transactions from last week. Let me show you which products are selling like hotcakes! 🥞"
            },
            step3: {
                title: "Python - The Smart Shopping Assistant",
                desc: "Python is that super-smart employee who memorizes EVERYTHING! 🧠 It reads millions of receipts, spots patterns humans would miss, and says 'Aha! People who buy diapers also buy beer! And it happens more on Friday evenings!'",
                example: "Analyzed 50 million transactions! Found that putting bananas near cereal increases banana sales by 23%! 🍌"
            },
            step4: {
                title: "AWS DMS - The Data Moving Truck",
                desc: "DMS is like having a magical moving truck! 🚚 It takes data from your old store system and moves it to the fancy new cloud warehouse - WITHOUT closing the store! Zero downtime, zero data loss!",
                example: "Moving 500GB of sales data from Store Server to AWS... Customers still shopping... Done! Not a single receipt lost! 🎉"
            },
            step5: {
                title: "Terraform - The Store Builder Robot",
                desc: "Need a new data center? Terraform builds it in 10 minutes! 🏗️ Like LEGO for the cloud - 'I need 1 data warehouse, 5 servers, 3 storage buckets, and connect them all together!' Click. Done. No calling IT for 6 months!",
                example: "Creating analytics infrastructure for Black Friday... Scaling to handle 10x normal traffic... Ready to process 1 million transactions per hour! 💪"
            },
            step6: {
                title: "Redshift - The Super Organized Warehouse",
                desc: "Redshift is like having a warehouse where EVERYTHING is perfectly organized! 📦 5 billion rows of data, but finding 'all customers who bought organic milk on Tuesdays' takes 2 seconds! It's the Marie Kondo of data storage!",
                example: "'Which stores sold out of toilet paper last March?' Searching 10 years of data... Found 847 stores in 0.8 seconds! 🚀"
            }
        },
        result: {
            title: "The Retail Magic! ✨",
            desc: "From 5,000 chaotic stores to one beautiful command center! Store managers now see real-time sales, inventory alerts, and customer trends. All 9 tools working together like a symphony! 🎵",
            before: "How did we do on Black Friday?",
            beforeResult: "*2 weeks of number crunching* 😵",
            after: "How did we do?",
            afterResult: "*Real-time dashboard* → '$2.3B in sales, up 15%!' 🎉"
        }
    },
    cinema: {
        name: "Movie Theatre",
        icon: "🎬",
        badge: "CINEMA",
        title: "Meet DataBot 🤖 - Your Box Office Analyst!",
        subtitle: "Watch DataBot turn ticket stubs into blockbuster predictions using our 9 data tools!",
        speech: "Lights, Camera, DATA! Let me show you how we predict the next blockbuster hit!",
        steps: {
            step1: {
                title: "PostgreSQL - The Ticket Counter Chaos",
                desc: "Picture 500 movie theatres with popcorn-sticky keyboards! 🎟️ Every ticket sale, every large popcorn upgrade, every 'extra butter please!' gets logged. But data is everywhere - ticket sales here, concessions there, movie schedules in another system!",
                example: "John bought 2 tickets for 'Avatar 5' at 7:30 PM, large popcorn combo, and snuck in his own candy (we know, John!) 🍿"
            },
            step2: {
                title: "DBeaver - The Film Critic's Notebook",
                desc: "DBeaver lets you explore movie data like a detective! 🔍 'Show me all Friday 7 PM screenings... Now show me which snacks sold the most during Marvel movies!' It's like having a crystal ball for cinema!",
                example: "Discovered that 'horror movie + nachos' is the most popular combo! And romantic comedies sell 40% more chocolate! 🍫"
            },
            step3: {
                title: "Python - The Prediction Machine",
                desc: "Python analyzes years of movie data and predicts hits! 🎯 'Based on director, cast, genre, and release date... this movie will make $150M opening weekend!' It's like having a time-traveling film critic!",
                example: "Predicted 'Superhero Movie X' would flop based on runtime + similar films. Saved $2M in marketing! 💰"
            },
            step4: {
                title: "AWS DMS - The Reel-to-Digital Converter",
                desc: "DMS migrates all historical ticket data to the cloud! 📼 Like converting all those old film reels to digital - but for data! 10 years of box office history, now searchable in seconds!",
                example: "Migrated 15 years of ticket sales while theatres stayed open. That's 500 million tickets worth of data! 🎬"
            },
            step5: {
                title: "Terraform - The Cinema Infrastructure Builder",
                desc: "Need new servers for streaming analytics? Terraform builds the entire infrastructure in minutes! 🏗️ 'I need 3 data warehouses, 10 compute instances, and auto-scaling for opening weekend!' Click. Done. No IT tickets!",
                example: "Building infrastructure for 'Avengers 10' opening weekend... Scaling for 10 million ticket sales... Ready in 8 minutes! 🎬"
            },
            step6: {
                title: "Redshift - The Box Office Archive",
                desc: "Redshift stores decades of movie data perfectly organized! 📦 20 years of ticket sales, but finding 'all horror movies that sold out on Friday nights' takes 1 second! It's the ultimate film database!",
                example: "'Which movies had the best popcorn sales?' Searching 15 years of data... Found top 10 in 0.5 seconds! Horror movies + nachos = gold! 🍿"
            }
        },
        result: {
            title: "The Box Office Magic! ✨",
            desc: "From scattered ticket stubs to predicting the next billion-dollar franchise! Theatre managers now know exactly which movies to book, when, and how much popcorn to order! 🍿",
            before: "Should we book this indie film?",
            beforeResult: "*Gut feeling and crossed fingers* 🤞",
            after: "Should we book this indie film?",
            afterResult: "*AI prediction* → 'Yes! 87% fill rate predicted for date-night slots!' 💑"
        }
    },
    airline: {
        name: "Airlines",
        icon: "✈️",
        badge: "AVIATION",
        title: "Meet DataBot 🤖 - Your Flight Operations Expert!",
        subtitle: "Soar with DataBot as he optimizes flight routes and passenger experiences!",
        speech: "Welcome aboard Flight DATA-101! Let me show you how we keep millions of passengers happy!",
        steps: {
            step1: {
                title: "PostgreSQL - The Busy Airport Terminal",
                desc: "Imagine managing 1,000 flights daily! ✈️ Passengers checking in, bags being loaded, pilots filing reports, fuel being pumped. Data flying everywhere faster than the planes! Gate assignments here, passenger manifests there!",
                example: "Flight 747 to Paris: 234 passengers, 847 bags, 3 vegetarian meals, 1 emotional support peacock. All in different systems! 🦚"
            },
            step2: {
                title: "DBeaver - The Control Tower View",
                desc: "DBeaver gives you the control tower perspective! 📡 See every flight, every delay, every connection at risk. 'Show me all passengers connecting through Chicago with less than 30 minutes!' Crisis averted!",
                example: "Found 47 passengers who'll miss connections due to weather delay. Automatically rebooked before they even knew! 🌧️"
            },
            step3: {
                title: "Python - The Route Optimizer",
                desc: "Python calculates the most efficient flight paths! 🗺️ Fuel prices, weather patterns, air traffic - it processes everything to find the perfect route. Saves millions in fuel costs!",
                example: "Optimized Pacific routes based on jet streams. Saved 15 minutes per flight = $50M in fuel annually! ⛽"
            },
            step4: {
                title: "AWS DMS - The Airline Merger Expert",
                desc: "When two airlines merge, DMS combines their systems! 🤝 Millions of loyalty members, fleet data, crew schedules - all unified without a single flight cancellation!",
                example: "Merged two airlines' databases overnight. 50 million frequent flyer accounts combined flawlessly! ✨"
            },
            step5: {
                title: "Terraform - The Airport Infrastructure Manager",
                desc: "Need cloud infrastructure for flight operations? Terraform builds it instantly! 🏗️ 'I need 5 data warehouses, 20 servers for real-time tracking, and auto-scaling for holiday rush!' Click. Done. No delays!",
                example: "Building infrastructure for holiday season... Scaling to handle 2 million passengers/day... Ready in 12 minutes! ✈️"
            },
            step6: {
                title: "Redshift - The Flight Data Warehouse",
                desc: "Redshift stores billions of flight records perfectly organized! 📦 30 years of flight data, but finding 'all delayed flights due to weather in December' takes 2 seconds! It's the control tower's best friend!",
                example: "'Which routes have the most delays?' Searching 10 years of data... Found top 50 routes in 1.2 seconds! Chicago O'Hare + winter = delays! ❄️"
            }
        },
        result: {
            title: "The Aviation Magic! ✨",
            desc: "From flight delays to on-time arrivals! Operations center now predicts delays 6 hours ahead, automatically rebooks passengers, and optimizes crew schedules. Passengers actually arrive happy! 😊",
            before: "Why is my flight delayed?",
            beforeResult: "*Shrug* 'Weather somewhere maybe?' ☁️",
            after: "Will my flight be delayed?",
            afterResult: "*Proactive alert* → 'Yes, but we've already rebooked you!' 🎉"
        }
    },
    oilrig: {
        name: "Oil & Gas",
        icon: "🛢️",
        badge: "ENERGY",
        title: "Meet DataBot 🤖 - Your Energy Sector Analyst!",
        subtitle: "Drill into data with DataBot as he monitors oil rigs and optimizes production!",
        speech: "Welcome to the oil fields! Let me show you how we turn sensor data into energy efficiency!",
        steps: {
            step1: {
                title: "PostgreSQL - The Sensor Ocean",
                desc: "Picture an oil rig with 10,000 sensors! 🌡️ Temperature, pressure, flow rates, vibrations - data streaming every millisecond! One rig generates more data than a small country! It's a tsunami of numbers!",
                example: "Sensor #4521 shows pressure at 4,521 PSI. Sensor #4522 shows temperature at 347°F. That's 864 million readings per day! 📊"
            },
            step2: {
                title: "DBeaver - The Engineer's Dashboard",
                desc: "DBeaver helps engineers query sensor data safely! 🔧 'Show me all pressure anomalies in the last hour.' Spot problems before they become disasters!",
                example: "Query revealed Pump #7 running 12% hotter than normal. Scheduled maintenance before failure. Saved $2M! 💵"
            },
            step3: {
                title: "Python - The Predictive Maintenance Brain",
                desc: "Python predicts equipment failures BEFORE they happen! 🔮 By analyzing vibration patterns, it says 'This pump will fail in 72 hours.' Replace it now, avoid $10M in lost production!",
                example: "Predicted turbine bearing failure 5 days early. Scheduled repair during planned downtime. Zero production loss! 🎯"
            },
            step4: {
                title: "AWS DMS - The Legacy System Bridge",
                desc: "Oil rigs run systems from the 1990s! 📟 DMS connects these ancient systems to modern cloud analytics. Like teaching your grandpa's computer to talk to Alexa!",
                example: "Connected 30-year-old SCADA system to AWS. Now engineers can monitor rigs from their phones! 📱"
            },
            step5: {
                title: "Terraform - The Rig Infrastructure Builder",
                desc: "Need cloud infrastructure for sensor analytics? Terraform builds it in minutes! 🏗️ 'I need 3 data warehouses, 15 servers for real-time monitoring, and auto-scaling for peak production!' Click. Done. No rig downtime!",
                example: "Building infrastructure for 50 oil rigs... Scaling to handle 1 billion sensor readings/day... Ready in 10 minutes! 🛢️"
            },
            step6: {
                title: "Redshift - The Sensor Data Archive",
                desc: "Redshift stores decades of sensor data perfectly organized! 📦 20 years of pressure, temperature, and flow data, but finding 'all anomalies in Pump #7 last month' takes 1 second! It's the engineer's crystal ball!",
                example: "'Which pumps had the most failures?' Searching 15 years of data... Found top 20 pumps in 0.8 seconds! Predictive maintenance scheduled! 🔧"
            }
        },
        result: {
            title: "The Energy Magic! ✨",
            desc: "From reactive repairs to predictive maintenance! Engineers now see problems coming weeks ahead. Production up 15%, accidents down 40%, and equipment lasts 30% longer! 🛢️",
            before: "Why did that pump explode?",
            beforeResult: "*Investigation* 'It was old, I guess?' 🤷",
            after: "Is anything about to fail?",
            afterResult: "*AI Alert* → 'Yes, replace Pump #7 bearing in 3 days!' 🔧"
        }
    },
    procurement: {
        name: "Procurement",
        icon: "📦",
        badge: "SUPPLY",
        title: "Meet DataBot 🤖 - Your Supply Chain Guru!",
        subtitle: "Watch DataBot optimize procurement and save millions in purchasing!",
        speech: "Welcome to the supply chain! Let me show you how we turn purchase orders into profit!",
        steps: {
            step1: {
                title: "PostgreSQL - The Vendor Jungle",
                desc: "Managing 5,000 vendors is like herding cats! 🐱 Purchase orders, invoices, delivery schedules, quality reports - all in different formats! Some vendors email Excel, others fax (yes, fax!), some use carrier pigeons!",
                example: "Order #78451: 10,000 widgets from Vendor A. But wait, Vendor B is 15% cheaper... and Vendor C has better quality! 😵"
            },
            step2: {
                title: "DBeaver - The Vendor Analyzer",
                desc: "DBeaver helps you compare vendors instantly! 📋 'Show me all vendors who delivered late last quarter.' Suddenly negotiations become much easier!",
                example: "Found that Vendor X has 98% on-time delivery vs Vendor Y's 67%. Switched and saved 3 weeks in delays! ⏰"
            },
            step3: {
                title: "Python - The Price Predictor",
                desc: "Python analyzes market trends and predicts prices! 📈 'Steel prices will rise 20% next month due to shipping constraints.' Buy now and save millions!",
                example: "Predicted copper shortage 2 months early. Pre-ordered at current prices. Saved $4.2M when prices spiked! 💰"
            },
            step4: {
                title: "AWS DMS - The ERP Unifier",
                desc: "Every acquisition means another ERP system! 🏢 DMS merges Oracle, SAP, and custom systems into one unified procurement platform. One vendor database to rule them all!",
                example: "Unified 7 different ERP systems after acquisitions. Found we had 3 contracts with same vendor at different prices! 🤯"
            },
            step5: {
                title: "Terraform - The Procurement Infrastructure Builder",
                desc: "Need cloud infrastructure for vendor analytics? Terraform builds it instantly! 🏗️ 'I need 2 data warehouses, 8 servers for price tracking, and auto-scaling for purchase order processing!' Click. Done. No procurement delays!",
                example: "Building infrastructure for global procurement... Scaling to handle 100,000 purchase orders/day... Ready in 7 minutes! 📦"
            },
            step6: {
                title: "Redshift - The Vendor Data Warehouse",
                desc: "Redshift stores years of vendor and purchase data perfectly organized! 📦 10 years of procurement data, but finding 'all vendors who delivered late in Q4' takes 1 second! It's the procurement team's best tool!",
                example: "'Which vendors have the best on-time delivery?' Searching 5 years of data... Found top 100 vendors in 0.6 seconds! Negotiations just got easier! 💰"
            }
        },
        result: {
            title: "The Procurement Magic! ✨",
            desc: "From chaotic purchasing to strategic sourcing! Procurement team now has vendor scorecards, price predictions, and automatic reordering. Costs down 18%, supplier quality up! 📦",
            before: "Why do we keep running out of parts?",
            beforeResult: "*Spreadsheet chaos* 'Reorder point was wrong?' 📊",
            after: "When should we reorder?",
            afterResult: "*Smart Alert* → 'Order now! Lead time increased + demand spike coming!' 🚀"
        }
    },
    hospital: {
        name: "Healthcare",
        icon: "🏥",
        badge: "HEALTH",
        title: "Meet DataBot 🤖 - Your Healthcare Analytics Partner!",
        subtitle: "Heal with DataBot as he improves patient outcomes through data!",
        speech: "Welcome to healthcare data! Let me show you how we save lives with analytics!",
        steps: {
            step1: {
                title: "PostgreSQL - The Medical Records Maze",
                desc: "Hospitals generate MASSIVE amounts of data! 🩺 Lab results, vital signs, prescriptions, imaging, doctor notes - scattered across dozens of systems! Finding a patient's complete history is like a treasure hunt!",
                example: "Patient John: Blood test in Lab System A, X-ray in Imaging System B, prescription in Pharmacy System C. Time to solve the puzzle! 🧩"
            },
            step2: {
                title: "DBeaver - The Medical Detective",
                desc: "DBeaver helps doctors query patient history safely! 🔍 'Show me all diabetic patients on Medication X who had adverse reactions.' Critical for research and patient safety!",
                example: "Found pattern: 5% of patients on Drug X + Drug Y have interactions. Updated protocols. Lives saved! 💊"
            },
            step3: {
                title: "Python - The Diagnostic Assistant",
                desc: "Python analyzes symptoms and suggests diagnoses! 🤖 Not to replace doctors, but to catch things humans might miss. 'Based on these 47 symptoms and test results, consider checking for...'",
                example: "Flagged rare condition that matches patient symptoms. Doctor confirmed. Early detection = full recovery! ❤️"
            },
            step4: {
                title: "AWS DMS - The HIPAA-Compliant Migrator",
                desc: "Moving healthcare data requires EXTREME security! 🔒 DMS migrates patient records while maintaining full compliance. Every bit encrypted, every access logged!",
                example: "Migrated 10 million patient records to cloud. Zero data breaches. Full HIPAA compliance. Auditors impressed! ✅"
            },
            step5: {
                title: "Terraform - The Hospital Infrastructure Builder",
                desc: "Need secure cloud infrastructure for medical data? Terraform builds it with HIPAA compliance! 🏗️ 'I need 4 encrypted data warehouses, 12 secure servers, and auto-scaling for patient records!' Click. Done. Fully compliant!",
                example: "Building HIPAA-compliant infrastructure... Scaling to handle 5 million patient records... Ready in 15 minutes! 🏥"
            },
            step6: {
                title: "Redshift - The Medical Records Warehouse",
                desc: "Redshift stores decades of patient data perfectly organized and secure! 📦 25 years of medical records, but finding 'all diabetic patients on Medication X' takes 2 seconds! It's HIPAA-compliant and lightning-fast!",
                example: "'Which patients had adverse reactions to Drug Y?' Searching 10 years of data... Found 847 cases in 1.1 seconds! Protocol updated! 💊"
            }
        },
        result: {
            title: "The Healthcare Magic! ✨",
            desc: "From fragmented records to unified patient care! Doctors now see complete patient history instantly, AI flags potential issues, and research happens 10x faster. Better care, saved lives! 🏥",
            before: "What medications is this patient on?",
            beforeResult: "*Calling 5 pharmacies* 'Let me check...' 📞",
            after: "What medications is this patient on?",
            afterResult: "*Instant view* → 'Complete medication history + interaction warnings!' 💊"
        }
    },
    automotive: {
        name: "Automotive",
        icon: "🚗",
        badge: "AUTO",
        title: "Meet DataBot 🤖 - Your Manufacturing Intelligence!",
        subtitle: "Rev up with DataBot as he optimizes car production lines!",
        speech: "Welcome to the factory floor! Let me show you how we build perfect cars with data!",
        steps: {
            step1: {
                title: "PostgreSQL - The Assembly Line Symphony",
                desc: "A car has 30,000 parts! 🔩 Each part has origin, quality checks, and installation time. Multiply by 1,000 cars per day. That's 30 MILLION data points daily! Tracking one defective bolt is like finding Waldo!",
                example: "Bolt #47829-C installed in Car #78451 at Station 23 by Robot Arm #7 at 14:23:47. Now imagine tracking ALL bolts! 🤯"
            },
            step2: {
                title: "DBeaver - The Quality Inspector",
                desc: "DBeaver helps find defect patterns! 🔍 'Show me all paint defects from the last week, grouped by shift and spray booth.' Suddenly the root cause becomes obvious!",
                example: "Discovered all orange-peel defects came from Booth #3 during humid weather. Fixed ventilation. Defects: ZERO! ✨"
            },
            step3: {
                title: "Python - The Production Optimizer",
                desc: "Python balances the entire production line! ⚖️ If one station is slow, it ripples through everything. Python simulates changes and finds the perfect flow!",
                example: "Optimized station sequence. Reduced bottleneck at door assembly. Production up 8%! That's 80 extra cars per day! 🚗"
            },
            step4: {
                title: "AWS DMS - The Plant Integrator",
                desc: "Car companies have factories worldwide! 🌍 DMS syncs data from Germany, Mexico, Japan, USA into one global view. Same quality standards everywhere!",
                example: "Unified quality data from 12 plants. Found best practices in Japan. Applied globally. Defect rate dropped 23%! 🎌"
            },
            step5: {
                title: "Terraform - The Factory Infrastructure Builder",
                desc: "Need cloud infrastructure for production analytics? Terraform builds it instantly! 🏗️ 'I need 6 data warehouses, 25 servers for quality tracking, and auto-scaling for production lines!' Click. Done. No factory downtime!",
                example: "Building infrastructure for 15 production lines... Scaling to handle 1 million parts/day... Ready in 9 minutes! 🚗"
            },
            step6: {
                title: "Redshift - The Manufacturing Data Warehouse",
                desc: "Redshift stores years of production data perfectly organized! 📦 10 years of quality data, but finding 'all paint defects from Station 7 last week' takes 1 second! It's the quality team's best friend!",
                example: "'Which stations have the most defects?' Searching 5 years of data... Found top 20 stations in 0.7 seconds! Root cause identified! 🔧"
            }
        },
        result: {
            title: "The Manufacturing Magic! ✨",
            desc: "From reactive quality control to predictive perfection! Factory managers now see defects forming before they happen, optimize production in real-time, and ensure every car is perfect! 🚗",
            before: "Why did we have recalls last quarter?",
            beforeResult: "*Root cause analysis for months* 🔍",
            after: "Will we have quality issues?",
            afterResult: "*Predictive Alert* → 'Station 7 showing anomaly. Inspect before next shift!' ⚠️"
        }
    },
    banking: {
        name: "Banking",
        icon: "🏦",
        badge: "FINANCE",
        title: "Meet DataBot 🤖 - Your Financial Data Guardian!",
        subtitle: "Watch DataBot secure billions in transactions and catch fraud in milliseconds!",
        speech: "Welcome to the world of Finance! Let me show you how we protect money and catch bad actors with data magic!",
        steps: {
            step1: {
                title: "PostgreSQL - The Vault of Transactions",
                desc: "Banks process MILLIONS of transactions every second! 💰 ATM withdrawals, wire transfers, card swipes, loan payments - all happening simultaneously across the globe. Each transaction has sender, receiver, amount, time, location, and risk score!",
                example: "Customer John swipes card in New York at 2:15 PM, then another swipe in London at 2:17 PM. That's 3,500 miles in 2 minutes! 🚨 FRAUD ALERT!"
            },
            step2: {
                title: "DBeaver - The Financial Detective",
                desc: "DBeaver lets risk analysts investigate suspicious patterns! 🔎 'Show me all transactions over $10,000 in the last hour, grouped by account age.' Suddenly, money laundering patterns become visible!",
                example: "Found 47 new accounts all receiving exactly $9,999 transfers (just under reporting limit). Classic structuring scheme exposed! 👮"
            },
            step3: {
                title: "Python - The Fraud Hunter",
                desc: "Python builds AI models that learn what 'normal' looks like! 🧠 It scores every transaction in real-time. Unusual spending? Different location? Weird timing? Python catches it before the transaction completes!",
                example: "ML model flagged card #4521 - spending pattern changed 847% from baseline. Turned out the card was cloned in a gas station skimmer! 🎯"
            },
            step4: {
                title: "AWS DMS - The Global Compliance Engine",
                desc: "Banks operate in 100+ countries with different regulations! 🌍 DMS syncs customer data across regions while maintaining GDPR, SOX, and PCI compliance. One source of truth for auditors!",
                example: "Merged customer data from 23 countries. Detected duplicate accounts used for round-tripping. Saved $12M in potential fines! 📋"
            },
            step5: {
                title: "Terraform - The Banking Infrastructure Builder",
                desc: "Need secure cloud infrastructure for financial data? Terraform builds it with full compliance! 🏗️ 'I need 8 encrypted data warehouses, 30 secure servers, and auto-scaling for transaction processing!' Click. Done. PCI-DSS compliant!",
                example: "Building PCI-compliant infrastructure... Scaling to handle 10 million transactions/day... Ready in 20 minutes! 🏦"
            },
            step6: {
                title: "Redshift - The Financial Data Warehouse",
                desc: "Redshift stores decades of transaction data perfectly organized and secure! 📦 20 years of banking data, but finding 'all transactions over $10K in the last hour' takes 1 second! It's the fraud team's superpower!",
                example: "'Which accounts show suspicious patterns?' Searching 5 years of data... Found 47 flagged accounts in 0.9 seconds! Fraud prevented! 🚨"
            }
        },
        result: {
            title: "The Financial Fortress! 🏰",
            desc: "From reactive fraud detection to real-time protection! Banks now stop fraudsters mid-transaction, prevent money laundering, and keep customer money safe - all while processing billions in legitimate transactions! 💎",
            before: "Why did we lose $2M to fraud last month?",
            beforeResult: "*Reviewing paper reports* → 'Investigating...' 📄",
            after: "Is this transaction safe?",
            afterResult: "*Real-time AI* → 'BLOCKED! Card cloned. Customer notified. New card shipped!' ⚡"
        }
    },
    ecommerce: {
        name: "E-Commerce",
        icon: "🛍️",
        badge: "SHOP",
        title: "Meet DataBot 🤖 - Your E-Commerce Growth Engine!",
        subtitle: "Watch DataBot turn clicks into customers and abandoned carts into sales!",
        speech: "Welcome to Online Shopping paradise! Let me show you how we turn browsers into buyers with data wizardry!",
        steps: {
            step1: {
                title: "PostgreSQL - The Digital Shopping Mall",
                desc: "Every click, scroll, hover, and purchase creates data! 🖱️ A busy e-commerce site tracks 50 MILLION events per day. Product views, wishlist adds, cart abandonment, search queries - it's like watching millions of shoppers through security cameras!",
                example: "User #78234 viewed blue sneakers 7 times, added to cart twice, removed once, checked competitor prices, came back with a coupon code. Buy or bounce? 🤔"
            },
            step2: {
                title: "DBeaver - The Customer Journey Mapper",
                desc: "DBeaver reveals the shopping journey! 🗺️ 'Show me all users who viewed Product X but bought Product Y instead.' Discover why customers choose competitors and fix it!",
                example: "Found 2,341 users abandoned cart at shipping page. Shipping cost $12.99. Competitor offers free shipping. Solution: Free shipping over $50! 📦"
            },
            step3: {
                title: "Python - The Recommendation Wizard",
                desc: "Python builds the 'Customers also bought' magic! 🪄 Collaborative filtering, content-based recommendations, and real-time personalization. Every user sees a store built just for them!",
                example: "'Based on your browsing: Here are 5 items you'll LOVE!' Click-through rate jumped 340%. Average order value up $23! 🎯"
            },
            step4: {
                title: "AWS DMS - The Inventory Synchronizer",
                desc: "Products listed on Amazon, eBay, Shopify, and your own website! 📱 DMS keeps inventory synced in real-time. Sold on Amazon? Instantly updated everywhere. No overselling nightmares!",
                example: "Last 50 units of viral TikTok product! Sold across 4 platforms in 3 minutes. Zero oversells. Happy customers everywhere! 🎉"
            },
            step5: {
                title: "Terraform - The E-Commerce Infrastructure Builder",
                desc: "Need cloud infrastructure for online shopping? Terraform builds it instantly! 🏗️ 'I need 5 data warehouses, 20 servers for real-time inventory, and auto-scaling for Black Friday!' Click. Done. No website crashes!",
                example: "Building infrastructure for holiday shopping... Scaling to handle 50 million page views/day... Ready in 11 minutes! 🛍️"
            },
            step6: {
                title: "Redshift - The Shopping Data Warehouse",
                desc: "Redshift stores years of e-commerce data perfectly organized! 📦 5 years of customer behavior, but finding 'all users who abandoned cart at checkout' takes 1 second! It's the marketing team's goldmine!",
                example: "'Which products have the highest conversion rate?' Searching 3 years of data... Found top 100 products in 0.8 seconds! Marketing campaigns optimized! 📈"
            }
        },
        result: {
            title: "The Conversion Kingdom! 👑",
            desc: "From guessing what customers want to knowing before they do! E-commerce teams now rescue abandoned carts, personalize every experience, and turn one-time buyers into loyal fans! 🛒",
            before: "Why is our conversion rate only 2%?",
            beforeResult: "*Looking at basic analytics* → 'Maybe better photos?' 📸",
            after: "How do we increase sales?",
            afterResult: "*AI Insight* → 'User #78234 hesitating! Send 10% off push notification NOW!' → PURCHASED! 💰"
        }
    },
    datascience: {
        name: "Data Science",
        icon: "📊",
        badge: "AI",
        title: "Meet DataBot 🤖 - Your Data Science Mentor!",
        subtitle: "Learn with DataBot as he transforms raw data into powerful predictions and insights!",
        speech: "Welcome to the world of Data Science! Let me show you how we turn numbers into superpowers!",
        steps: {
            step1: {
                title: "PostgreSQL - The Data Treasure Chest",
                desc: "Data Science starts with data! 📦 Customer behavior, sales trends, sensor readings, social media posts - millions of records waiting to tell a story! But raw data is messy, incomplete, and scattered. Like a library with books in random languages!",
                example: "10 million customer transactions, 500,000 product reviews, 2 million website clicks. All separate, all waiting to reveal hidden patterns! 🔍"
            },
            step2: {
                title: "Python - The Pattern Detective",
                desc: "Python is the superpower of Data Science! 🐍 It reads millions of rows, finds correlations humans miss, and says 'Aha! Customers who buy Product A on Tuesdays also buy Product B on Fridays!' It's like having a detective who never sleeps!",
                example: "Analyzed 5 years of sales data! Discovered that ice cream sales spike 340% when temperature exceeds 85°F. Stocked up before heatwave. Profit up 50%! 🍦"
            },
            step3: {
                title: "Statistics - The Truth Finder",
                desc: "Statistics separates signal from noise! 📈 Is this pattern real or just random luck? Mean, median, standard deviation, correlation - these tools tell you what's actually happening vs what you think is happening!",
                example: "Found correlation: Study hours vs Test scores = 0.85! Strong relationship! But wait... correlation doesn't mean causation. Maybe smart students just study more? 🤔"
            },
            step4: {
                title: "Machine Learning - The Prediction Engine",
                desc: "Machine Learning learns from the past to predict the future! 🤖 Train it on historical data, and it learns patterns. Then ask: 'Will this customer churn?' 'What's the stock price tomorrow?' 'Which movie will they like?' It gets smarter with more data!",
                example: "Trained ML model on 10 million movie ratings. Now predicts what you'll watch with 94% accuracy! Netflix-level recommendations! 🎬"
            },
            step5: {
                title: "Terraform - The Data Science Infrastructure Builder",
                desc: "Need cloud infrastructure for ML models? Terraform builds it instantly! 🏗️ 'I need 4 data warehouses, 15 GPU servers for training, and auto-scaling for predictions!' Click. Done. No waiting for IT!",
                example: "Building ML infrastructure... Scaling to handle 1 million predictions/hour... Ready in 13 minutes! 📊"
            },
            step6: {
                title: "Redshift - The Data Science Warehouse",
                desc: "Redshift stores massive datasets perfectly organized for analysis! 📦 10 years of data, but finding 'all customers who bought Product A and B together' takes 2 seconds! It's the data scientist's playground!",
                example: "'What's the correlation between study hours and test scores?' Searching 5 years of data... Found 0.85 correlation in 1.0 seconds! Strong relationship confirmed! 📈"
            }
        },
        result: {
            title: "The Data Science Revolution! 🚀",
            desc: "From guessing to knowing! Data scientists now predict customer behavior, optimize business decisions, and solve problems before they happen. Turn data into dollars, insights into impact! 💡",
            before: "Will customers like this new product?",
            beforeResult: "*Market research for months* → 'Maybe? 60% think so?' 🤷",
            after: "Will customers like this new product?",
            afterResult: "*ML Prediction* → '87% will love it! Target: Millennials, urban areas, launch in Q2!' 🎯"
        }
    }
};

// Current story theme
let currentStoryTheme = 'walmart';

// Select story theme
function selectStoryTheme(themeName) {
    if (!storyThemes[themeName]) return;
    
    currentStoryTheme = themeName;
    const theme = storyThemes[themeName];
    
    // Update theme card active state
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.theme === themeName) {
            card.classList.add('active');
        }
    });
    
    // Update DataBot appearance
    const databotHat = document.getElementById('databot-hat');
    const databotBadge = document.getElementById('databot-badge');
    if (databotHat) databotHat.textContent = theme.icon;
    if (databotBadge) databotBadge.textContent = theme.badge;
    
    // Update title and subtitle
    const journeyTitle = document.getElementById('journey-title');
    const journeySubtitle = document.getElementById('journey-subtitle');
    if (journeyTitle) journeyTitle.textContent = theme.title;
    if (journeySubtitle) journeySubtitle.textContent = theme.subtitle;
    
    // Update DataBot speech
    updateDatabotSpeech(theme.speech);
    
    // Update journey steps (all 6 steps)
    const steps = theme.steps;
    const stepLabels = {
        1: 'Real Scenario:',
        2: themeName === 'datascience' ? 'Python discovers:' : 'DBeaver reveals:',
        3: themeName === 'datascience' ? 'Statistics finds:' : 'Python discovers:',
        4: themeName === 'datascience' ? 'ML predicts:' : 'DMS in action:',
        5: 'Terraform builds:',
        6: 'Redshift answers:'
    };
    
    // Update all steps dynamically
    Object.keys(steps).forEach((key, index) => {
        const stepNum = index + 1;
        const titleEl = document.getElementById(`step${stepNum}-title`);
        const descEl = document.getElementById(`step${stepNum}-desc`);
        const exampleEl = document.getElementById(`step${stepNum}-example`);
        
        if (titleEl && steps[key]) titleEl.textContent = steps[key].title;
        if (descEl && steps[key]) descEl.textContent = steps[key].desc;
        if (exampleEl && steps[key]) {
            const label = stepLabels[stepNum] || 'Example:';
            exampleEl.innerHTML = `<strong>${label}</strong> "${steps[key].example}"`;
        }
    });
    
    // Update result card
    const result = theme.result;
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');
    const finalExample = document.getElementById('final-example');
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultDesc) resultDesc.textContent = result.desc;
    if (finalExample) {
        finalExample.innerHTML = `
            <strong>Before:</strong> "${result.before}" → ${result.beforeResult}<br>
            <strong>After:</strong> "${result.after}" → ${result.afterResult}
        `;
    }
    
    // Scroll to journey section
    const journeySection = document.getElementById('data-journey');
    if (journeySection) {
        journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    console.log(`Story theme changed to: ${themeName}`);
}

// Export functions for global access
window.enterCourse = enterCourse;
window.scrollToCourses = scrollToCourses;
window.scrollToCourseCard = scrollToCourseCard;
window.toggleMobileMenu = toggleMobileMenu;
window.openDemo = openDemo;
window.toggleThemeSelector = toggleThemeSelector;
window.setTheme = setTheme;
window.scrollToTop = scrollToTop;
window.selectStoryTheme = selectStoryTheme;
