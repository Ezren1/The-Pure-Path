// PREMIUM INTERACTIONS & ANIMATIONS JAVASCRIPT
// Advanced particle system, 3D effects, and interactive features

class PremiumWebsite {
    constructor() {
        this.particles = [];
        this.cursorTrails = [];
        this.isLoaded = false;
        this.scrollPosition = 0;
        this.init();
    }

    init() {
        this.setupLoader();
        this.setupParticleSystem();
        this.setupCustomCursor();
        this.setupScrollAnimations();
        this.setupNavigationEffects();
        this.setupCardInteractions();
        this.setupModalSystem();
        this.setupAudioSystem();
        this.setupPerformanceOptimizations();
    }

    // ===== PREMIUM LOADING SYSTEM =====
    setupLoader() {
        const loader = document.querySelector('.premium-loader');
        const progressBar = document.querySelector('.loader-progress-bar');
        const loaderText = document.querySelector('.loader-text');
        
        let progress = 0;
        const loadingTexts = [
            'Loading Divine Wisdom...',
            'Preparing Sacred Content...',
            'Illuminating the Path...',
            'Revealing Truth...',
            'Welcome to Pure Path'
        ];
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            
            const textIndex = Math.floor((progress / 100) * (loadingTexts.length - 1));
            loaderText.textContent = loadingTexts[textIndex];
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    this.isLoaded = true;
                    this.startMainAnimations();
                }, 500);
            }
        }, 100);
    }

    startMainAnimations() {
        // Start particle system
        this.createParticles();
        
        // Reveal content with staggered animations
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, index * 200);
        });
    }

    // ===== ADVANCED PARTICLE SYSTEM =====
    setupParticleSystem() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        document.body.appendChild(this.particleContainer);
    }

    createParticles() {
        const particleCount = window.innerWidth > 768 ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
        
        // Continuously create new particles
        setInterval(() => {
            if (this.particles.length < particleCount) {
                this.createParticle();
            }
        }, 2000);
    }

    createParticle() {
        const particle = document.createElement('div');
        const types = ['particle', 'particle star', 'particle geometric'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        particle.className = type;
        
        const size = Math.random() * 8 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        this.particleContainer.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p !== particle);
            }
        }, 20000);
    }

    // ===== CUSTOM CURSOR SYSTEM =====
    setupCustomCursor() {
        if (window.innerWidth <= 768) return; // Skip on mobile
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        const trails = [];
        for (let i = 0; i < 5; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            trails.push(trail);
        }
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor following
        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Update trails
            trails.forEach((trail, index) => {
                const delay = (index + 1) * 0.02;
                const trailX = cursorX + Math.sin(Date.now() * 0.001 + index) * 10;
                const trailY = cursorY + Math.cos(Date.now() * 0.001 + index) * 10;
                
                trail.style.left = trailX + 'px';
                trail.style.top = trailY + 'px';
                trail.style.opacity = (5 - index) / 5 * 0.5;
            });
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
        
        // Hover effects
        document.querySelectorAll('a, button, .premium-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
        
        // Parallax effects
        window.addEventListener('scroll', () => {
            this.scrollPosition = window.pageYOffset;
            this.updateParallax();
            this.updateNavigationState();
        });
    }

    updateParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(this.scrollPosition * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateNavigationState() {
        const nav = document.querySelector('.premium-nav');
        if (this.scrollPosition > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ===== NAVIGATION EFFECTS =====
    setupNavigationEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    smoothScrollTo(element) {
        const targetPosition = element.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // ===== PREMIUM CARD INTERACTIONS =====
    setupCardInteractions() {
        const cards = document.querySelectorAll('.premium-card');
        
        cards.forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
            
            // Click animation
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
        
        // Flip card interactions
        const flipCards = document.querySelectorAll('.flip-card');
        flipCards.forEach(card => {
            let isFlipped = false;
            
            card.addEventListener('click', () => {
                isFlipped = !isFlipped;
                const inner = card.querySelector('.flip-card-inner');
                inner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            });
        });
    }

    // ===== MODAL SYSTEM =====
    setupModalSystem() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.premium-modal');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    this.openModal(modal);
                }
            });
        });
        
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal));
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.premium-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===== AUDIO SYSTEM =====
    setupAudioSystem() {
        const audioTriggers = document.querySelectorAll('[data-audio]');
        
        audioTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const audioFile = trigger.getAttribute('data-audio');
                this.playAudio(audioFile);
            });
        });
        
        // Subtle interaction sounds
        document.querySelectorAll('.premium-card, .nav-link').forEach(el => {
            el.addEventListener('mouseenter', () => {
                // this.playHoverSound(); // Uncomment if you have hover sound files
            });
        });
    }

    playAudio(audioFile) {
        const audio = new Audio(audioFile);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.updateParallax();
                this.updateNavigationState();
            }, 16); // ~60fps
        });
        
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-animations');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused-animations');
            } else {
                document.body.classList.remove('paused-animations');
            }
        });
    }

    // ===== SCENE-SPECIFIC ANIMATIONS =====
    initSceneAnimations() {
        // Scene 1: Qur'an Sufficiency
        this.setupQuranBookAnimation();
        
        // Scene 2: Hadith vs Qur'an
        this.setupBalanceScalesAnimation();
        
        // Scene 3: Internal Conflicts
        this.setupConflictAnimations();
        
        // Scene 4: Prophet Character Defense
        this.setupDefenseAnimations();
        
        // Scene 5: Problematic Hadith
        this.setupProblematicHadithAnimations();
        
        // Scene 6: Qur'an Prohibits
        this.setupProhibitionAnimations();
        
        // Scene 7: Pure Path
        this.setupPurePathAnimations();
        
        // Scene 8: FAQs & About
        this.setupFAQAnimations();
    }

    setupQuranBookAnimation() {
        const quranBook = document.querySelector('.quran-book-3d');
        if (quranBook) {
            quranBook.addEventListener('click', () => {
                quranBook.style.animation = 'none';
                setTimeout(() => {
                    quranBook.style.animation = 'bookHover 5s ease-in-out infinite';
                }, 100);
            });
        }
    }

    setupBalanceScalesAnimation() {
        const scales = document.querySelector('.balance-scales');
        if (scales) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        scales.style.animation = 'scaleBalance 4s ease-in-out infinite';
                    }
                });
            });
            observer.observe(scales);
        }
    }

    setupConflictAnimations() {
        const conflictCards = document.querySelectorAll('.scene-internal-conflicts .premium-card');
        conflictCards.forEach((card, index) => {
            card.style.animationDelay = (index * 0.5) + 's';
        });
    }

    setupDefenseAnimations() {
        const shields = document.querySelectorAll('.protective-shield');
        shields.forEach(shield => {
            shield.addEventListener('mouseenter', () => {
                shield.style.animation = 'shieldGlow 1s ease-in-out';
            });
        });
    }

    setupProblematicHadithAnimations() {
        const problematicCards = document.querySelectorAll('.scene-problematic-hadith .premium-card');
        problematicCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.add('burn-animation');
                setTimeout(() => {
                    card.classList.remove('burn-animation');
                }, 4000);
            });
        });
    }

    setupProhibitionAnimations() {
        const prohibitionCards = document.querySelectorAll('.scene-quran-prohibits .premium-card');
        prohibitionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.animation = 'chainBreaking 1s ease-in-out';
            });
        });
    }

    setupPurePathAnimations() {
        const pathElements = document.querySelectorAll('.journey-path');
        pathElements.forEach((element, index) => {
            element.style.animationDelay = (index * 0.3) + 's';
        });
    }

    setupFAQAnimations() {
        const faqCards = document.querySelectorAll('.scene-faqs-about .premium-card');
        faqCards.forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'rotateY(180deg)';
                setTimeout(() => {
                    card.style.transform = 'rotateY(0deg)';
                }, 600);
            });
        });
    }

    // ===== ACCESSIBILITY FEATURES =====
    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Reduced motion detection
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    // ===== RESPONSIVE OPTIMIZATIONS =====
    setupResponsiveOptimizations() {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                // Disable heavy animations on mobile
                document.body.classList.add('mobile-optimized');
                this.particles.forEach(particle => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                });
                this.particles = [];
            } else {
                document.body.classList.remove('mobile-optimized');
                if (this.isLoaded && this.particles.length === 0) {
                    this.createParticles();
                }
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
    }
}

// ===== UTILITY FUNCTIONS =====
class AnimationUtils {
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const website = new PremiumWebsite();
    
    // Initialize scene-specific animations after a delay
    setTimeout(() => {
        website.initSceneAnimations();
        website.setupAccessibility();
        website.setupResponsiveOptimizations();
    }, 1000);
});

// ===== SERVICE WORKER FOR PERFORMANCE =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

