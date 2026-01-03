// Toggle Table of Contents
function toggleTOC(element) {
    if (!element) return;
    const toc = element.closest('.table-of-contents');
    if (toc) {
        toc.classList.toggle('collapsed');
        // Force reflow for better animation
        void toc.offsetHeight;
    }
}

// Add event listeners for TOC toggle (for better mobile support)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toc-toggle').forEach(toggle => {
        // Remove onclick and use addEventListener instead
        toggle.onclick = null;
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const toc = this.closest('.table-of-contents');
            if (toc) {
                toc.classList.toggle('collapsed');
                // Force reflow
                void toc.offsetHeight;
            }
        });
        
        // Support touch events for mobile
        toggle.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        toggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const toc = this.closest('.table-of-contents');
            if (toc) {
                toc.classList.toggle('collapsed');
                // Force reflow
                void toc.offsetHeight;
            }
        });
    });
    
    // Set default state: collapsed on mobile
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.table-of-contents').forEach(toc => {
            toc.classList.add('collapsed');
        });
    }
    
    // Auto-hide TOC when scrolling down
    let lastScrollTop = 0;
    let scrollTimeout;
    const tocElements = document.querySelectorAll('.table-of-contents');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        tocElements.forEach(toc => {
            if (scrollTop > 100) { // After scrolling 100px
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide TOC
                    toc.classList.add('scroll-hidden');
                } else {
                    // Scrolling up - show TOC
                    toc.classList.remove('scroll-hidden');
                }
            } else {
                // Near top - always show
                toc.classList.remove('scroll-hidden');
            }
        });
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true, capture: false });
});

// Download links mapping - Thêm link tải cho các phiên bản 32-bit và 64-bit
// Format: 'ExecutorName (Version) - Bit' : 'download-url'
const downloadLinks = {
    // PunkX
    'PunkX V2.702 (Quốc Tế) - 32': '#', // Thay bằng link tải 32-bit
    'PunkX V2.702 (Quốc Tế) - 64': '#', // Thay bằng link tải 64-bit (hoặc dùng href trong HTML)
    'PunkX V2.702 (VNG Chính Thức) - 32': '#',
    'PunkX V2.702 (VNG Chính Thức) - 64': '#',
    // DeltaX
    'DeltaX V2.702 (Quốc Tế) - 32': '#',
    'DeltaX V2.702 (Quốc Tế) - 64': '#',
    'DeltaX V2.702 (VNG Login) - 32': '#',
    'DeltaX V2.702 (VNG Login) - 64': '#',
    'DeltaX V2.702 (VNG 12+) - 32': '#',
    'DeltaX V2.702 (VNG 12+) - 64': '#',
    // FluxusZ
    'FluxusZ V2.702 (Quốc Tế) - 32': '#',
    'FluxusZ V2.702 (Quốc Tế) - 64': '#',
    'FluxusZ V2.702 (VNG Chính Thức) - 32': '#',
    'FluxusZ V2.702 (VNG Chính Thức) - 64': '#',
    // Neutron
    'Neutron V2.702 (VNG Chính Thức) - 32': '#',
    'Neutron V2.702 (VNG Chính Thức) - 64': '#'
};

// Executor link functionality
document.querySelectorAll('.executor-link.bit-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const executorName = this.getAttribute('data-name');
        const bit = this.getAttribute('data-bit');
        const baseName = this.getAttribute('data-base');
        
        // Lấy link từ href attribute trước (nếu đã được set trong HTML)
        let downloadUrl = this.getAttribute('href');
        
        // Nếu href là # hoặc rỗng, tìm trong downloadLinks object
        if (!downloadUrl || downloadUrl === '#') {
            const linkKey = `${executorName} - ${bit}`;
            downloadUrl = downloadLinks[linkKey] || '#';
        }
        
        if (downloadUrl === '#') {
            showNotification('Link tải chưa được cấu hình. Vui lòng liên hệ admin!', 'info');
            return;
        }
        
        // Tạo tên file download
        const fileName = `${baseName}_V2.702_${bit}bit_${executorName.split('(')[1].split(')')[0].trim().replace(/\s+/g, '_')}.apk`;
        
        // Show confirmation
        if (confirm(`Bạn có muốn tải ${executorName} (${bit}-bit) ngay bây giờ không?`)) {
            // Open download link in new tab or trigger download
            if (downloadUrl.startsWith('http')) {
                window.open(downloadUrl, '_blank');
                showNotification(`Đang tải ${executorName} (${bit}-bit) cho Android... Vui lòng kiểm tra thư mục Downloads trên điện thoại!`, 'success');
            } else {
                // If it's a file path or other format
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.download = fileName;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                showNotification(`Đang tải ${executorName} (${bit}-bit) cho Android... Vui lòng kiểm tra thư mục Downloads trên điện thoại!`, 'success');
            }
        }
    });
});


// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href') || '';
        if (!href || href === '#' || href.trim() === '') {
            return;
        }
        e.preventDefault();
        let target = null;
        try {
            target = document.querySelector(href);
        } catch (err) {
            target = null;
        }
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation - Only for desktop/larger screens to prevent issues on mobile
if (window.innerWidth > 768) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once visible to save resources
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    function activateTab(tabEl) {
        const targetTab = tabEl.getAttribute('data-tab');
        if (!targetTab) return;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        tabEl.classList.add('active');
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
            const y = Math.max(0, targetContent.offsetTop - 20);
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
    window.switchTab = function(tabName) {
        const tabEl = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (tabEl) {
            activateTab(tabEl);
        }
    };
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function(e) { e.preventDefault(); activateTab(this); });
        tab.addEventListener('pointerdown', function(e) { e.preventDefault(); activateTab(this); });
        tab.addEventListener('touchend', function(e) { 
            e.preventDefault(); 
            activateTab(this); 
        }, { passive: true });
    });
});

document.addEventListener('click', function(e) {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation();
    const targetTab = tab.getAttribute('data-tab');
    if (!targetTab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    tab.classList.add('active');
    const targetContent = document.getElementById(`${targetTab}-tab`);
    if (targetContent) {
        targetContent.classList.add('active');
        const y = Math.max(0, targetContent.offsetTop - 20);
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}, true);

// Table of Contents smooth scroll
document.querySelectorAll('.table-of-contents a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 20; // Offset for sticky header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Highlight active link
            document.querySelectorAll('.table-of-contents a').forEach(a => {
                a.style.background = '';
                a.style.color = '';
                a.style.borderLeftColor = '';
            });
            this.style.background = '#f0f4ff';
            this.style.color = '#667eea';
            this.style.borderLeftColor = '#667eea';
        }
    });
});

// Update active TOC link on scroll
let sections = document.querySelectorAll('section[id]');
let tocLinks = document.querySelectorAll('.table-of-contents a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    tocLinks.forEach(link => {
        link.style.background = '';
        link.style.color = '';
        link.style.borderLeftColor = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.background = '#f0f4ff';
            link.style.color = '#667eea';
            link.style.borderLeftColor = '#667eea';
        }
    });
});

// Guide link and Contact link to switch tab and scroll to section
document.querySelectorAll('.guide-link[data-tab], .promo-item[data-tab], #contact-link[data-tab]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetTab = this.getAttribute('data-tab');
        const targetSection = this.getAttribute('data-section');
        
        // Switch to target tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const targetTabElement = document.querySelector(`.tab[data-tab="${targetTab}"]`);
        const targetContent = document.getElementById(`${targetTab}-tab`);
        
        if (targetTabElement && targetContent) {
            targetTabElement.classList.add('active');
            targetContent.classList.add('active');
            
            // Scroll to target section after tab switch
            setTimeout(() => {
                const sectionElement = document.getElementById(targetSection);
                if (sectionElement) {
                    const offsetTop = sectionElement.offsetTop - 20;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    });
});

// Toggle script description expand/collapse
function toggleScriptDesc(button) {
    const wrapper = button.closest('.script-desc-wrapper');
    if (wrapper) {
        wrapper.classList.toggle('expanded');
        const readMoreText = button.querySelector('.read-more-text');
        if (wrapper.classList.contains('expanded')) {
            readMoreText.textContent = 'Thu gọn';
        } else {
            readMoreText.textContent = 'Xem thêm';
        }
    }
}

// Auto show "Xem thêm" button if content is long
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.script-desc-wrapper').forEach(wrapper => {
        const desc = wrapper.querySelector('.script-desc');
        if (desc && desc.scrollHeight > desc.offsetHeight) {
            // Content is longer than 3 lines, show read more button
            const readMoreBtn = wrapper.querySelector('.read-more-btn');
            if (!readMoreBtn) {
                const btn = document.createElement('button');
                btn.className = 'read-more-btn';
                btn.innerHTML = '<span class="read-more-text">Xem thêm</span><i class="fas fa-chevron-down"></i>';
                btn.onclick = function() { toggleScriptDesc(this); };
                wrapper.appendChild(btn);
            }
        }
    });
});

// Script download buttons
document.querySelectorAll('.script-download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const scriptType = this.getAttribute('data-script');
        const scriptName = this.closest('.script-card').querySelector('h3').textContent;
        
        // Lấy link từ href attribute trước
        let downloadUrl = this.getAttribute('href');
        
        // Nếu href là # hoặc rỗng, tìm trong scriptLinks object
        if (!downloadUrl || downloadUrl === '#') {
            const scriptLinks = {
                'gameplay': '#',
                'ui': '#',
                'security': '#',
                'utility': '#',
                'economy': '#',
                'premium': '#'
            };
            downloadUrl = scriptLinks[scriptType] || '#';
        }
        
        if (downloadUrl === '#') {
            showNotification('Link tải script chưa được cấu hình. Vui lòng liên hệ admin!', 'info');
            return;
        }
        
        if (confirm(`Bạn có muốn tải ${scriptName} ngay bây giờ không?`)) {
            if (downloadUrl.startsWith('http')) {
                window.open(downloadUrl, '_blank');
                showNotification(`Đang tải ${scriptName}... Vui lòng kiểm tra thư mục Downloads!`, 'success');
            }
        }
    });
});

// Copy script buttons
document.addEventListener('click', function(e) {
    const copyBtn = e.target.closest('.copy-script-btn');
    if (copyBtn) {
        e.preventDefault();
        const scriptText = copyBtn.getAttribute('data-script-code');
        const scriptName = copyBtn.closest('.script-card').querySelector('h3').textContent;
        
        if (scriptText) {
            navigator.clipboard.writeText(scriptText).then(() => {
                showNotification(`Đã copy script ${scriptName}!`, 'success');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = scriptText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showNotification(`Đã copy script ${scriptName}!`, 'success');
                } catch (err) {
                    showNotification('Không thể copy script. Vui lòng copy thủ công!', 'info');
                }
                document.body.removeChild(textArea);
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.marquee-track');
    if (track) {
        const items = Array.from(track.children);
        const shuffled = items.sort(() => Math.random() - 0.5);
        track.innerHTML = '';
        shuffled.forEach(el => track.appendChild(el));
        shuffled.forEach(el => track.appendChild(el.cloneNode(true)));
    }
    document.querySelectorAll('.promo-item[data-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            const targetSection = this.getAttribute('data-section');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const targetTabElement = document.querySelector(`.tab[data-tab="${targetTab}"]`);
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetTabElement && targetContent) {
                targetTabElement.classList.add('active');
                targetContent.classList.add('active');
                setTimeout(() => {
                    if (targetSection) {
                        const sectionElement = document.getElementById(targetSection);
                        if (sectionElement) {
                            const offsetTop = sectionElement.offsetTop - 20;
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        }
                    }
                }, 300);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tickerTrack = document.querySelector('.updates-track');
    if (tickerTrack) {
        const items = Array.from(tickerTrack.children);
        if (items.length) {
            const shuffled = items.sort(() => Math.random() - 0.5);
            tickerTrack.innerHTML = '';
            shuffled.forEach(el => tickerTrack.appendChild(el));
            shuffled.forEach(el => tickerTrack.appendChild(el.cloneNode(true)));
        }
        document.querySelectorAll('.update-item[data-tab]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');
                const targetSection = this.getAttribute('data-section');
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                const targetTabElement = document.querySelector(`.tab[data-tab="${targetTab}"]`);
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetTabElement && targetContent) {
                    targetTabElement.classList.add('active');
                    targetContent.classList.add('active');
                    setTimeout(() => {
                        if (targetSection) {
                            const sectionElement = document.getElementById(targetSection);
                            if (sectionElement) {
                                const offsetTop = sectionElement.offsetTop - 20;
                                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                            }
                        }
                    }, 300);
                }
            });
        });
    }
    const newsSpan = document.querySelector('.news-banner .news-content span');
    const messages = [
        'Bản Tin: Cập nhật script mới mỗi ngày, trải nghiệm mượt!',
        'Bản Tin: Executor Android V2.702 tối ưu, tốc độ vượt trội!',
        'Bản Tin: Vượt link an toàn, không mã độc, không lừa đảo!',
        'Bản Tin: Top #1 Roblox Script VN – 10k+ người dùng tin tưởng!'
    ];
    if (newsSpan) {
        let idx = 0;
        setInterval(() => {
            newsSpan.textContent = messages[idx];
            idx = (idx + 1) % messages.length;
        }, 6000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const tierButtons = document.querySelectorAll('.tier-btn');
    const searchInput = document.getElementById('script-search');
    function applyFilters() {
        const activeBtn = document.querySelector('.tier-btn.active');
        const tier = activeBtn ? activeBtn.getAttribute('data-tier') : 'all';
        const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const cards = document.querySelectorAll('#scripts-download .scripts-grid .script-card');
        cards.forEach(card => {
            const cardTierAttr = card.getAttribute('data-tier');
            const isPremiumVisual = !!card.querySelector('.premium-badge');
            const hasPremiumDownload = !!card.querySelector('.script-download-btn.premium');
            const cardTier = cardTierAttr ? cardTierAttr : ((isPremiumVisual || hasPremiumDownload) ? 'premium' : 'regular');
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            const desc = card.querySelector('.script-desc') ? card.querySelector('.script-desc').textContent.toLowerCase() : '';
            const tierMatch = tier === 'all' || cardTier === tier;
            const textMatch = !q || title.includes(q) || desc.includes(q);
            card.style.display = tierMatch && textMatch ? '' : 'none';
        });
    }
    tierButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            tierButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    applyFilters();
    const newsClose = document.querySelector('.news-banner .close-btn');
    if (newsClose) {
        newsClose.addEventListener('click', function() {
            const banner = this.closest('.news-banner');
            if (banner) banner.remove();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const list = document.querySelector('.image-news .image-list');
    const prev = document.querySelector('.image-news .prev');
    const next = document.querySelector('.image-news .next');
    if (list && prev && next) {
        function scrollItem(dir) {
            const firstItem = list.querySelector('.image-item');
            const gap = parseFloat(getComputedStyle(list).gap || '0');
            const itemWidth = firstItem ? firstItem.getBoundingClientRect().width + gap : 320;
            list.scrollBy({ left: dir * itemWidth, behavior: 'smooth' });
        }
        prev.addEventListener('click', () => scrollItem(-1));
        next.addEventListener('click', () => scrollItem(1));
        let timer = null;
        function step() {
            const max = list.scrollWidth - list.clientWidth;
            const threshold = 8;
            if (list.scrollLeft >= max - threshold) {
                list.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollItem(1);
            }
        }
        function start() {
            if (timer) clearInterval(timer);
            timer = setInterval(step, 5000);
        }
        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
        start();
        const container = document.querySelector('.image-news');
        if (container) {
            container.addEventListener('mouseenter', stop);
            container.addEventListener('mouseleave', start);
            container.addEventListener('touchstart', stop, { passive: true });
            container.addEventListener('touchend', start, { passive: true });
        }
    }
    document.querySelectorAll('.image-item[data-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            const targetSection = this.getAttribute('data-section');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const targetTabElement = document.querySelector(`.tab[data-tab="${targetTab}"]`);
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetTabElement && targetContent) {
                targetTabElement.classList.add('active');
                targetContent.classList.add('active');
                setTimeout(() => {
                    if (targetSection) {
                        const sectionElement = document.getElementById(targetSection);
                        if (sectionElement) {
                            const offsetTop = sectionElement.offsetTop - 20;
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        }
                    }
                }, 300);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.image-news .image-item .image-thumb img');
    function makeBanner(w, h, cfg) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const g = c.getContext('2d');
        const grd = g.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, cfg.bg1);
        grd.addColorStop(1, cfg.bg2);
        g.fillStyle = grd;
        g.fillRect(0, 0, w, h);
        g.globalAlpha = 0.15;
        g.fillStyle = cfg.accent1;
        for (let x = 0; x < w; x += 20) {
            g.fillRect(x, 0, 1, h);
        }
        for (let y = 0; y < h; y += 20) {
            g.fillRect(0, y, w, 1);
        }
        g.globalAlpha = 0.25;
        g.strokeStyle = cfg.accent2;
        g.lineWidth = 2;
        for (let i = -h; i < w; i += 40) {
            g.beginPath();
            g.moveTo(i, 0);
            g.lineTo(i + h, h);
            g.stroke();
        }
        g.globalAlpha = 0.35;
        const cx = w * 0.5, cy = h * 0.5;
        const r = Math.min(w, h) * 0.4;
        const radial = g.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        radial.addColorStop(0, cfg.glow);
        radial.addColorStop(1, 'transparent');
        g.fillStyle = radial;
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI * 2);
        g.fill();
        g.globalAlpha = 1;
        g.fillStyle = cfg.titleColor;
        g.font = `${Math.round(h * 0.14)}px Segoe UI, Tahoma, sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.shadowColor = cfg.shadow;
        g.shadowBlur = 20;
        g.fillText(cfg.title, cx, cy);
        try {
            return c.toDataURL('image/webp', 0.92);
        } catch (e) {
            return c.toDataURL('image/png');
        }
    }
    if (items.length) {
        const presets = [
            { title: 'Executor Update', bg1: '#667eea', bg2: '#36d1dc', accent1: '#ffffff', accent2: '#f5a623', glow: 'rgba(255,255,255,0.35)', titleColor: '#ffffff', shadow: 'rgba(0,0,0,0.6)' },
            { title: 'Script Hot Premium', bg1: '#764ba2', bg2: '#f5576c', accent1: '#ffffff', accent2: '#f5a623', glow: 'rgba(255,245,200,0.35)', titleColor: '#ffffff', shadow: 'rgba(0,0,0,0.6)' },
            { title: 'Hướng dẫn vượt link', bg1: '#28a745', bg2: '#36d1dc', accent1: '#ffffff', accent2: '#667eea', glow: 'rgba(255,255,255,0.3)', titleColor: '#ffffff', shadow: 'rgba(0,0,0,0.6)' },
            { title: 'Sự kiện & Khuyến mại', bg1: '#f6d365', bg2: '#fda085', accent1: '#ffffff', accent2: '#f5576c', glow: 'rgba(255,255,255,0.3)', titleColor: '#ffffff', shadow: 'rgba(0,0,0,0.6)' }
        ];
        items.forEach((img, idx) => {
            const w = img.naturalWidth || 600;
            const h = img.naturalHeight || 220;
            const p = presets[idx % presets.length];
            const data = makeBanner(w, h, p);
            img.src = data;
        });
    }
});

// Mouse-following glow effect
document.addEventListener('DOMContentLoaded', function() {
    const mouseGlow = document.querySelector('.mouse-glow');
    if (mouseGlow) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseGlow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', function() {
            mouseGlow.style.opacity = '0';
        });
        
        // Smooth animation using requestAnimationFrame
        function animateGlow() {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            
            mouseGlow.style.left = currentX + 'px';
            mouseGlow.style.top = currentY + 'px';
            
            requestAnimationFrame(animateGlow);
        }
        
        animateGlow();
    }
    
    // Ensure scroll is working
    console.log('Scroll enabled - body overflow:', getComputedStyle(document.body).overflow);
    
    // Test scroll functionality
    let scrollTest = 0;
    window.addEventListener('scroll', function() {
        scrollTest++;
        if (scrollTest % 100 === 0) {
            console.log('Scroll position:', window.pageYOffset);
        }
    }, { passive: true });
});

// Device Info Bar Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Device detection functions
    function getDeviceInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        // Detect device type
        let deviceType = 'Unknown';
        if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
            deviceType = /iPad/.test(userAgent) ? 'Tablet' : 'Mobile';
        } else if (/Windows|Mac|Linux/.test(platform)) {
            deviceType = 'Desktop';
        }
        
        // Detect browser
        let browser = 'Unknown';
        if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
        else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
        else if (userAgent.indexOf('Opera') > -1) browser = 'Opera';
        
        // Detect OS
        let os = 'Unknown';
        if (userAgent.indexOf('Windows') > -1) os = 'Windows';
        else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
        else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
        else if (userAgent.indexOf('Android') > -1) os = 'Android';
        else if (userAgent.indexOf('iOS') > -1) os = 'iOS';
        
        // Detect connection
        let connection = 'Unknown';
        if (navigator.connection) {
            const conn = navigator.connection;
            connection = conn.effectiveType ? conn.effectiveType : 'Unknown';
            if (connection === '4g') connection = '4G (Nhanh)';
            else if (connection === '3g') connection = '3G (Trung bình)';
            else if (connection === '2g') connection = '2G (Chậm)';
            else if (connection === 'wifi') connection = 'WiFi (Nhanh)';
        } else {
            connection = navigator.onLine ? 'Online' : 'Offline';
        }
        
        return { deviceType, browser, os, connection };
    }
    
    // Update device info display
    function updateDeviceInfo() {
        const info = getDeviceInfo();
        
        // Add loading animation
        document.querySelectorAll('.device-value').forEach(el => {
            el.classList.add('loading');
        });
        
        // Simulate loading delay for effect
        setTimeout(() => {
            document.getElementById('device-type').textContent = info.deviceType;
            document.getElementById('browser-info').textContent = info.browser;
            document.getElementById('os-info').textContent = info.os;
            document.getElementById('connection-info').textContent = info.connection;
            
            // Remove loading animation
            document.querySelectorAll('.device-value').forEach(el => {
                el.classList.remove('loading');
            });
        }, 800);
    }
    
    // Update time
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Toggle device info bar
    function toggleDeviceInfo() {
        const bar = document.querySelector('.device-info-bar');
        const toggleBtn = document.getElementById('toggle-device-info');
        const icon = toggleBtn.querySelector('i');
        const text = toggleBtn.querySelector('span');
        
        bar.classList.toggle('collapsed');
        
        if (bar.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-down';
            text.textContent = 'Mở rộng';
        } else {
            icon.className = 'fas fa-chevron-up';
            text.textContent = 'Thu gọn';
        }
    }
    
    // Refresh device info
    function refreshDeviceInfo() {
        const refreshBtn = document.getElementById('refresh-device-info');
        const icon = refreshBtn.querySelector('i');
        
        // Add rotation animation
        icon.style.animation = 'spin 1s linear';
        
        updateDeviceInfo();
        
        // Remove rotation after animation
        setTimeout(() => {
            icon.style.animation = '';
        }, 1000);
    }
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    updateDeviceInfo();
    updateTime();
    setInterval(updateTime, 1000);
    
    // Event listeners
    document.getElementById('toggle-device-info').addEventListener('click', toggleDeviceInfo);
    document.getElementById('refresh-device-info').addEventListener('click', refreshDeviceInfo);
    
    // Update connection status when online/offline changes
    window.addEventListener('online', updateDeviceInfo);
    window.addEventListener('offline', updateDeviceInfo);
    
    // Monitor connection changes
    if (navigator.connection) {
        navigator.connection.addEventListener('change', updateDeviceInfo);
    }
});

// Reviews functionality
document.addEventListener('DOMContentLoaded', function() {
    // Rating input functionality
    const ratingStars = document.querySelectorAll('.rating-input i');
    let selectedRating = 0;
    
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateRatingDisplay(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            updateRatingDisplay(hoverRating);
        });
    });
    
    document.querySelector('.rating-input').addEventListener('mouseleave', function() {
        updateRatingDisplay(selectedRating);
    });
    
    function updateRatingDisplay(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }
    
    // Submit review functionality
    const submitBtn = document.querySelector('.submit-review-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('review-name').value.trim();
            const content = document.getElementById('review-content').value.trim();
            
            if (!name || !content || selectedRating === 0) {
                showNotification('Vui lòng điền đầy đủ thông tin và chọn đánh giá!', 'info');
                return;
            }
            
            // Create new review element
            const newReview = createReviewElement(name, content, selectedRating);
            const reviewsGrid = document.querySelector('.reviews-grid');
            
            // Add to top of reviews
            reviewsGrid.insertBefore(newReview, reviewsGrid.firstChild);
            
            // Clear form
            document.getElementById('review-name').value = '';
            document.getElementById('review-content').value = '';
            selectedRating = 0;
            updateRatingDisplay(0);
            
            // Show success message
            showNotification('Cảm ơn bạn đã chia sẻ trải nghiệm!', 'success');
            
            // Update stats (optional)
            updateReviewStats();
        });
    }
    
    // Helpful button functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.helpful-btn')) {
            const btn = e.target.closest('.helpful-btn');
            const currentCount = parseInt(btn.textContent.match(/\d+/)[0]);
            btn.innerHTML = `<i class="fas fa-thumbs-up"></i> Hữu ích (${currentCount + 1})`;
            btn.style.background = 'rgba(102,126,234,0.1)';
            btn.style.borderColor = '#667eea';
            btn.style.color = '#667eea';
            btn.disabled = true;
        }
        
        if (e.target.closest('.reply-btn')) {
            showNotification('Tính năng trả lời sẽ sớm được cập nhật!', 'info');
        }
    });
    
    function createReviewElement(name, content, rating) {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.animation = 'reviewSlideIn 0.6s ease-out';
        
        const stars = Array(5).fill(0).map((_, i) => 
            i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
        ).join('');
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <div class="reviewer-name">${name}</div>
                        <div class="review-date">Vừa xong</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${stars}
                </div>
            </div>
            <div class="review-content">
                <p>"${content}"</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn"><i class="fas fa-thumbs-up"></i> Hữu ích (0)</button>
                <button class="reply-btn"><i class="fas fa-reply"></i> Trả lời</button>
            </div>
        `;
        
        return reviewCard;
    }
    
    function updateReviewStats() {
        // Update review count and average rating
        const reviewCount = document.querySelectorAll('.review-card').length;
        const statNumber = document.querySelector('.stat-item:nth-child(2) .stat-number');
        if (statNumber) {
            statNumber.textContent = `${reviewCount}+`;
        }
    }
});
