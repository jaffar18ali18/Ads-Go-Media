/* ========================================
   HAMBURGER MENU FUNCTIONALITY
   ======================================== */

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in-scroll class to elements that should animate on scroll
document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
    el.classList.add('fade-in-scroll');
    observer.observe(el);
});

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// HERO BUTTON REDIRECTS
// PAGE LOADER ELEMENT & HELPERS
const pageLoader = document.getElementById('pageLoader');
function showLoader() {
    if (pageLoader) pageLoader.classList.add('visible');
}
function hideLoader() {
    if (pageLoader) pageLoader.classList.remove('visible');
}

// Show loader briefly then navigate so users see feedback
const getStartedBtn = document.getElementById('getStartedBtn');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoader();
        setTimeout(() => { window.location.href = 'Contact.html'; }, 300);
    });
}

const viewServicesBtn = document.getElementById('viewServicesBtn');
if (viewServicesBtn) {
    viewServicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoader();
        setTimeout(() => { window.location.href = 'Services.html'; }, 300);
    });
}

// Ensure loader is hidden after the page finishes loading
window.addEventListener('load', () => {
    hideLoader();
});

/* ========================================
   NAVBAR BACKGROUND ON SCROLL
   ======================================== */

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = 'rgba(0, 245, 212, 0.2)';
    } else {
        navbar.style.borderBottomColor = 'rgba(0, 245, 212, 0.1)';
    }
});

/* ========================================
   NEWSLETTER SUBSCRIPTION
   ======================================== */

const newsletterBtn = document.querySelector('.newsletter .btn');
const newsletterInput = document.querySelector('.newsletter-input');

if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
        const email = newsletterInput.value.trim();
        if (email && isValidEmail(email)) {
            alert('Thank you for subscribing! Check your email for confirmation.');
            newsletterInput.value = '';
        } else if (email) {
            alert('Please enter a valid email address.');
        } else {
            alert('Please enter your email address.');
        }
    });
}

// Simple email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Allow Enter key to submit newsletter
if (newsletterInput) {
    newsletterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newsletterBtn.click();
        }
    });
}

/* ========================================
   BUTTON RIPPLE EFFECT
   ======================================== */

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Add ripple style if not already in CSS
        if (!document.querySelector('style[data-ripple]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple', 'true');
            style.textContent = `
                .btn { position: relative; overflow: hidden; }
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

/* ========================================
   PAGE LOAD ANIMATION
   ======================================== */

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

/* ========================================
   COUNTER ANIMATION (Results Section)
   ======================================== */

function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    const isX = el.textContent.trim().endsWith('X');
    const duration = 1400;
    const start = performance.now();
    const from = 0;

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * (target - from) + from);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(tick);
        else {
            if (isX) el.textContent = target + 'X';
            else el.textContent = target;
        }
    }

    requestAnimationFrame(tick);
}

// Observe counters when they enter viewport
const counters = document.querySelectorAll('.counter');
if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));
}

/* Ensure fade-in elements animate smoothly without lag */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        el.style.willChange = 'transform, opacity';
    });
});

/* ========================================
   PREVENT LAYOUT SHIFT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure all images are loaded before displaying
    const images = document.querySelectorAll('img');
    let loadedImages = 0;

    images.forEach(img => {
        img.addEventListener('load', () => {
            loadedImages++;
            if (loadedImages === images.length) {
                document.body.style.opacity = '1';
            }
        });

        // If image fails to load, still show content
        img.addEventListener('error', () => {
            loadedImages++;
            if (loadedImages === images.length) {
                document.body.style.opacity = '1';
            }
        });

        // If image is already cached
        if (img.complete) {
            loadedImages++;
            if (loadedImages === images.length) {
                document.body.style.opacity = '1';
            }
        }
    });

    // Fallback in case of no images
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

/* ========================================
     THEME TOGGLE (Dark <-> Light)
   Global theme switching with localStorage persistence
   Dark theme is default on first visit
   ======================================== */

(function() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (!themeToggleBtn) return;

    // Retrieve saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('site-theme') || 'dark';

    // Apply theme on page load
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
            themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        } else {
            body.classList.remove('light-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        }
        localStorage.setItem('site-theme', theme);
    };

    // Apply saved theme on load
    applyTheme(savedTheme);

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    // Optional: Respect system preference if no saved preference
    // Uncomment to enable automatic dark/light based on system settings
    /*
    if (!localStorage.getItem('site-theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
    */
})();


/* ========================================
   PREMIUM SERVICES SECTION ANIMATIONS
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Fade-in-up and stagger for premium cards
    const premiumCards = document.querySelectorAll('.premium-service-card');
    const sectionTitle = document.querySelector('.premium-section-title');
    const observerOptions = { threshold: 0.15 };

    if (premiumCards.length) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        premiumCards.forEach(card => cardObserver.observe(card));
    }

    // Section title fade and underline
    if (sectionTitle) {
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sectionTitle.classList.add('fade-in-up');
                    setTimeout(() => sectionTitle.classList.add('animated-underline'), 200);
                    titleObserver.unobserve(sectionTitle);
                }
            });
        }, observerOptions);
        titleObserver.observe(sectionTitle);
    }
});

/* ========================================
   FIRST-VISIT LOGO SPLASH
   Shows an animated logo overlay only on the user's first visit
   Uses localStorage key `firstVisitShown_v1` to persist state
   ======================================== */
(function() {
    const splash = document.getElementById('firstVisitSplash');
    const logo = document.getElementById('firstVisitLogo');
    const splashKey = 'firstVisitShown_v1';
    if (!splash) return;

    function removeSplash() {
        try {
            splash.remove();
        } catch (e) {
            if (splash.parentNode) splash.parentNode.removeChild(splash);
        }
    }

    function playSplash() {
        splash.classList.add('visible');
        // restart animation if cached
        if (logo) {
            logo.style.animation = 'none';
            requestAnimationFrame(() => { logo.style.animation = ''; });
        }

        // hide after the pop animation then remove
        setTimeout(() => { splash.classList.add('hide'); }, 1400);
        setTimeout(() => { removeSplash(); localStorage.setItem(splashKey, 'true'); }, 1900);
    }

    if (!localStorage.getItem(splashKey)) {
        // Prefer to start after load so images/fonts are ready
        window.addEventListener('load', playSplash);
        // Fallback in case load event is delayed
        setTimeout(() => { if (!localStorage.getItem(splashKey)) playSplash(); }, 1000);
    } else {
        // Already shown — remove overlay immediately
        removeSplash();
    }
})();
