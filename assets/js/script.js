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

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
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

    // Observe all sections and their children
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
        section.querySelectorAll('.stat, .project-card, .contact-item').forEach(child => {
            child.classList.add('animate-child');
        });
    });

    // Enhanced typing effect with cursor
    const heroText = document.querySelector('.hero p');
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

    // Enhanced parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.003);
    });

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

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Enhanced project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.querySelector('.project-overlay').style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.querySelector('.project-overlay').style.opacity = '0';
        });
    });

    // Scroll Indicator Handling
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScrollTop = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Clear the previous timeout
        clearTimeout(scrollTimeout);
        
        // Hide scroll indicator when scrolling down
        if (scrollTop > 100) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
        
        // Show scroll indicator when scrolling up near the top
        if (scrollTop < lastScrollTop && scrollTop < 100) {
            scrollIndicator.classList.remove('hidden');
        }
        
        // Set a timeout to hide the indicator after scrolling stops
        scrollTimeout = setTimeout(() => {
            if (scrollTop > 50) {
                scrollIndicator.classList.add('hidden');
            }
        }, 1000);
        
        lastScrollTop = scrollTop;
    });

    // Enhanced Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const floatingElements = document.querySelectorAll('.floating-element');
        
        // Subtle parallax effect for hero content
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
        
        // Enhanced floating elements movement
        floatingElements.forEach((element, index) => {
            const speed = 0.05 + (index * 0.02);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Mouse Move Effect for Floating Elements
    document.addEventListener('mousemove', (e) => {
        const floatingElements = document.querySelectorAll('.floating-element');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        floatingElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementX = rect.left + rect.width / 2;
            const elementY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX - elementX) * 0.01;
            const deltaY = (mouseY - elementY) * 0.01;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
    });

    // Enhanced Button Hover Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Smooth Scroll with Progress Indicator
    const sections = document.querySelectorAll('section');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    });

    // Add scroll progress styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, var(--primary-color), var(--accent-color));
            z-index: 1000;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);

    // Image Viewer Functions - Global Scope
    let currentImageIndex = 0;
    let images = [];

    function initializeImageViewer() {
        // Get all gallery images from the Pokemon project
        const galleryImages = document.querySelectorAll('.project-card .gallery-image');
        images = Array.from(galleryImages).map(img => img.src);
        
        // Update total images counter
        document.getElementById('totalImages').textContent = images.length;

        // Add click event listeners to all gallery images
        galleryImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openImageViewer(this.src);
            });
        });
    }

    function openImageViewer(imageSrc) {
        const viewer = document.getElementById('imageViewer');
        const viewerImage = document.getElementById('viewerImage');
        
        // Initialize images array if not already done
        if (images.length === 0) {
            initializeImageViewer();
        }
        
        // Find the index of the clicked image
        currentImageIndex = images.indexOf(imageSrc);
        if (currentImageIndex === -1) currentImageIndex = 0;
        
        // Update the viewer
        updateImageViewer();
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateImageViewer() {
        const viewerImage = document.getElementById('viewerImage');
        const currentIndexElement = document.getElementById('currentImageIndex');
        
        // Update image source
        viewerImage.src = images[currentImageIndex];
        
        // Update counter
        currentIndexElement.textContent = currentImageIndex + 1;
        
        // Add fade effect
        viewerImage.style.opacity = '0';
        setTimeout(() => {
            viewerImage.style.opacity = '1';
        }, 50);
    }

    function navigateImages(direction) {
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        updateImageViewer();
    }

    function closeImageViewer() {
        const viewer = document.getElementById('imageViewer');
        viewer.classList.remove('active');
        document.body.style.overflow = '';
        currentImageIndex = 0;
    }

    // Initialize image viewer
    initializeImageViewer();

    // Add event listeners for navigation and closing
    const imageViewer = document.getElementById('imageViewer');
    
    // Handle navigation and close buttons
    imageViewer.addEventListener('click', function(e) {
        const action = e.target.closest('[data-action]')?.dataset.action;
        
        if (action === 'close') {
            closeImageViewer();
        } else if (action === 'prev') {
            navigateImages(-1);
        } else if (action === 'next') {
            navigateImages(1);
        } else if (e.target === this) {
            closeImageViewer();
        }
    });

    // Close viewer with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageViewer();
        } else if (e.key === 'ArrowLeft') {
            navigateImages(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImages(1);
        }
    });

    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.getElementById('viewerImage').addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    });

    document.getElementById('viewerImage').addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateImages(1); // Swipe left
            } else {
                navigateImages(-1); // Swipe right
            }
        }
    }

    // Initialize cyberpunk effects
    document.addEventListener('DOMContentLoaded', function() {
        // Apply glitch effect to hero title
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.classList.add('glitch');
            heroTitle.setAttribute('data-text', heroTitle.textContent);
        }

        // Create digital rain effect
        createDigitalRain();
        
        // Add scanlines to hero
        addScanlines();
        
        // Enhanced scroll animations with cyberpunk effects
        initCyberpunkScrollAnimations();
        
        // Add terminal typing effect
        addTypingEffect();
        
        // Create floating neon particles
        createNeonParticles();

        // Create rain effect
        createRainEffect();
        
        // Create flying vehicles
        createFlyingVehicles();
        
        // Create neon signs
        createNeonSigns();
        
        // Add grid overlay
        addGridOverlay();
    });

    // Digital rain effect
    function createDigitalRain() {
        const hero = document.querySelector('.hero');
        const rain = document.createElement('div');
        rain.className = 'digital-rain';
        
        // Create matrix characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 20; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                left: ${i * 5}%;
                top: -100px;
                color: #00ff41;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                animation: drop ${Math.random() * 3 + 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            column.textContent = chars[Math.floor(Math.random() * chars.length)];
            rain.appendChild(column);
        }
        
        hero.appendChild(rain);
        
        // Add the drop animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drop {
                to { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add scanlines effect
    function addScanlines() {
        const hero = document.querySelector('.hero');
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        hero.appendChild(scanlines);
    }

    // Enhanced scroll animations
    function initCyberpunkScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    entry.target.classList.add('revealed');
                    
                    // Add cyberpunk glow effect on reveal
                    entry.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.1)';
                    setTimeout(() => {
                        entry.target.style.boxShadow = '';
                    }, 1000);
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('section-reveal');
            observer.observe(section);
        });

        // Enhanced project card animations
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const projectObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                            // Add neon pulse effect
                            entry.target.style.animation = 'neon-pulse 0.5s ease-in-out';
                        }, index * 200);
                    }
                });
            }, { threshold: 0.1 });
            
            projectObserver.observe(card);
        });
    }

    // Terminal typing effect
    function addTypingEffect() {
        const heroP = document.querySelector('.hero p');
        if (heroP) {
            const text = heroP.textContent;
            heroP.textContent = '';
            heroP.classList.add('typing-text');
            
            setTimeout(() => {
                let i = 0;
                const typeWriter = setInterval(() => {
                    heroP.textContent = text.substring(0, i + 1);
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeWriter);
                        heroP.classList.remove('typing-text');
                    }
                }, 50);
            }, 1500);
        }
    }

    // Create floating neon particles
    function createNeonParticles() {
        const hero = document.querySelector('.hero');
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'neon-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${['#00d4ff', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 3)]};
                border-radius: 50%;
                box-shadow: 0 0 10px currentColor;
                animation: float-random ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            hero.appendChild(particle);
        }
    }

    // Parallax effect with cyberpunk twist
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const floatingElements = document.querySelector('.floating-elements');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (floatingElements) {
            floatingElements.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.1}deg)`;
        }
        
        // Hide/show scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (scrolled > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    });

    // Create enhanced rain effect
    function createRainEffect() {
        const hero = document.querySelector('.hero');
        const rain = document.createElement('div');
        rain.className = 'rain';
        hero.appendChild(rain);
        
        // Create individual raindrops for more dynamic effect
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.cssText = `
                position: absolute;
                width: 2px;
                height: ${Math.random() * 20 + 10}px;
                background: linear-gradient(180deg, transparent, #00ffff);
                left: ${Math.random() * 100}%;
                animation: drop-fall ${Math.random() * 1 + 0.5}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            rain.appendChild(drop);
        }
        
        // Add drop animation
        const style = document.createElement('style');
        style.textContent += `
            @keyframes drop-fall {
                0% { 
                    transform: translateY(-100px);
                    opacity: 0;
                }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { 
                    transform: translateY(100vh);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create flying vehicles
    function createFlyingVehicles() {
        const hero = document.querySelector('.hero');
        const vehiclesContainer = document.createElement('div');
        vehiclesContainer.className = 'flying-vehicles';
        
        for (let i = 0; i < 3; i++) {
            const vehicle = document.createElement('div');
            vehicle.className = 'vehicle';
            vehiclesContainer.appendChild(vehicle);
        }
        
        hero.appendChild(vehiclesContainer);
    }

    // Create neon signs
    function createNeonSigns() {
        const hero = document.querySelector('.hero');
        const signsContainer = document.createElement('div');
        signsContainer.className = 'neon-signs';
        
        const signs = ['CYBER', 'TECH', 'CODE'];
        signs.forEach((text, index) => {
            const sign = document.createElement('div');
            sign.className = 'neon-sign';
            sign.textContent = text;
            signsContainer.appendChild(sign);
        });
        
        hero.appendChild(signsContainer);
    }

    // Add grid overlay
    function addGridOverlay() {
        const hero = document.querySelector('.hero');
        const grid = document.createElement('div');
        grid.className = 'grid-overlay';
        hero.appendChild(grid);
    }

    // Enhanced smooth scrolling
    function initSmoothScrolling() {
        // Custom smooth scrolling for anchor links
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

    // Create enhanced cyberpunk rain
    function createCyberpunkRain() {
        const rainContainer = document.createElement('div');
        rainContainer.className = 'cyberpunk-rain';
        document.body.appendChild(rainContainer);

        // Create rain drops with proper styling
        for (let i = 0; i < 150; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Random properties for each drop
            const height = Math.random() * 100 + 20;
            const duration = Math.random() * 2 + 1; // 1-3 seconds
            const delay = Math.random() * 5; // Spread out timing
            const leftPosition = Math.random() * 100;
            
            drop.style.height = `${height}px`;
            drop.style.left = `${leftPosition}%`;
            drop.style.animationDuration = `${duration}s`;
            drop.style.animationDelay = `${delay}s`;
            drop.style.top = '-100px';
            
            rainContainer.appendChild(drop);
        }
    }

    // Create enhanced cyberpunk skyline
    function createCyberpunkSkyline() {
        const hero = document.querySelector('.hero');
        const skyline = document.createElement('div');
        skyline.className = 'cyberpunk-skyline';
        
        // Create city layers
        for (let i = 1; i <= 3; i++) {
            const layer = document.createElement('div');
            layer.className = `city-layer city-layer-${i}`;
            skyline.appendChild(layer);
        }
        
        // Add building lights
        const lights = document.createElement('div');
        lights.className = 'building-lights';
        skyline.appendChild(lights);
        
        hero.appendChild(skyline);
    }

    // Apply section backgrounds
    function applySectionBackgrounds() {
        const sections = document.querySelectorAll('section:not(.hero)');
        sections.forEach(section => {
            section.classList.add('section-bg');
        });
    }

    // Enhanced scroll animations with smooth reveals
    function initEnhancedScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Add special effects for different elements
                    if (entry.target.classList.contains('project-card')) {
                        entry.target.style.animation = 'neon-pulse 0.5s ease-in-out';
                    }
                    
                    // Stagger child animations
                    if (entry.target.classList.contains('stagger-children')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe all sections and special elements
        document.querySelectorAll('section, .project-card, .skill-category, .timeline-item').forEach(element => {
            element.classList.add('smooth-reveal');
            observer.observe(element);
        });
        
        // Add stagger class to containers
        document.querySelectorAll('.projects-grid, .skills-grid, .timeline').forEach(container => {
            container.classList.add('stagger-children');
        });
    }

    // Parallax effect for skyline
    function initSkylineParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const skylineLayers = document.querySelectorAll('.city-layer');
            
            skylineLayers.forEach((layer, index) => {
                const speed = 0.1 + (index * 0.05);
                layer.style.transform = `translateX(${-scrolled * speed}px)`;
            });
            
            // Parallax for flying objects
            const flyingObjects = document.querySelector('.flying-objects');
            if (flyingObjects) {
                flyingObjects.style.transform = `translateX(${-scrolled * 0.15}px)`;
            }
        });
    }

    // Initialize all effects when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Apply glitch effect to hero title
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.classList.add('glitch');
            heroTitle.setAttribute('data-text', heroTitle.textContent);
        }
        
        // Initialize all cyberpunk effects
        createCyberpunkSkyline();
        createCyberpunkRain();
        applySectionBackgrounds();
        ensureContentVisibility(); // New function to ensure content visibility
        initSmoothScrolling();
        initEnhancedScrollAnimations();
        initSkylineParallax();
        
        // Add scanlines to hero
        const hero = document.querySelector('.hero');
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        hero.appendChild(scanlines);
        
        // Create floating neon particles
        createNeonParticles();
        
        // Add terminal typing effect
        addTypingEffect();
    });

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

    // Initialize all cyberpunk effects
    function initializeCyberpunkEffects() {
        // Remove any existing effects first
        const existingSkyline = document.querySelector('.cyberpunk-skyline');
        const existingRain = document.querySelector('.cyberpunk-rain');
        const existingVehicles = document.querySelector('.flying-objects');
        
        if (existingSkyline) existingSkyline.remove();
        if (existingRain) existingRain.remove();
        if (existingVehicles) existingVehicles.remove();
        
        // Create new effects
        createCyberpunkSkyline();
        createCyberpunkRain();
        createFlyingVehicles();
    }

    // Make sure this runs when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for CSS to load
        setTimeout(() => {
            initializeCyberpunkEffects();
        }, 100);
    });
});