document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll behavior (Hide on scroll down, show on scroll up)
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Mock vehicle selector
    const goBtn = document.querySelector('.btn-go');
    if (goBtn) {
        goBtn.addEventListener('click', () => {
            alert('Loading specific hybrid diagnostics protocol...');
        });
    }

    // FAQ Accordion Logic
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Get the corresponding content panel
            const content = this.nextElementSibling;
            
            // Toggle max-height for smooth opening/closing
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            
            // Optional: Close other open FAQs when one is clicked
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== this && otherBtn.classList.contains('active')) {
                    otherBtn.classList.remove('active');
                    otherBtn.nextElementSibling.style.maxHeight = null;
                }
            });
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    function toggleSidebar() {
        if (mobileSidebar && sidebarOverlay) {
            mobileSidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('open');
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    if (sidebarLinks) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileSidebar && sidebarOverlay) {
                    mobileSidebar.classList.remove('open');
                    sidebarOverlay.classList.remove('open');
                }
            });
        });
    }

    // FAQ Modal Logic
    const faqModal = document.getElementById('faqModal');
    const faqFooterBtn = document.getElementById('faqFooterBtn');
    const faqSidebarBtn = document.getElementById('faqSidebarBtn');
    const closeFaqModal = document.getElementById('closeFaqModal');

    function openFaqModal(e) {
        if(e) e.preventDefault();
        faqModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Also close sidebar if it was opened from there
        if (mobileSidebar) mobileSidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('open');
    }

    function closeFaqModalFunc() {
        faqModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if(faqFooterBtn) faqFooterBtn.addEventListener('click', openFaqModal);
    if(faqSidebarBtn) faqSidebarBtn.addEventListener('click', openFaqModal);
    if(closeFaqModal) closeFaqModal.addEventListener('click', closeFaqModalFunc);

    // Close modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === faqModal) {
            closeFaqModalFunc();
        }
    });

    // Auto Carousels with Dots
    const carousels = document.querySelectorAll('.reviews-grid');
    
    carousels.forEach(grid => {
        // Create dots container
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        grid.parentNode.insertBefore(dotsContainer, grid.nextSibling);
        
        const items = grid.children;
        const numItems = items.length;
        if (numItems === 0) return;
        
        // Create dots
        for (let i = 0; i < numItems; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(grid).gap || 0);
                grid.scrollTo({
                    left: itemWidth * i,
                    behavior: 'smooth'
                });
            });
            
            dotsContainer.appendChild(dot);
        }
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        
        // Update active dot on scroll
        grid.addEventListener('scroll', () => {
            const scrollLeft = grid.scrollLeft;
            const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(grid).gap || 0);
            const activeIndex = Math.min(Math.max(Math.round(scrollLeft / itemWidth), 0), numItems - 1);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        });
        
        // Auto play
        let autoScroll = setInterval(scrollNext, 4000); // 4 seconds delay
        
        function scrollNext() {
            const scrollLeft = grid.scrollLeft;
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(grid).gap || 0);
            
            if (scrollLeft >= maxScroll - 10) {
                grid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                grid.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }
        
        // Pause on hover/touch
        grid.addEventListener('mouseenter', () => clearInterval(autoScroll));
        grid.addEventListener('mouseleave', () => autoScroll = setInterval(scrollNext, 4000));
        grid.addEventListener('touchstart', () => clearInterval(autoScroll));
        grid.addEventListener('touchend', () => autoScroll = setInterval(scrollNext, 4000));
    });

    // Service Card Slideshow Logic
    const serviceSlideshows = document.querySelectorAll('.service-slideshow');
    
    serviceSlideshows.forEach(slideshow => {
        const images = slideshow.querySelectorAll('img');
        if (images.length <= 1) return;
        
        let currentIndex = 0;
        
        setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }, 3000); // 3 seconds interval
    });

    // Click-to-play video thumbnails (YouTube and Local)
    const initVideoScripts = () => {
        document.querySelectorAll('.yt-thumb').forEach(thumb => {
            // Remove old listeners if any (cleanup)
            const newThumb = thumb.cloneNode(true);
            thumb.parentNode.replaceChild(newThumb, thumb);

            newThumb.addEventListener('click', function (e) {
                e.preventDefault();
                const videoId = this.getAttribute('data-videoid');
                const localVideo = this.getAttribute('data-video');
                
                if (localVideo) {
                    // Create local video element
                    const video = document.createElement('video');
                    video.setAttribute('src', localVideo);
                    video.setAttribute('controls', 'true');
                    video.setAttribute('autoplay', 'true');
                    video.setAttribute('playsinline', 'true');
                    
                    video.style.position = 'absolute';
                    video.style.top = '0';
                    video.style.left = '0';
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    
                    this.innerHTML = '';
                    this.appendChild(video);
                } else if (videoId) {
                    // Create YouTube iframe
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`);
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                    iframe.setAttribute('allowfullscreen', 'true');
                    
                    iframe.style.position = 'absolute';
                    iframe.style.top = '0';
                    iframe.style.left = '0';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    
                    this.innerHTML = '';
                    this.appendChild(iframe);
                }
                
                // Cleanup styling
                this.classList.remove('yt-thumb');
                this.style.cursor = 'default';
            }, { once: true });
        });
    };

    initVideoScripts();

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Preloader fade out
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            // Wait for the faster 1.2s text-fill animation then fade out
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 1500);
        }
    });
});
