// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    const loading = document.createElement('div');
    loading.className = 'loading';
    document.body.appendChild(loading);

    // Remove loading screen after content loads
    window.addEventListener('load', () => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.remove();
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 500);
    });

    // Initialize cyberpunk effects
    initializeCyberpunkEffects();
    
    // Validate skyline visibility and add fallback if needed
    validateSkylineVisibility();
    
    // Handle window resize to adjust effects for different screen sizes
    let resizeTimer;
    window.addEventListener('resize', () => {
        // Debounce resize event
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Only recreate effects if width changes significantly (orientation change)
            const cyberRain = document.getElementById('cyberRain');
            const buildingLights = document.querySelector('.building-lights');
            
            if (cyberRain) {
                cyberRain.innerHTML = '';
                createCyberpunkRain();
            }
            
            if (buildingLights) {
                buildingLights.innerHTML = '';
                createBuildingWindows();
            }
        }, 500);
    });
    
    // Ensure loading screen is removed if load event doesn't fire
    setTimeout(() => {
        if (document.querySelector('.loading')) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }, 3000); // Fallback after 3 seconds

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set dark theme as default
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    });

    // Enhanced smooth scrolling with offset for fixed header
    initSmoothScrolling();

    // Mobile Menu Handling
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Prevent scrolling when mobile menu is open
    function toggleScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => {
        toggleScroll(navLinks.classList.contains('active'));
    });

    // Touch event handling for mobile
    document.addEventListener('touchstart', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            toggleScroll(false);
        }
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    const formStatus = document.querySelector('.form-status');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error message
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                // Hide messages after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    errorMessage.style.display = 'none';
                }, 5000);
            }
        });
    }

    // Initialize image viewer for project screenshots
    initializeImageViewer();

    // Cyberpunk Effects Functions
    function initializeCyberpunkEffects() {
        createCyberpunkRain();
        createDataTransmissionLines();
        createBuildingWindows();
        initCyberpunkScrollAnimations();
        createCyberpunkSkyline();
        initSkylineParallax();
        initRainToggle();
        initConsoleLog();
        addTypingEffect();
        initKonamiCode();
        ensureContentVisibility();
        debounceAnimations();
    }

    // Create data transmission lines effect
    function createDataTransmissionLines() {
        const dataLinesContainer = document.getElementById('dataLines');
        if (!dataLinesContainer) return;
        
        // Create data lines
        const lineCount = 12; // Number of data lines
        
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'data-line';
            
            // Randomize position and animation
            const topPos = Math.floor(Math.random() * 100);
            const delay = Math.random() * 10; // Random delay up to 10s
            const duration = Math.random() * 4 + 4; // 4-8s duration
            
            line.style.top = `${topPos}%`;
            line.style.animationDelay = `${delay}s`;
            line.style.animationDuration = `${duration}s`;
            
            dataLinesContainer.appendChild(line);
        }
    }

    // Create rain effect
    function createCyberpunkRain() {
        const rainContainer = document.getElementById('cyberRain');
        if (!rainContainer) return;

        // Create rain drops - with responsive density based on screen width
        const isMobile = window.innerWidth <= 768;
        const rainCount = isMobile ? 
            Math.floor(window.innerWidth / 40) : // Fewer drops on mobile
            Math.floor(window.innerWidth / 15);  // More drops on desktop
        
        for (let i = 0; i < rainCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Random positioning
            const leftPos = Math.floor(Math.random() * window.innerWidth);
            const duration = Math.random() * 0.5 + 0.7; // 0.7-1.2s
            const delay = Math.random() * 2; // 0-2s delay for staggered start
            
            // Apply inline styles for randomness
            drop.style.left = `${leftPos}px`;
            drop.style.animationDuration = `${duration}s`;
            drop.style.animationDelay = `${delay}s`;
            
            rainContainer.appendChild(drop);
        }

        // Add splash effect when rain hits bottom
        document.addEventListener('animationend', (e) => {
            if (e.target.classList.contains('rain-drop') && 
                e.animationName === 'rainFall' && 
                Math.random() > 0.5) { // 50% chance of splash
                
                createRainSplash(e.target.getBoundingClientRect().left);
            }
        });
    }

    // Create rain ripple/splash effect
    function createRainSplash(xPosition) {
        const rainContainer = document.getElementById('cyberRain');
        if (!rainContainer) return;
        
        const splash = document.createElement('div');
        splash.className = 'rain-ripple';
        splash.style.left = `${xPosition}px`;
        splash.style.bottom = '0';
        
        rainContainer.appendChild(splash);
        
        // Remove splash after animation
        setTimeout(() => {
            splash.remove();
        }, 1000);
    }

    // Toggle rain effect
    function initRainToggle() {
        const rainToggle = document.getElementById('rainToggle');
        const rainContainer = document.getElementById('cyberRain');
        
        if (!rainToggle || !rainContainer) return;
        
        // Check for saved preference
        const rainEnabled = localStorage.getItem('rainEnabled') !== 'false';
        
        // Set initial state
        rainContainer.style.display = rainEnabled ? 'block' : 'none';
        rainToggle.innerHTML = rainEnabled ? 
            '<i class="fas fa-tint-slash"></i>' : 
            '<i class="fas fa-tint"></i>';
        
        rainToggle.addEventListener('click', () => {
            const isVisible = rainContainer.style.display !== 'none';
            
            // Toggle rain visibility
            rainContainer.style.display = isVisible ? 'none' : 'block';
            
            // Update toggle icon
            rainToggle.innerHTML = isVisible ? 
                '<i class="fas fa-tint"></i>' : 
                '<i class="fas fa-tint-slash"></i>';
            
            // Save preference
            localStorage.setItem('rainEnabled', !isVisible);
        });
    }

    // Initialize parallax scrolling effect
    function initSkylineParallax() {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        if (parallaxLayers.length === 0) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Apply different parallax speeds to different layers
            parallaxLayers.forEach(layer => {
                if (layer.classList.contains('parallax-layer-1')) {
                    layer.style.transform = `translateY(${scrolled * 0.1}px)`;
                } else if (layer.classList.contains('parallax-layer-2')) {
                    layer.style.transform = `translateY(${scrolled * 0.2}px)`;
                } else if (layer.classList.contains('parallax-layer-3')) {
                    layer.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            });
        });
    }

    // Enhanced scroll animations with glitch effect
    function initCyberpunkScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add revealed class to staggered elements
                    if (entry.target.classList.contains('stagger-children')) {
                        entry.target.classList.add('revealed');
                    }
                    
                    // Add glitch effect for glitch-reveal elements
                    if (entry.target.classList.contains('glitch-reveal')) {
                        entry.target.classList.add('revealed');
                        
                        // Remove and re-add class to restart animation on view
                        setTimeout(() => {
                            entry.target.classList.remove('revealed');
                            setTimeout(() => {
                                entry.target.classList.add('revealed');
                            }, 50);
                        }, 1000);
                    }
                    
                    // Add animate class to other elements
                    entry.target.classList.add('animate');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all staggered elements and sections
        document.querySelectorAll('.stagger-children, .glitch-reveal, section').forEach(element => {
            observer.observe(element);
        });
        
        // Add animate-child class to elements that need it
        document.querySelectorAll('section').forEach(section => {
            section.querySelectorAll('.stat, .project-card, .contact-item').forEach(child => {
                child.classList.add('animate-child');
            });
        });
    }

    // Create cyberpunk skyline
    function createCyberpunkSkyline() {
        const skyline = document.querySelector('.cyberpunk-skyline');
        if (!skyline) return;

        // Create building lights
        const buildingLights = document.querySelector('.building-lights');
        if (buildingLights) {
            // Adjust light count based on device
            const isMobile = window.innerWidth <= 768;
            const lightCount = isMobile ? 40 : 100; // Fewer lights on mobile
            
            for (let i = 0; i < lightCount; i++) {
                const light = document.createElement('div');
                light.className = 'building-light';
                
                // Random positioning
                const leftPos = Math.floor(Math.random() * 100);
                const bottomPos = Math.floor(Math.random() * 60);
                const size = Math.random() * 2 + 1; // 1-3px
                const delay = Math.random() * 5; // 0-5s delay for flicker
                
                light.style.left = `${leftPos}%`;
                light.style.bottom = `${bottomPos}%`;
                light.style.width = `${size}px`;
                light.style.height = `${size}px`;
                light.style.animationDelay = `${delay}s`;
                
                buildingLights.appendChild(light);
            }
        }
    }

    // Enhanced console log animation in footer
    function initConsoleLog() {
        const consoleElement = document.getElementById('consoleText');
        if (!consoleElement) return;
        
        const messages = [
            "Initializing system... Establishing neural link... Welcome to Emad Ahmad's portfolio v2.5.0...",
            "Security protocols bypassed... Accessing developer data...",
            "Neural network optimization complete. AI functions at 100% capacity.",
            "Warning: Unauthorized access detected... Proceeding anyway...",
            "Running environment scan... Technology stack identified...",
            "Establishing encrypted connection to GitHub repositories...",
            "User credentials accepted. Welcome, potential employer.",
            "System alert: This developer exceeds standard performance metrics.",
            "WARNING: Critical skills detected - React, Python, Salesforce, AI...",
            "Hack the planet! Portfolio system infiltrated successfully.",
            "Firewall breach detected! Cybernetic countermeasures activated.",
            "Quantum encryption enabled. Securing communication channels.",
            "ALERT: Exceptional coding patterns identified in repository scans.",
            "Neural interface stable. Transferring portfolio data to viewer...",
            "System upgrade complete. User experience enhancement: 73% improvement.",
            "Data transmission successful. Project showcase initialized."
        ];
        
        let currentIndex = 0;
        
        // Update console text periodically
        setInterval(() => {
            currentIndex = (currentIndex + 1) % messages.length;
            fadeTextChange(consoleElement, messages[currentIndex]);
        }, 5000); // Change message every 5 seconds
        
        // Animated text change with fade effect
        function fadeTextChange(element, newText) {
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.textContent = newText;
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = 'typing 10s steps(100) infinite';
                element.style.opacity = '1';
            }, 500);
        }
        
        // Add random glitch effect
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of glitch
                const glitchDuration = Math.random() * 200 + 50; // 50-250ms
                consoleElement.style.textShadow = '2px 0 var(--neon-blue), -2px 0 var(--neon-pink)';
                consoleElement.style.opacity = '0.8';
                
                setTimeout(() => {
                    consoleElement.style.textShadow = '';
                    consoleElement.style.opacity = '1';
                }, glitchDuration);
            }
        }, 2000);
    }

    // Add typing effect to hero text
    function addTypingEffect() {
        const heroText = document.querySelector('.hero p');
        if (!heroText) return;
        
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Add blinking cursor after typing
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                cursor.textContent = '|';
                heroText.appendChild(cursor);
            }
        }
        
        typeWriter();
    }

    // Enhanced Image Viewer
    function initializeImageViewer() {
        const imageViewer = document.getElementById('imageViewer');
        const viewerImage = document.getElementById('viewerImage');
        const currentImageIndex = document.getElementById('currentImageIndex');
        const totalImages = document.getElementById('totalImages');
        
        if (!imageViewer || !viewerImage) return;
        
        let currentGallery = null;
        let currentIndex = 0;
        
        // Add click listeners to gallery images
        document.querySelectorAll('.gallery-image').forEach(image => {
            image.addEventListener('click', () => {
                const projectGallery = image.closest('.project-gallery');
                const projectName = projectGallery.dataset.project;
                const images = projectGallery.querySelectorAll('.gallery-image');
                
                currentGallery = {
                    project: projectName,
                    images: Array.from(images).map(img => img.src)
                };
                currentIndex = Array.from(images).indexOf(image);
                
                updateViewer();
                imageViewer.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Add click listeners to viewer controls
        imageViewer.addEventListener('click', e => {
            const action = e.target.dataset.action || e.target.parentElement.dataset.action;
            
            if (action === 'close') {
                closeImageViewer();
            } else if (action === 'prev') {
                navigateImages(-1);
            } else if (action === 'next') {
                navigateImages(1);
            }
        });
        
        function updateViewer() {
            if (!currentGallery) return;
            
            viewerImage.src = currentGallery.images[currentIndex];
            currentImageIndex.textContent = currentIndex + 1;
            totalImages.textContent = currentGallery.images.length;
            
            // Add glitch effect when changing images
            viewerImage.style.animation = 'none';
            viewerImage.offsetHeight; // Trigger reflow
            viewerImage.style.animation = 'image-glitch 0.5s';
        }
        
        function navigateImages(direction) {
            if (!currentGallery) return;
            
            currentIndex = (currentIndex + direction + currentGallery.images.length) % currentGallery.images.length;
            updateViewer();
        }
        
        function closeImageViewer() {
            imageViewer.classList.remove('active');
            document.body.style.overflow = '';
            currentGallery = null;
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', e => {
            if (!imageViewer.classList.contains('active')) return;
            
            if (e.key === 'ArrowLeft') {
                navigateImages(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImages(1);
            } else if (e.key === 'Escape') {
                closeImageViewer();
            }
        });
        
        // Add touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        imageViewer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        imageViewer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                navigateImages(-1);
            } else if (touchStartX - touchEndX > swipeThreshold) {
                navigateImages(1);
            }
        }
    }

    // Smooth scrolling
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Enhanced content visibility check
    function ensureContentVisibility() {
        // Add explicit z-index to all content containers
        const contentElements = [
            '.about-content',
            '.skills-grid',
            '.projects-grid', 
            '.timeline',
            '.contact-container',
            '.interests-grid'
        ];
        
        contentElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.position = 'relative';
                element.style.zIndex = '10';
            });
        });
        
        // Ensure all cards have proper z-index
        const cardElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .interest-card');
        cardElements.forEach(card => {
            card.style.position = 'relative';
            card.style.zIndex = '5';
        });
    }

    // Create building windows with random patterns
    function createBuildingWindows() {
        const buildingLights = document.querySelector('.building-lights');
        if (!buildingLights) return;
        
        // Adjust window count based on device
        const isMobile = window.innerWidth <= 768;
        const windowCount = isMobile ? 80 : 200; // Reduced count on mobile
        
        for (let i = 0; i < windowCount; i++) {
            const window = document.createElement('div');
            window.className = 'building-window';
            
            // Randomize positioning
            const leftPos = Math.floor(Math.random() * 100);
            const bottomPos = Math.floor(Math.random() * 60);
            const size = Math.random() * 2 + 1; // 1-3px
            const delay = Math.random() * 5; // 0-5s delay for flicker
            
            window.style.left = `${leftPos}%`;
            window.style.bottom = `${bottomPos}%`;
            window.style.width = `${size}px`;
            window.style.height = `${size}px`;
            window.style.animationDelay = `${delay}s`;
            
            buildingLights.appendChild(window);
        }
    }

    // Konami Code Easter Egg
    function initKonamiCode() {
        const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            // Check if the pressed key matches the expected key in the pattern
            if (e.key === konamiPattern[konamiIndex] || 
                (e.key.toLowerCase() === konamiPattern[konamiIndex].toLowerCase())) {
                konamiIndex++;
                
                // If the entire pattern is matched
                if (konamiIndex === konamiPattern.length) {
                    triggerMatrixRain();
                    konamiIndex = 0; // Reset for next time
                }
            } else {
                konamiIndex = 0; // Reset on mismatch
            }
        });
    }

    // Matrix Rain Effect
    function triggerMatrixRain() {
        const matrixRain = document.getElementById('matrixRain');
        if (!matrixRain) return;
        
        // Clear any existing drops
        matrixRain.innerHTML = '';
        
        // Create matrix drops
        const columns = Math.floor(window.innerWidth / 20); // One drop every ~20px
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&+,:;=?@#'.split('');
        
        for (let i = 0; i < columns; i++) {
            const drop = document.createElement('div');
            drop.className = 'matrix-drop';
            drop.style.left = `${i * 20 + Math.random() * 10}px`;
            drop.style.animationDuration = `${Math.random() * 2 + 2}s`; // 2-4s
            drop.style.animationDelay = `${Math.random() * 2}s`;
            
            // Create random characters
            const charCount = Math.floor(Math.random() * 10) + 5; // 5-15 chars
            let text = '';
            for (let j = 0; j < charCount; j++) {
                text += chars[Math.floor(Math.random() * chars.length)];
            }
            drop.textContent = text;
            
            matrixRain.appendChild(drop);
        }
        
        // Show matrix rain
        matrixRain.classList.add('active');
        
        // Hide matrix rain after 10 seconds
        setTimeout(() => {
            matrixRain.classList.remove('active');
        }, 10000);
    }

    // Optimize performance by debouncing animations on scroll
    function debounceAnimations() {
        let scrollTimeout;
        const skylineElements = document.querySelectorAll('.city-layer, .building-window');
        
        window.addEventListener('scroll', () => {
            // Reduce animation complexity during scroll
            skylineElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
            
            // Resume animations after scrolling stops
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                skylineElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }, 200);
        });
    }

    // Add skyline visibility validation
    function validateSkylineVisibility() {
        // Wait a bit to ensure all CSS has loaded and applied
        setTimeout(() => {
            const skyline = document.querySelector('.cyberpunk-skyline');
            if (!skyline) return;
            
            // Check if the skyline is properly visible
            const skylineComputed = window.getComputedStyle(skyline);
            const cityLayers = document.querySelectorAll('.city-layer');
            
            // Check if skyline has issues (invisible or not rendered)
            if (skylineComputed.opacity < 0.1 || cityLayers.length === 0 || cityLayers[0].offsetHeight < 10) {
                console.log("Skyline CSS failed — loading fallback");
                
                // Add a fallback skyline using SVG
                const fallbackSkyline = document.createElement('div');
                fallbackSkyline.className = 'fallback-skyline';
                fallbackSkyline.innerHTML = `
                    <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="rgba(0,10,30,0)" />
                                <stop offset="100%" stop-color="rgba(0,10,30,0.8)" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="8" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#skyGradient)" />
                        <!-- Buildings background layer -->
                        <g fill="#0a0a1a" filter="url(#glow)">
                            <rect x="0" y="280" width="50" height="120" />
                            <rect x="60" y="250" width="40" height="150" />
                            <rect x="110" y="290" width="70" height="110" />
                            <rect x="190" y="240" width="30" height="160" />
                            <rect x="230" y="260" width="80" height="140" />
                            <rect x="320" y="230" width="60" height="170" />
                            <rect x="390" y="280" width="40" height="120" />
                            <rect x="440" y="250" width="70" height="150" />
                            <rect x="520" y="220" width="50" height="180" />
                            <rect x="580" y="270" width="30" height="130" />
                            <rect x="620" y="240" width="60" height="160" />
                            <rect x="690" y="260" width="40" height="140" />
                            <rect x="740" y="230" width="50" height="170" />
                            <rect x="800" y="270" width="70" height="130" />
                            <rect x="880" y="240" width="40" height="160" />
                            <rect x="930" y="220" width="30" height="180" />
                            <rect x="970" y="280" width="60" height="120" />
                            <rect x="1040" y="250" width="50" height="150" />
                            <rect x="1100" y="230" width="70" height="170" />
                            <rect x="1180" y="260" width="40" height="140" />
                        </g>
                        <!-- Neon outlines -->
                        <g fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.7">
                            <rect x="0" y="280" width="50" height="120" />
                            <rect x="110" y="290" width="70" height="110" stroke="#ff00aa" />
                            <rect x="230" y="260" width="80" height="140" />
                            <rect x="390" y="280" width="40" height="120" stroke="#ff00aa" />
                            <rect x="520" y="220" width="50" height="180" />
                            <rect x="620" y="240" width="60" height="160" stroke="#8b5cf6" />
                            <rect x="800" y="270" width="70" height="130" />
                            <rect x="930" y="220" width="30" height="180" stroke="#ff00aa" />
                            <rect x="1100" y="230" width="70" height="170" />
                        </g>
                        <!-- Building windows -->
                        <g fill="#00d4ff" opacity="0.8">
                            <circle cx="25" cy="300" r="1" />
                            <circle cx="25" cy="320" r="1" />
                            <circle cx="25" cy="340" r="1" />
                            <circle cx="40" cy="310" r="1" />
                            <circle cx="40" cy="330" r="1" />
                            <circle cx="40" cy="350" r="1" />
                            
                            <circle cx="80" cy="270" r="1" fill="#ff00aa" />
                            <circle cx="80" cy="290" r="1" fill="#ff00aa" />
                            <circle cx="80" cy="310" r="1" fill="#ff00aa" />
                            <circle cx="80" cy="330" r="1" fill="#ff00aa" />
                            
                            <!-- More windows throughout buildings -->
                            <circle cx="140" cy="320" r="1" />
                            <circle cx="140" cy="340" r="1" />
                            <circle cx="160" cy="310" r="1" />
                            <circle cx="160" cy="330" r="1" />
                            <circle cx="160" cy="350" r="1" />
                            
                            <circle cx="250" cy="280" r="1" fill="#8b5cf6" />
                            <circle cx="250" cy="300" r="1" fill="#8b5cf6" />
                            <circle cx="250" cy="320" r="1" fill="#8b5cf6" />
                            <circle cx="270" cy="290" r="1" fill="#8b5cf6" />
                            <circle cx="270" cy="310" r="1" fill="#8b5cf6" />
                            <circle cx="270" cy="330" r="1" fill="#8b5cf6" />
                            
                            <circle cx="350" cy="250" r="1" />
                            <circle cx="350" cy="270" r="1" />
                            <circle cx="350" cy="290" r="1" />
                            <circle cx="350" cy="310" r="1" />
                            <circle cx="350" cy="330" r="1" />
                            <circle cx="350" cy="350" r="1" />
                            
                            <circle cx="410" cy="300" r="1" fill="#ff00aa" />
                            <circle cx="410" cy="320" r="1" fill="#ff00aa" />
                            <circle cx="410" cy="340" r="1" fill="#ff00aa" />
                            
                            <!-- Additional windows on the right side of skyline -->
                            <circle cx="550" cy="240" r="1" />
                            <circle cx="550" cy="260" r="1" />
                            <circle cx="550" cy="280" r="1" />
                            <circle cx="550" cy="300" r="1" />
                            <circle cx="550" cy="320" r="1" />
                            <circle cx="550" cy="340" r="1" />
                            
                            <circle cx="640" cy="260" r="1" fill="#8b5cf6" />
                            <circle cx="640" cy="280" r="1" fill="#8b5cf6" />
                            <circle cx="640" cy="300" r="1" fill="#8b5cf6" />
                            <circle cx="640" cy="320" r="1" fill="#8b5cf6" />
                            <circle cx="660" cy="250" r="1" fill="#8b5cf6" />
                            <circle cx="660" cy="270" r="1" fill="#8b5cf6" />
                            <circle cx="660" cy="290" r="1" fill="#8b5cf6" />
                            <circle cx="660" cy="310" r="1" fill="#8b5cf6" />
                            
                            <circle cx="760" cy="250" r="1" />
                            <circle cx="760" cy="270" r="1" />
                            <circle cx="760" cy="290" r="1" />
                            <circle cx="760" cy="310" r="1" />
                            <circle cx="780" cy="260" r="1" />
                            <circle cx="780" cy="280" r="1" />
                            <circle cx="780" cy="300" r="1" />
                            
                            <circle cx="830" cy="290" r="1" fill="#ff00aa" />
                            <circle cx="830" cy="310" r="1" fill="#ff00aa" />
                            <circle cx="830" cy="330" r="1" fill="#ff00aa" />
                            <circle cx="850" cy="280" r="1" fill="#ff00aa" />
                            <circle cx="850" cy="300" r="1" fill="#ff00aa" />
                            <circle cx="850" cy="320" r="1" fill="#ff00aa" />
                            
                            <circle cx="950" cy="240" r="1" />
                            <circle cx="950" cy="260" r="1" />
                            <circle cx="950" cy="280" r="1" />
                            <circle cx="950" cy="300" r="1" />
                            <circle cx="950" cy="320" r="1" />
                            <circle cx="950" cy="340" r="1" />
                            
                            <circle cx="1000" cy="300" r="1" fill="#8b5cf6" />
                            <circle cx="1000" cy="320" r="1" fill="#8b5cf6" />
                            <circle cx="1000" cy="340" r="1" fill="#8b5cf6" />
                            <circle cx="1020" cy="290" r="1" fill="#8b5cf6" />
                            <circle cx="1020" cy="310" r="1" fill="#8b5cf6" />
                            <circle cx="1020" cy="330" r="1" fill="#8b5cf6" />
                            
                            <circle cx="1130" cy="250" r="1" />
                            <circle cx="1130" cy="270" r="1" />
                            <circle cx="1130" cy="290" r="1" />
                            <circle cx="1130" cy="310" r="1" />
                            <circle cx="1130" cy="330" r="1" />
                            <circle cx="1150" cy="260" r="1" />
                            <circle cx="1150" cy="280" r="1" />
                            <circle cx="1150" cy="300" r="1" />
                            <circle cx="1150" cy="320" r="1" />
                        </g>
                    </svg>
                `;
                
                // Add custom CSS for the fallback
                const style = document.createElement('style');
                style.textContent = `
                    .fallback-skyline {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 1;
                        pointer-events: none;
                    }
                    
                    @keyframes window-flash {
                        0%, 100% { opacity: 0.8; }
                        50% { opacity: 0.3; }
                    }
                    
                    .fallback-skyline circle {
                        animation: window-flash 3s infinite;
                    }
                    
                    .fallback-skyline circle:nth-child(odd) {
                        animation-delay: 0.5s;
                    }
                    
                    .fallback-skyline circle:nth-child(3n) {
                        animation-delay: 1s;
                    }
                `;
                document.head.appendChild(style);
                
                // Replace the existing skyline
                skyline.innerHTML = '';
                skyline.appendChild(fallbackSkyline);
            }
        }, 1000); // Check after 1 second to give time for CSS to apply
    }

    // Project Gallery Navigation
    const galleries = document.querySelectorAll('.project-gallery');
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const currentIndex = document.getElementById('currentImageIndex');
    const totalImages = document.getElementById('totalImages');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const closeButton = document.querySelector('.close-viewer');

    let currentGallery = null;
    let currentImageIndex = 0;

    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-image');
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentGallery = gallery;
                currentImageIndex = index;
                updateViewer();
                viewer.style.display = 'flex';
            });
        });
    });

    function updateViewer() {
        const images = currentGallery.querySelectorAll('.gallery-image');
        viewerImage.src = images[currentImageIndex].src;
        currentIndex.textContent = currentImageIndex + 1;
        totalImages.textContent = images.length;
    }

    prevButton.addEventListener('click', () => {
        const images = currentGallery.querySelectorAll('.gallery-image');
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateViewer();
    });

    nextButton.addEventListener('click', () => {
        const images = currentGallery.querySelectorAll('.gallery-image');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateViewer();
    });

    closeButton.addEventListener('click', () => {
        viewer.style.display = 'none';
    });

    // Project Filtering
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectCards = document.querySelectorAll('.project-card');

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            projectCards.forEach(card => {
                const cardTags = card.dataset.tags.split(' ');
                if (filter === 'all' || cardTags.includes(filter)) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });

    // Theme Customization
    const themeCustomizer = document.createElement('div');
    themeCustomizer.className = 'theme-customizer';
    themeCustomizer.innerHTML = `
        <h4>Theme Colors</h4>
        <div class="color-picker">
            <div class="color-option" style="background: #00ffff" data-color="#00ffff"></div>
            <div class="color-option" style="background: #ff00ff" data-color="#ff00ff"></div>
            <div class="color-option" style="background: #00ff00" data-color="#00ff00"></div>
            <div class="color-option" style="background: #ffff00" data-color="#ffff00"></div>
        </div>
    `;
    document.body.appendChild(themeCustomizer);

    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.dataset.color;
            document.documentElement.style.setProperty('--neon-primary', color);
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // CRT Mode Toggle
    const crtMode = document.createElement('div');
    crtMode.className = 'crt-mode';
    document.body.appendChild(crtMode);

    const crtToggle = document.createElement('button');
    crtToggle.className = 'crt-toggle';
    crtToggle.innerHTML = '<i class="fas fa-tv"></i>';
    crtToggle.addEventListener('click', () => {
        crtMode.classList.toggle('active');
    });
    document.body.appendChild(crtToggle);

    // Progress Bars Animation
    const progressBars = document.querySelectorAll('.progress-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.progress + '%';
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));

    // Achievement System
    const achievements = {
        'first-visit': {
            title: 'First Visit',
            description: 'Welcome to the portfolio!',
            icon: 'fas fa-star'
        },
        'scroll-master': {
            title: 'Scroll Master',
            description: 'Scrolled through the entire portfolio',
            icon: 'fas fa-scroll'
        },
        'theme-explorer': {
            title: 'Theme Explorer',
            description: 'Tried all theme colors',
            icon: 'fas fa-palette'
        }
    };

    let unlockedAchievements = new Set();

    function showAchievement(id) {
        if (unlockedAchievements.has(id)) return;
        
        const achievement = achievements[id];
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `
            <div class="achievement-icon"><i class="${achievement.icon}"></i></div>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
        `;
        document.body.appendChild(badge);
        
        setTimeout(() => badge.classList.add('show'), 100);
        setTimeout(() => {
            badge.classList.remove('show');
            setTimeout(() => badge.remove(), 500);
        }, 3000);
        
        unlockedAchievements.add(id);
    }

    // Check for achievements
    showAchievement('first-visit');

    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        maxScroll = Math.max(maxScroll, window.scrollY);
        if (maxScroll > document.body.scrollHeight - window.innerHeight - 100) {
            showAchievement('scroll-master');
        }
    });

    let themeChanges = 0;
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeChanges++;
            if (themeChanges >= colorOptions.length) {
                showAchievement('theme-explorer');
            }
        });
    });

    // Remove Konami Code Matrix Effect
    const matrixRain = document.getElementById('matrixRain');
    if (matrixRain) {
        matrixRain.remove();
    }

    // Remove unwanted elements
    document.querySelectorAll('.achievement-badge, .crt-toggle, .theme-customizer').forEach(el => el.remove());

    // Initialize new cyberpunk features
    function initializeCyberpunkFeatures() {
        // Remove unwanted elements
        document.querySelectorAll('.achievement-badge, .crt-toggle, .theme-customizer').forEach(el => el.remove());

        // Add scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const sections = document.querySelectorAll('section');
                const currentSection = Array.from(sections).find(section => {
                    const rect = section.getBoundingClientRect();
                    return rect.top >= 0 && rect.top <= window.innerHeight;
                });
                
                if (currentSection) {
                    const index = Array.from(sections).indexOf(currentSection);
                    const nextIndex = e.key === 'ArrowUp' ? index - 1 : index + 1;
                    if (nextIndex >= 0 && nextIndex < sections.length) {
                        sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });

        // Add 3D tilt effect to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });

        // Add tech stack badge animations
        document.querySelectorAll('.tech-badge').forEach(badge => {
            badge.addEventListener('mouseover', () => {
                badge.style.transform = 'scale(1.2) rotate(360deg)';
            });
            
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1) rotate(0)';
            });
        });

        // Add mobile touch gestures
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - previous project
                navigateProject(-1);
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - next project
                navigateProject(1);
            }
        }

        function navigateProject(direction) {
            const projects = document.querySelectorAll('.project-card');
            const currentProject = Array.from(projects).find(project => {
                const rect = project.getBoundingClientRect();
                return rect.left >= 0 && rect.left <= window.innerWidth;
            });
            
            if (currentProject) {
                const index = Array.from(projects).indexOf(currentProject);
                const nextIndex = (index + direction + projects.length) % projects.length;
                projects[nextIndex].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // Initialize features when DOM is loaded
    initializeCyberpunkFeatures();
});