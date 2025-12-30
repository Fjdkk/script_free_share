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
    }, { passive: true });
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
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
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

// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

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
document.querySelectorAll('.guide-link[data-tab], #contact-link[data-tab]').forEach(link => {
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

