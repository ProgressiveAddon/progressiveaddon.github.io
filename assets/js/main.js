document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n
    if (typeof I18n !== 'undefined') {
        I18n.init().then(() => {
            translateNav();
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let currentTheme = root.getAttribute('data-theme');
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.classList.remove('light-mode');
            } else {
                themeToggle.classList.add('light-mode');
            }
        }
    }

    // Language Switcher
    const langSwitcher = document.querySelector('.lang-switcher');
    const langBtn = document.querySelector('.lang-switcher-btn');
    const langOptions = document.querySelectorAll('.lang-option');
    const langCurrent = document.querySelector('.lang-current');

    if (langBtn && langSwitcher) {
        const savedLang = localStorage.getItem('lang') || 'en';
        if (langCurrent) langCurrent.textContent = savedLang.toUpperCase();
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === savedLang);
        });

        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('open');
        });

        langOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const lang = opt.dataset.lang;
                if (typeof I18n !== 'undefined') {
                    I18n.setLang(lang).then(() => {
                        translateNav();
                    });
                } else {
                    localStorage.setItem('lang', lang);
                    if (langCurrent) langCurrent.textContent = lang.toUpperCase();
                    langOptions.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                }
                langSwitcher.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!langSwitcher.contains(e.target)) {
                langSwitcher.classList.remove('open');
            }
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.padding = '12px 5%';
                header.style.background = 'var(--bg-dark)';
                header.style.borderBottom = '1px solid var(--glass-border)';
            } else {
                header.style.padding = '24px 5%';
                header.style.background = 'transparent';
                header.style.borderBottom = 'none';
            }
        }
    });

    // Lightbox for post images
    const postImages = document.querySelectorAll('.post-content img');
    postImages.forEach(img => {
        img.addEventListener('click', () => {
            let lightbox = document.getElementById('pa-lightbox');
            if (!lightbox) {
                lightbox = document.createElement('div');
                lightbox.id = 'pa-lightbox';
                
                Object.assign(lightbox.style, {
                    position: 'fixed',
                    inset: '0',
                    background: 'rgba(5, 5, 5, 0.95)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '10000',
                    opacity: '0',
                    transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'zoom-out'
                });
                
                const lbImg = document.createElement('img');
                lbImg.id = 'pa-lightbox-img';
                Object.assign(lbImg.style, {
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                    transform: 'scale(0.95)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                });
                lightbox.appendChild(lbImg);
                
                lightbox.addEventListener('click', () => {
                    lightbox.style.opacity = '0';
                    lbImg.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        lightbox.style.display = 'none';
                    }, 400);
                });
                
                document.body.appendChild(lightbox);
            }
            
            const lbImg = document.getElementById('pa-lightbox-img');
            lbImg.src = img.src;
            lightbox.style.display = 'flex';
            lightbox.offsetHeight; // force reflow
            
            lightbox.style.opacity = '1';
            lbImg.style.transform = 'scale(1)';
        });
    });

    // Mobile dropdown handler
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownTrigger = dropdown.querySelector('.dropdown-trigger');
        if (!dropdownTrigger) return;

        function isMobile() {
            return window.innerWidth <= 768 || 'ontouchstart' in window;
        }

        dropdownTrigger.addEventListener('touchend', (e) => {
            if (!isMobile()) return;
            e.preventDefault();
            if (dropdown.classList.contains('js-open')) {
                window.location.href = dropdownTrigger.getAttribute('href');
            } else {
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('js-open');
                });
                dropdown.classList.add('js-open');
            }
        }, { passive: false });

        dropdownTrigger.addEventListener('click', (e) => {
            if (!isMobile()) return;
            e.preventDefault();
            if (dropdown.classList.contains('js-open')) {
                window.location.href = dropdownTrigger.getAttribute('href');
            } else {
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('js-open');
                });
                dropdown.classList.add('js-open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('js-open');
            }
        });
    });

    // Support / Donation Overlay
    const supportFab = document.getElementById('support-fab');
    const supportOverlay = document.getElementById('support-overlay');
    const supportClose = document.getElementById('support-close');

    function openSupport() {
        if (supportOverlay) supportOverlay.classList.add('open');
    }

    function closeSupport() {
        if (supportOverlay) supportOverlay.classList.remove('open');
    }

    if (supportFab) {
        supportFab.addEventListener('click', openSupport);
    }

    if (supportClose) {
        supportClose.addEventListener('click', closeSupport);
    }

    if (supportOverlay) {
        supportOverlay.addEventListener('click', (e) => {
            if (e.target === supportOverlay) closeSupport();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSupport();
        });
    }

    // Nav pill sliding animation
    const nav = document.querySelector('nav');
    const pill = document.querySelector('.nav-pill');
    const pillEase = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const pillDuration = 350;

    function getActiveLink() {
        if (!nav) return null;
        return nav.querySelector('a.active') || nav.querySelector('.dropdown-trigger.active');
    }

    function getPillRect(el) {
        const navRect = nav.getBoundingClientRect();
        const linkRect = el.getBoundingClientRect();
        return {
            x: linkRect.left - navRect.left - 5,
            w: linkRect.width
        };
    }

    function animatePill(fromX, fromW, toX, toW, callback) {
        pill.animate([
            { transform: `translateX(${fromX}px)`, width: `${fromW}px` },
            { transform: `translateX(${toX}px)`, width: `${toW}px` }
        ], {
            duration: pillDuration,
            easing: pillEase,
            fill: 'forwards'
        }).onfinish = () => {
            pill.style.transform = `translateX(${toX}px)`;
            pill.style.width = `${toW}px`;
            if (callback) callback();
        };
    }

    const active = getActiveLink();
    if (active) {
        const pos = getPillRect(active);
        pill.style.opacity = '1';
        pill.style.transform = `translateX(${pos.x}px)`;
        pill.style.width = `${pos.w}px`;
    }

    nav.querySelectorAll('a').forEach(link => {
        if (link.closest('.dropdown-menu')) return;

        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();

            const currentActive = getActiveLink();
            if (!currentActive || currentActive === link) {
                window.location.href = href;
                return;
            }

            const from = getPillRect(currentActive);
            const to = getPillRect(link);

            animatePill(from.x, from.w, to.x, to.w, () => {
                window.location.href = href;
            });
        });
    });

    window.addEventListener('resize', () => {
        const a = getActiveLink();
        if (a) {
            const pos = getPillRect(a);
            pill.style.transform = `translateX(${pos.x}px)`;
            pill.style.width = `${pos.w}px`;
        }
    });

    // Translate nav items
    function translateNav() {
        if (typeof I18n === 'undefined') return;
        const navMap = {
            'HOME': 'nav.home',
            'CONTENT': 'nav.content',
            'BLOG': 'nav.blog',
            'ABOUT': 'nav.about'
        };
        document.querySelectorAll('nav a, .dropdown-trigger').forEach(link => {
            // Use stored key if available, otherwise detect from current text
            let key = link.dataset.navKey;
            if (!key) {
                const text = link.textContent.trim().split('\n')[0].trim();
                if (navMap[text]) {
                    key = text;
                    link.dataset.navKey = key;
                }
            }
            if (key && navMap[key]) {
                const span = link.childNodes[0];
                if (span && span.nodeType === 3) {
                    span.textContent = I18n.t(navMap[key]) + ' ';
                }
            }
        });
        requestAnimationFrame(() => {
            const a = getActiveLink();
            if (a && pill) {
                const pos = getPillRect(a);
                pill.style.transform = `translateX(${pos.x}px)`;
                pill.style.width = `${pos.w}px`;
            }
        });
    }
});

window.showToast = function(message) {
    let toast = document.getElementById('pa-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'pa-toast';
        document.body.appendChild(toast);
    }
    
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        color: '#f5f5f5',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 20px',
        borderRadius: '12px',
        fontSize: '10px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontWeight: '800',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none'
    });
    
    toast.textContent = message;
    toast.offsetHeight; // trigger reflow
    
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
};

window.copyText = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        window.showToast("Hash copied!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
};
