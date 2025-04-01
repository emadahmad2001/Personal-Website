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

    // Enhanced mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Enhanced form validation and submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic form validation
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;

            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
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
});