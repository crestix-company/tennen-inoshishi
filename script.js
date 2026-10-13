// ====================================
// 天然いのしし - Main JavaScript
// ====================================

document.addEventListener('DOMContentLoaded', function () {

    // Load the introduction only when the visitor chooses to watch it.
    // Native controls remain available when JavaScript is disabled.
    const introductionVideo = document.getElementById('introduction-video');
    const movieStart = document.getElementById('movie-start');
    const movieError = document.getElementById('movie-error');
    if (introductionVideo && movieStart && movieError) {
        introductionVideo.controls = false;
        movieStart.hidden = false;

        const showVideoError = () => {
            movieError.hidden = false;
            movieStart.hidden = false;
            introductionVideo.controls = true;
        };
        movieStart.addEventListener('click', async () => {
            movieError.hidden = true;
            movieStart.hidden = true;
            introductionVideo.controls = true;
            try {
                await introductionVideo.play();
                introductionVideo.focus();
            } catch {
                showVideoError();
            }
        });
        introductionVideo.addEventListener('error', showVideoError);
        introductionVideo.querySelector('source')?.addEventListener('error', showVideoError);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) introductionVideo.pause();
        });
    }

    // ====================================
    // Hamburger Menu Toggle
    // ====================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    overlay.addEventListener('click', closeMenu);

    // Close menu when nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ====================================
    // Header Show/Hide on Scroll
    // ====================================
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        // Show header when scrolling up or at top
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
            header.classList.remove('hidden');
        } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
            // Hide header when scrolling down (after 200px)
            header.classList.add('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ====================================
    // IntersectionObserver for Fade-in Animation
    // ====================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for multiple items
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ====================================
    // Smooth Scroll for Navigation Links
    // ====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // Scroll Indicator Click
    // ====================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const introductionSection = document.getElementById('movie');
            if (introductionSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = introductionSection.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ====================================
    // Food Gallery Hover Effect (Touch Devices)
    // ====================================
    const foodItems = document.querySelectorAll('.food-item');

    foodItems.forEach(item => {
        item.addEventListener('touchstart', function () {
            // Remove active class from other items
            foodItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('touch-active');
                }
            });
            // Toggle active class on current item
            this.classList.toggle('touch-active');
        }, { passive: true });
    });

    // Close food overlay when touching outside
    document.addEventListener('touchstart', function (e) {
        if (!e.target.closest('.food-item')) {
            foodItems.forEach(item => {
                item.classList.remove('touch-active');
            });
        }
    }, { passive: true });

    // ====================================
    // Parallax Effect for Hero (Optional)
    // ====================================
    const heroImage = document.querySelector('.hero-image img');

    if (heroImage && window.innerWidth > 768) {
        window.addEventListener('scroll', function () {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // ====================================
    // Lazy Loading for Images (Native + Fallback)
    // ====================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ====================================
    // Current Year for Copyright
    // ====================================
    const copyrightYear = document.querySelector('.footer-copyright');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2024', currentYear);
    }

});
