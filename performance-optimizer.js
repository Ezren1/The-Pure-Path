// PERFORMANCE OPTIMIZER
// Advanced performance monitoring, optimization, and responsive design enhancements

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0,
            networkRequests: 0
        };
        this.isLowEndDevice = this.detectLowEndDevice();
        this.connectionType = this.getConnectionType();
        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.optimizeForDevice();
        this.setupLazyLoading();
        this.optimizeAnimations();
        this.setupResourceHints();
        this.monitorMemoryUsage();
        this.setupResponsiveOptimizations();
        this.implementCriticalResourceLoading();
    }

    // ===== PERFORMANCE MONITORING =====
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observeLCP();
        this.observeFID();
        this.observeCLS();
        this.observeFCP();
        this.observeTTFB();
        
        // Custom metrics
        this.monitorCustomMetrics();
        
        // Report metrics periodically
        setInterval(() => {
            this.reportMetrics();
        }, 30000);
    }

    observeLCP() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                
                if (lastEntry.startTime > 2500) {
                    this.optimizeLCP();
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    observeFID() {
        // First Input Delay
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    
                    if (this.metrics.fid > 100) {
                        this.optimizeFID();
                    }
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    observeCLS() {
        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.metrics.cls = clsValue;
                
                if (clsValue > 0.1) {
                    this.optimizeCLS();
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    observeFCP() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    observeTTFB() {
        // Time to First Byte
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        this.metrics.ttfb = entry.responseStart - entry.requestStart;
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    monitorCustomMetrics() {
        // Animation frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                if (this.metrics.fps < 30) {
                    this.reduceAnimationComplexity();
                }
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
        
        // JavaScript execution time
        this.monitorJSExecutionTime();
        
        // Resource loading times
        this.monitorResourceLoading();
    }

    monitorJSExecutionTime() {
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        window.setTimeout = (callback, delay, ...args) => {
            const start = performance.now();
            return originalSetTimeout(() => {
                const executionTime = performance.now() - start;
                this.metrics.jsExecutionTime = (this.metrics.jsExecutionTime || 0) + executionTime;
                callback.apply(this, args);
            }, delay);
        };
        
        window.setInterval = (callback, delay, ...args) => {
            const start = performance.now();
            return originalSetInterval(() => {
                const executionTime = performance.now() - start;
                this.metrics.jsExecutionTime = (this.metrics.jsExecutionTime || 0) + executionTime;
                callback.apply(this, args);
            }, delay);
        };
    }

    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'resource') {
                        this.metrics.networkRequests++;
                        
                        if (entry.duration > 1000) {
                            this.optimizeSlowResource(entry);
                        }
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    // ===== DEVICE OPTIMIZATION =====
    detectLowEndDevice() {
        // Detect low-end devices based on various factors
        const factors = {
            cores: navigator.hardwareConcurrency < 4,
            memory: navigator.deviceMemory < 4,
            connection: this.getConnectionType() === 'slow',
            userAgent: /Android.*Chrome\/[.0-9]*\s/.test(navigator.userAgent) && 
                      parseInt(navigator.userAgent.match(/Chrome\/([0-9]+)/)[1]) < 80
        };
        
        const lowEndScore = Object.values(factors).filter(Boolean).length;
        return lowEndScore >= 2;
    }

    getConnectionType() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const slowConnections = ['slow-2g', '2g', '3g'];
            
            if (slowConnections.includes(connection.effectiveType)) {
                return 'slow';
            }
            
            if (connection.effectiveType === '4g') {
                return 'fast';
            }
        }
        
        return 'unknown';
    }

    optimizeForDevice() {
        if (this.isLowEndDevice) {
            document.body.classList.add('low-end-device');
            this.applyLowEndOptimizations();
        }
        
        if (this.connectionType === 'slow') {
            document.body.classList.add('slow-connection');
            this.applySlowConnectionOptimizations();
        }
    }

    applyLowEndOptimizations() {
        // Reduce particle count
        const particleContainer = document.querySelector('.particle-container');
        if (particleContainer) {
            particleContainer.style.display = 'none';
        }
        
        // Disable complex animations
        const style = document.createElement('style');
        style.textContent = `
            .low-end-device * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            
            .low-end-device .hero-background {
                animation: none !important;
            }
            
            .low-end-device .floating-quran {
                animation: none !important;
            }
            
            .low-end-device .divine-light-rays {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Reduce image quality
        this.optimizeImagesForLowEnd();
    }

    applySlowConnectionOptimizations() {
        // Defer non-critical resources
        this.deferNonCriticalResources();
        
        // Compress images further
        this.enableImageCompression();
        
        // Reduce animation complexity
        this.simplifyAnimations();
    }

    optimizeImagesForLowEnd() {
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.dataset.optimized) {
                // Create lower quality version (simulated)
                img.style.imageRendering = 'pixelated';
                img.dataset.optimized = 'true';
            }
        });
    }

    // ===== LAZY LOADING =====
    setupLazyLoading() {
        this.lazyLoadImages();
        this.lazyLoadSections();
        this.lazyLoadScripts();
    }

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    lazyLoadSections() {
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        
                        // Load section-specific resources
                        this.loadSectionResources(section);
                        
                        sectionObserver.unobserve(section);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });
            
            document.querySelectorAll('section[id]').forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }

    lazyLoadScripts() {
        // Load non-critical scripts after main content
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadNonCriticalScripts();
            }, 1000);
        });
    }

    loadSectionResources(section) {
        // Load section-specific animations or content
        const sectionId = section.id;
        
        switch(sectionId) {
            case 'scene2':
                this.loadBalanceScalesAnimation();
                break;
            case 'scene3':
                this.loadConflictAnimations();
                break;
            case 'scene5':
                this.loadBurnEffects();
                break;
        }
    }

    loadNonCriticalScripts() {
        const scripts = [
            '/js/analytics.js',
            '/js/social-sharing.js',
            '/js/advanced-search.js'
        ];
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
    }

    // ===== ANIMATION OPTIMIZATION =====
    optimizeAnimations() {
        this.setupAnimationObserver();
        this.optimizeOffScreenAnimations();
        this.implementAnimationBudget();
    }

    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const element = entry.target;
                    
                    if (entry.isIntersecting) {
                        element.style.animationPlayState = 'running';
                    } else {
                        element.style.animationPlayState = 'paused';
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            document.querySelectorAll('[class*="animation"], [class*="animate"]').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    optimizeOffScreenAnimations() {
        // Pause animations for off-screen elements
        const style = document.createElement('style');
        style.textContent = `
            .animation-paused {
                animation-play-state: paused !important;
            }
            
            .animation-paused * {
                animation-play-state: paused !important;
            }
        `;
        document.head.appendChild(style);
    }

    implementAnimationBudget() {
        let activeAnimations = 0;
        const maxAnimations = this.isLowEndDevice ? 3 : 10;
        
        const originalAnimate = Element.prototype.animate;
        Element.prototype.animate = function(keyframes, options) {
            if (activeAnimations >= maxAnimations) {
                return { cancel: () => {}, finish: () => {} };
            }
            
            activeAnimations++;
            const animation = originalAnimate.call(this, keyframes, options);
            
            animation.addEventListener('finish', () => {
                activeAnimations--;
            });
            
            animation.addEventListener('cancel', () => {
                activeAnimations--;
            });
            
            return animation;
        };
    }

    // ===== RESOURCE OPTIMIZATION =====
    setupResourceHints() {
        this.addPreloadHints();
        this.addPrefetchHints();
        this.addPreconnectHints();
    }

    addPreloadHints() {
        const criticalResources = [
            { href: '/css/premium-animations.css', as: 'style' },
            { href: '/js/premium-interactions.js', as: 'script' },
            { href: '/assets/arabic-calligraphy-logo.png', as: 'image' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    addPrefetchHints() {
        const nextPageResources = [
            '/assets/quran-book-3d-render.png',
            '/assets/divine-light-rays.png'
        ];
        
        // Prefetch after main content loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                nextPageResources.forEach(href => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = href;
                    document.head.appendChild(link);
                });
            }, 2000);
        });
    }

    addPreconnectHints() {
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        externalDomains.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = href;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // ===== MEMORY OPTIMIZATION =====
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                if (this.metrics.memoryUsage > 0.8) {
                    this.cleanupMemory();
                }
            }, 10000);
        }
    }

    cleanupMemory() {
        // Remove unused event listeners
        this.cleanupEventListeners();
        
        // Clear cached data
        this.clearOldCaches();
        
        // Garbage collect animations
        this.cleanupAnimations();
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    cleanupEventListeners() {
        // Remove old event listeners that are no longer needed
        const oldElements = document.querySelectorAll('[data-cleanup]');
        oldElements.forEach(element => {
            element.removeEventListener('click', element._clickHandler);
            element.removeEventListener('mouseover', element._hoverHandler);
            element.remove();
        });
    }

    clearOldCaches() {
        // Clear old localStorage entries
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            const item = localStorage.getItem(key);
            
            try {
                const data = JSON.parse(item);
                if (data.timestamp && now - data.timestamp > maxAge) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Invalid JSON, remove old entries
                if (key.startsWith('old-')) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    cleanupAnimations() {
        // Cancel finished animations
        document.getAnimations().forEach(animation => {
            if (animation.playState === 'finished') {
                animation.cancel();
            }
        });
    }

    // ===== RESPONSIVE OPTIMIZATIONS =====
    setupResponsiveOptimizations() {
        this.optimizeForViewport();
        this.setupResponsiveImages();
        this.optimizeForTouch();
        this.setupOrientationHandling();
    }

    optimizeForViewport() {
        const updateViewport = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            
            // Update CSS custom properties
            document.documentElement.style.setProperty('--vw', `${vw}px`);
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Optimize for different screen sizes
            if (vw < 768) {
                this.applyMobileOptimizations();
            } else if (vw < 1024) {
                this.applyTabletOptimizations();
            } else {
                this.applyDesktopOptimizations();
            }
        };
        
        updateViewport();
        window.addEventListener('resize', this.debounce(updateViewport, 250));
    }

    applyMobileOptimizations() {
        document.body.classList.add('mobile-optimized');
        
        // Reduce animation complexity
        const style = document.createElement('style');
        style.id = 'mobile-optimizations';
        style.textContent = `
            .mobile-optimized .particle-container {
                display: none !important;
            }
            
            .mobile-optimized .premium-card {
                transform: none !important;
            }
            
            .mobile-optimized .flip-card-inner {
                transition-duration: 0.3s !important;
            }
            
            .mobile-optimized .hero-background {
                animation: none !important;
            }
        `;
        
        // Remove existing mobile styles
        const existing = document.getElementById('mobile-optimizations');
        if (existing) existing.remove();
        
        document.head.appendChild(style);
    }

    applyTabletOptimizations() {
        document.body.classList.remove('mobile-optimized');
        document.body.classList.add('tablet-optimized');
        
        // Moderate optimizations for tablets
        const style = document.createElement('style');
        style.id = 'tablet-optimizations';
        style.textContent = `
            .tablet-optimized .particle-container .particle:nth-child(n+20) {
                display: none;
            }
        `;
        
        const existing = document.getElementById('tablet-optimizations');
        if (existing) existing.remove();
        
        document.head.appendChild(style);
    }

    applyDesktopOptimizations() {
        document.body.classList.remove('mobile-optimized', 'tablet-optimized');
        
        // Full features for desktop
        const mobileStyles = document.getElementById('mobile-optimizations');
        const tabletStyles = document.getElementById('tablet-optimizations');
        
        if (mobileStyles) mobileStyles.remove();
        if (tabletStyles) tabletStyles.remove();
    }

    setupResponsiveImages() {
        // Implement responsive images with srcset
        document.querySelectorAll('img').forEach(img => {
            if (!img.srcset && img.src) {
                const baseSrc = img.src.replace(/\.[^/.]+$/, '');
                const extension = img.src.split('.').pop();
                
                // Create responsive srcset (simulated)
                img.srcset = `
                    ${baseSrc}-small.${extension} 480w,
                    ${baseSrc}-medium.${extension} 768w,
                    ${baseSrc}-large.${extension} 1200w
                `;
                img.sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px';
            }
        });
    }

    optimizeForTouch() {
        // Enhance touch interactions
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Increase touch targets
            const style = document.createElement('style');
            style.textContent = `
                .touch-device button,
                .touch-device .nav-link,
                .touch-device .premium-card {
                    min-height: 44px;
                    min-width: 44px;
                }
                
                .touch-device .premium-card {
                    padding: 2rem 1.5rem;
                }
            `;
            document.head.appendChild(style);
            
            // Add touch feedback
            this.setupTouchFeedback();
        }
    }

    setupTouchFeedback() {
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('button, .premium-card, .nav-link')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.matches('button, .premium-card, .nav-link')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });
    }

    setupOrientationHandling() {
        const handleOrientationChange = () => {
            // Recalculate layouts after orientation change
            setTimeout(() => {
                this.optimizeForViewport();
                
                // Trigger resize event for other components
                window.dispatchEvent(new Event('resize'));
            }, 100);
        };
        
        window.addEventListener('orientationchange', handleOrientationChange);
        screen.orientation?.addEventListener('change', handleOrientationChange);
    }

    // ===== CRITICAL RESOURCE LOADING =====
    implementCriticalResourceLoading() {
        this.identifyCriticalResources();
        this.prioritizeResourceLoading();
        this.implementResourceBudget();
    }

    identifyCriticalResources() {
        const criticalResources = [
            '/css/premium-animations.css',
            '/js/premium-interactions.js',
            '/assets/arabic-calligraphy-logo.png'
        ];
        
        // Mark critical resources
        criticalResources.forEach(resource => {
            const link = document.querySelector(`link[href="${resource}"], script[src="${resource}"]`);
            if (link) {
                link.dataset.critical = 'true';
            }
        });
    }

    prioritizeResourceLoading() {
        // Use resource hints for critical resources
        const criticalLinks = document.querySelectorAll('[data-critical="true"]');
        criticalLinks.forEach(link => {
            link.setAttribute('importance', 'high');
        });
        
        // Defer non-critical resources
        const nonCriticalScripts = document.querySelectorAll('script:not([data-critical])');
        nonCriticalScripts.forEach(script => {
            if (!script.async && !script.defer) {
                script.defer = true;
            }
        });
    }

    implementResourceBudget() {
        let resourceCount = 0;
        const maxResources = this.isLowEndDevice ? 10 : 20;
        
        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    resourceCount++;
                    
                    if (resourceCount > maxResources) {
                        this.deferNonCriticalResources();
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    deferNonCriticalResources() {
        // Defer loading of non-critical images
        document.querySelectorAll('img:not([data-critical])').forEach(img => {
            if (!img.dataset.deferred) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
                img.dataset.deferred = 'true';
                img.classList.add('lazy');
            }
        });
    }

    // ===== OPTIMIZATION METHODS =====
    optimizeLCP() {
        // Optimize Largest Contentful Paint
        const heroImage = document.querySelector('.floating-quran img');
        if (heroImage) {
            heroImage.loading = 'eager';
            heroImage.fetchPriority = 'high';
        }
        
        // Preload hero section resources
        this.preloadHeroResources();
    }

    optimizeFID() {
        // Optimize First Input Delay
        this.deferNonEssentialJS();
        this.breakUpLongTasks();
    }

    optimizeCLS() {
        // Optimize Cumulative Layout Shift
        this.addImageDimensions();
        this.reserveSpaceForDynamicContent();
    }

    preloadHeroResources() {
        const heroResources = [
            '/assets/quran-book-3d-render.png',
            '/assets/divine-light-rays.png',
            '/assets/islamic-geometric-pattern-gold.png'
        ];
        
        heroResources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    deferNonEssentialJS() {
        // Move non-essential JavaScript to after load
        window.addEventListener('load', () => {
            setTimeout(() => {
                // Load analytics, social sharing, etc.
                this.loadNonEssentialFeatures();
            }, 1000);
        });
    }

    breakUpLongTasks() {
        // Break up long-running tasks using scheduler.postTask or setTimeout
        const originalSetTimeout = window.setTimeout;
        
        window.setTimeout = (callback, delay = 0) => {
            if (delay === 0) {
                delay = 5; // Minimum delay to yield to browser
            }
            return originalSetTimeout(callback, delay);
        };
    }

    addImageDimensions() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.width || !img.height) {
                // Set default dimensions to prevent layout shift
                img.style.aspectRatio = '16/9';
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
    }

    reserveSpaceForDynamicContent() {
        // Add min-height to containers that will have dynamic content
        document.querySelectorAll('.search-results, .bookmark-list').forEach(container => {
            container.style.minHeight = '100px';
        });
    }

    // ===== UTILITY METHODS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== REPORTING =====
    reportMetrics() {
        // Send metrics to service worker or analytics
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'PERFORMANCE_METRICS',
                metrics: this.metrics
            });
        }
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.table(this.metrics);
        }
    }

    // ===== SPECIFIC OPTIMIZATIONS =====
    optimizeSlowResource(entry) {
        console.warn(`Slow resource detected: ${entry.name} (${entry.duration}ms)`);
        
        // Add to defer list for future loads
        const url = new URL(entry.name);
        if (url.pathname.includes('/assets/')) {
            this.deferResource(entry.name);
        }
    }

    deferResource(url) {
        // Add resource to defer list
        const deferredResources = JSON.parse(localStorage.getItem('deferred-resources') || '[]');
        if (!deferredResources.includes(url)) {
            deferredResources.push(url);
            localStorage.setItem('deferred-resources', JSON.stringify(deferredResources));
        }
    }

    reduceAnimationComplexity() {
        // Reduce animation complexity when FPS drops
        document.body.classList.add('reduced-animations');
        
        const style = document.createElement('style');
        style.textContent = `
            .reduced-animations * {
                animation-duration: 0.2s !important;
                transition-duration: 0.2s !important;
            }
            
            .reduced-animations .particle-container {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    loadNonEssentialFeatures() {
        // Load features that aren't critical for initial render
        this.loadSocialSharing();
        this.loadAdvancedSearch();
        this.loadAnalytics();
    }

    loadSocialSharing() {
        // Load social sharing functionality
        if (!document.querySelector('#social-sharing-loaded')) {
            const script = document.createElement('script');
            script.id = 'social-sharing-loaded';
            script.textContent = '// Social sharing code would go here';
            document.head.appendChild(script);
        }
    }

    loadAdvancedSearch() {
        // Load advanced search functionality
        if (!document.querySelector('#advanced-search-loaded')) {
            const script = document.createElement('script');
            script.id = 'advanced-search-loaded';
            script.textContent = '// Advanced search code would go here';
            document.head.appendChild(script);
        }
    }

    loadAnalytics() {
        // Load analytics code
        if (!document.querySelector('#analytics-loaded')) {
            const script = document.createElement('script');
            script.id = 'analytics-loaded';
            script.textContent = '// Analytics code would go here';
            document.head.appendChild(script);
        }
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

