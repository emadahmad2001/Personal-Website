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
});