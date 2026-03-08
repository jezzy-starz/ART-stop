/**
 * ART STOP - Professional Art Commission Website
 * Smooth animations and interactive functionality
 */

// ========================================
// DATA & CONFIGURATION
// ========================================

const CONFIG = {
    FORMSPREE_URL: 'https://formspree.io/f/xnjgnqvw',
    YOCO_URL: 'https://pay.yoco.com/jezzy-trades',
    BUSINESS_NAME: 'ART Stop'
};

const SIZES = [
    { id: 'a5', name: 'A5', dims: '148 × 210 mm', canvasCost: 80, timeline: '1-2 weeks' },
    { id: 'a4', name: 'A4', dims: '210 × 297 mm', canvasCost: 120, timeline: '1-2 weeks' },
    { id: 'a3', name: 'A3', dims: '297 × 420 mm', canvasCost: 200, timeline: '2-3 weeks' },
    { id: 'a2', name: 'A2', dims: '420 × 594 mm', canvasCost: 350, timeline: '2-3 weeks' },
    { id: 'a1', name: 'A1', dims: '594 × 841 mm', canvasCost: 600, timeline: '3-4 weeks' },
    { id: '30x40', name: '30×40cm', dims: '300 × 400 mm', canvasCost: 180, timeline: '2-3 weeks' },
    { id: '40x50', name: '40×50cm', dims: '400 × 500 mm', canvasCost: 280, timeline: '2-3 weeks' },
    { id: '50x60', name: '50×60cm', dims: '500 × 600 mm', canvasCost: 400, timeline: '3-4 weeks' }
];

const STYLES = [
    'Realistic', 'Abstract', 'Impressionist', 'Pop Art', 'Minimalist',
    'Oil Painting', 'Watercolor', 'Acrylic', 'Digital Art', 'Portrait',
    'Landscape', 'Modern Art', 'Surrealism', 'Line Art', 'Stippling',
    'Cross-hatching', 'Pastel', 'Graphite', 'Pencil Sketch', 'Charcoal',
    'Ink Drawing', 'Colored Pencil', 'Contemporary', 'Classic', 'Expressionist'
];

const PORTFOLIO_ITEMS = [
    { id: 1, emoji: '🐕', title: 'Golden Retriever Portrait', category: 'pet', type: 'painting' },
    { id: 2, emoji: '🌅', title: 'Sunset Landscape', category: 'landscape', type: 'painting' },
    { id: 3, emoji: '👩', title: 'Family Portrait', category: 'portrait', type: 'drawing' },
    { id: 4, emoji: '🐱', title: 'Cat Sketch', category: 'pet', type: 'drawing' },
    { id: 5, emoji: '🏔️', title: 'Mountain View', category: 'landscape', type: 'painting' },
    { id: 6, emoji: '🎭', title: 'Abstract Faces', category: 'abstract', type: 'painting' }
];

const FAQS = [
    {
        question: 'How long does a commission take?',
        answer: 'Timeline depends on size: Small (A5-A4) takes 1-2 weeks, Medium (A3-A2) takes 2-3 weeks, and Large (A1+) takes 3-4 weeks. This excludes shipping time.'
    },
    {
        question: 'Can I see the artwork before it\'s shipped?',
        answer: 'Yes! We send a high-resolution digital preview via email for your approval before shipping. You can request minor adjustments at this stage.'
    },
    {
        question: 'What if I don\'t like the final artwork?',
        answer: 'We work closely with you throughout the process to ensure satisfaction. Minor revisions are included. Due to the custom nature, returns are only accepted for damaged items.'
    },
    {
        question: 'Do you ship internationally?',
        answer: 'Currently we only ship within South Africa. For international orders, please contact us directly for a custom quote.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards through our secure Yoco payment gateway. Payment is required to confirm your commission.'
    },
    {
        question: 'Can you paint from multiple photos?',
        answer: 'Absolutely! You can provide multiple reference images and describe how you\'d like them combined. Add details in the description field.'
    }
];

const FEES = {
    painting: 50,
    drawing: 20
};

const DELIVERY_COSTS = {
    standard: 80,
    express: 150,
    pickup: 0
};

// ========================================
// STATE MANAGEMENT
// ========================================

const state = {
    currentStep: 1,
    totalSteps: 5,
    order: {
        medium: null,
        size: null,
        style: null,
        deliveryMethod: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        description: '',
        referenceLink: ''
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const formatPrice = (amount) => `R${amount.toFixed(2)}`;

const showNotification = (message, type = 'success') => {
    const toast = $('#toast');
    const toastMessage = $('#toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const update = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };
    
    update();
};

// ========================================
// PAGE LOADER
// ========================================

const initPageLoader = () => {
    const loader = $('#pageLoader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            initAnimations();
        }, 1500);
    });
};

// ========================================
// SCROLL ANIMATIONS
// ========================================

const initAnimations = () => {
    // Reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate counters
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    animateCounter(counter, target);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    $$('[data-reveal]').forEach(el => observer.observe(el));
    
    // Navbar scroll effect
    const navbar = $('#navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
};

// ========================================
// NAVIGATION
// ========================================

const initNavigation = () => {
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');
    const navLinks = $$('.nav-link');
    
    // Mobile toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active link on scroll
    const sections = $$('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
};

// ========================================
// PORTFOLIO
// ========================================

const initPortfolio = () => {
    const grid = $('#portfolioGrid');
    
    // Render portfolio items
    const renderPortfolio = (filter = 'all') => {
        const items = filter === 'all' 
            ? PORTFOLIO_ITEMS 
            : PORTFOLIO_ITEMS.filter(item => item.type === filter || item.category === filter);
        
        grid.innerHTML = items.map(item => `
            <div class="portfolio-item" data-category="${item.category}" data-type="${item.type}">
                <div class="portfolio-image">${item.emoji}</div>
                <div class="portfolio-overlay">
                    <div class="portfolio-title">${item.title}</div>
                    <div class="portfolio-category">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                </div>
            </div>
        `).join('');
        
        // Animate items
        $$('.portfolio-item').forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, i * 100);
        });
    };
    
    // Filter buttons
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPortfolio(btn.dataset.filter);
        });
    });
    
    renderPortfolio();
};

// ========================================
// COMMISSION FORM
// ========================================

const initCommissionForm = () => {
    renderSizes();
    renderStyles();
    updateProgress();
    updateSummary();
};

const renderSizes = () => {
    const grid = $('#sizeGrid');
    const medium = state.order.medium;
    const fee = medium ? FEES[medium] : 0;
    
    grid.innerHTML = SIZES.map(size => {
        const totalPrice = size.canvasCost + fee;
        return `
            <div class="size-card" onclick="selectSize('${size.id}')" data-size="${size.id}">
                <div class="size-name">${size.name}</div>
                <div class="size-dims">${size.dims}</div>
                <div class="size-price">${formatPrice(totalPrice)}</div>
                <div class="size-note">${size.timeline}</div>
            </div>
        `;
    }).join('');
};

const renderStyles = () => {
    const grid = $('#styleGrid');
    grid.innerHTML = STYLES.map(style => `
        <div class="style-option" onclick="selectStyle('${style}')" data-style="${style}">
            ${style}
        </div>
    `).join('');
};

// Selection functions
window.selectMedium = (medium) => {
    state.order.medium = medium;
    
    // Update UI
    $$('.option-card').forEach(card => card.classList.remove('selected'));
    $(`.option-card[data-value="${medium}"]`)?.classList.add('selected');
    
    // Re-render sizes with updated pricing
    renderSizes();
    updateSummary();
    
    // Auto advance
    setTimeout(() => changeStep(1), 500);
};

window.selectSize = (sizeId) => {
    state.order.size = SIZES.find(s => s.id === sizeId);
    
    $$('.size-card').forEach(card => card.classList.remove('selected'));
    $(`.size-card[data-size="${sizeId}"]`)?.classList.add('selected');
    
    updateSummary();
    setTimeout(() => changeStep(1), 500);
};

window.selectStyle = (style) => {
    state.order.style = style;
    
    $$('.style-option').forEach(option => option.classList.remove('selected'));
    $(`.style-option[data-style="${style}"]`)?.classList.add('selected');
    
    updateSummary();
    setTimeout(() => changeStep(1), 500);
};

window.filterStyles = () => {
    const search = $('#styleSearch').value.toLowerCase();
    
    $$('.style-option').forEach(option => {
        const style = option.dataset.style.toLowerCase();
        option.classList.toggle('hidden', !style.includes(search));
    });
};

window.updateDelivery = () => {
    const method = $('#deliveryMethod').value;
    state.order.deliveryMethod = method;
    updateSummary();
};

// Step navigation
window.changeStep = (direction) => {
    const newStep = state.currentStep + direction;
    
    if (newStep < 1 || newStep > state.totalSteps) return;
    
    // Validation
    if (direction === 1) {
        if (state.currentStep === 1 && !state.order.medium) {
            showNotification('Please select a medium');
            return;
        }
        if (state.currentStep === 2 && !state.order.size) {
            showNotification('Please select a size');
            return;
        }
        if (state.currentStep === 3 && !state.order.style) {
            showNotification('Please select a style');
            return;
        }
        if (state.currentStep === 4) {
            const name = $('#customerName').value;
            const email = $('#customerEmail').value;
            const phone = $('#customerPhone').value;
            const address = $('#deliveryAddress').value;
            const description = $('#description').value;
            const delivery = $('#deliveryMethod').value;
            
            if (!name || !email || !phone || !address || !description || !delivery) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            // Save form data
            state.order.customerName = name;
            state.order.customerEmail = email;
            state.order.customerPhone = phone;
            state.order.deliveryAddress = address;
            state.order.description = description;
            state.order.referenceLink = $('#referenceLink').value;
            state.order.deliveryMethod = delivery;
            
            updateReview();
        }
    }
    
    // Update step
    state.currentStep = newStep;
    
    // Update UI
    $$(`.form-step`).forEach((step, i) => {
        step.classList.toggle('active', i + 1 === state.currentStep);
    });
    
    $$('.step').forEach((step, i) => {
        step.classList.remove('active', 'completed');
        if (i + 1 < state.currentStep) {
            step.classList.add('completed');
        } else if (i + 1 === state.currentStep) {
            step.classList.add('active');
        }
    });
    
    // Update buttons
    $('#prevBtn').style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';
    $('#nextBtn').innerHTML = state.currentStep === state.totalSteps 
        ? `Complete Order <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`
        : `Continue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`;
    
    if (state.currentStep === state.totalSteps) {
        $('#nextBtn').onclick = submitOrder;
    } else {
        $('#nextBtn').onclick = () => changeStep(1);
    }
    
    updateProgress();
    updateSummary();
    
    // Scroll to top of form
    $('#commission').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const updateProgress = () => {
    const progress = (state.currentStep / state.totalSteps) * 100;
    $('#progressFill').style.width = `${progress}%`;
};

const updateSummary = () => {
    const { medium, size, style, deliveryMethod } = state.order;
    
    // Update sidebar
    $('#sumMedium').textContent = medium ? medium.charAt(0).toUpperCase() + medium.slice(1) : '-';
    $('#sumSize').textContent = size ? `${size.name} (${size.dims})` : '-';
    $('#sumStyle').textContent = style || '-';
    $('#sumDelivery').textContent = deliveryMethod 
        ? deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1) 
        : '-';
    
    // Calculate costs
    let artworkCost = 0;
    let fee = 0;
    
    if (size && medium) {
        artworkCost = size.canvasCost;
        fee = FEES[medium];
    }
    
    const deliveryCost = deliveryMethod ? DELIVERY_COSTS[deliveryMethod] : 0;
    const total = artworkCost + fee + deliveryCost;
    
    $('#costArtwork').textContent = formatPrice(artworkCost);
    $('#costFee').textContent = formatPrice(fee);
    $('#costDelivery').textContent = formatPrice(deliveryCost);
    $('#sumTotal').textContent = formatPrice(total);
    
    // Update badge
    $('#summaryBadge').textContent = `Step ${state.currentStep} of ${state.totalSteps}`;
    
    // Update timeline
    const timelineEl = $('#sumTimeline');
    if (size) {
        timelineEl.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Est. completion: ${size.timeline}</span>
        `;
    }
};

const updateReview = () => {
    const { medium, size, style, deliveryMethod, customerName, customerEmail, customerPhone, deliveryAddress } = state.order;
    
    $('#reviewMedium').textContent = medium ? medium.charAt(0).toUpperCase() + medium.slice(1) : '-';
    $('#reviewSize').textContent = size ? `${size.name} (${size.dims})` : '-';
    $('#reviewStyle').textContent = style || '-';
    $('#reviewTimeline').textContent = size ? size.timeline : '-';
    $('#reviewDelivery').textContent = deliveryMethod 
        ? `${deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1)} (${formatPrice(DELIVERY_COSTS[deliveryMethod])})`
        : '-';
    $('#reviewAddress').textContent = deliveryAddress || '-';
    $('#reviewName').textContent = customerName || '-';
    $('#reviewEmail').textContent = customerEmail || '-';
    $('#reviewPhone').textContent = customerPhone || '-';
    
    // Totals
    const artworkCost = size ? size.canvasCost : 0;
    const fee = medium ? FEES[medium] : 0;
    const deliveryCost = deliveryMethod ? DELIVERY_COSTS[deliveryMethod] : 0;
    const total = artworkCost + fee + deliveryCost;
    
    $('#totalSubtotal').textContent = formatPrice(artworkCost + fee);
    $('#totalDelivery').textContent = formatPrice(deliveryCost);
    $('#totalGrand').textContent = formatPrice(total);
};

// ========================================
// FORM SUBMISSION
// ========================================

const submitOrder = async () => {
    const loading = $('#loadingOverlay');
    const modal = $('#successModal');
    
    loading.classList.add('active');
    
    const orderId = `ART-${Date.now()}`;
    const { medium, size, style, deliveryMethod } = state.order;
    const total = size.canvasCost + FEES[medium] + DELIVERY_COSTS[deliveryMethod];
    
    const formData = new FormData();
    formData.append('Order ID', orderId);
    formData.append('Medium', medium);
    formData.append('Size', `${size.name} (${size.dims})`);
    formData.append('Style', style);
    formData.append('Canvas Cost', formatPrice(size.canvasCost));
    formData.append('Service Fee', formatPrice(FEES[medium]));
    formData.append('Delivery Method', `${deliveryMethod} - ${formatPrice(DELIVERY_COSTS[deliveryMethod])}`);
    formData.append('Total', formatPrice(total));
    formData.append('Customer Name', state.order.customerName);
    formData.append('Email', state.order.customerEmail);
    formData.append('Phone', state.order.customerPhone);
    formData.append('Delivery Address', state.order.deliveryAddress);
    formData.append('Description', state.order.description);
    formData.append('Reference Link', state.order.referenceLink || 'None provided');
    formData.append('Timeline', size.timeline);
    formData.append('Order Date', new Date().toLocaleString('en-ZA'));
    
    try {
        const response = await fetch(CONFIG.FORMSPREE_URL, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            loading.classList.remove('active');
            modal.classList.add('active');
            
            // Yoco redirect
            const yocoUrl = `${CONFIG.YOCO_URL}?amount=${total.toFixed(2)}&reference=${orderId}&firstName=${encodeURIComponent(state.order.customerName)}&email=${encodeURIComponent(state.order.customerEmail)}`;
            
            setTimeout(() => {
                window.location.href = yocoUrl;
            }, 3000);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        loading.classList.remove('active');
        showNotification('Error submitting order. Please try again.', 'error');
        console.error(error);
    }
};

// ========================================
// FAQ
// ========================================

const initFAQ = () => {
    const grid = $('#faqGrid');
    
    grid.innerHTML = FAQS.map((faq, i) => `
        <div class="faq-item" data-faq="${i}">
            <button class="faq-question" onclick="toggleFAQ(${i})">
                ${faq.question}
                <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
};

window.toggleFAQ = (index) => {
    const item = $(`[data-faq="${index}"]`);
    const isActive = item.classList.contains('active');
    
    // Close all
    $$('.faq-item').forEach(el => el.classList.remove('active'));
    
    // Open clicked if wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initNavigation();
    initPortfolio();
    initCommissionForm();
    initFAQ();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});