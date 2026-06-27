document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
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
        if (themeIcon) {
            themeIcon.innerText = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.padding = '12px 5%';
                header.style.background = 'var(--glass-bg)';
                header.style.backdropFilter = 'blur(var(--glass-blur))';
                header.style.borderBottom = '1px solid var(--glass-border)';
            } else {
                header.style.padding = '24px 5%';
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
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
    const dropdown = document.querySelector('.dropdown');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    if (dropdown && dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!dropdown.classList.contains('js-open')) {
                    e.preventDefault();
                    dropdown.classList.add('js-open');
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('js-open');
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
