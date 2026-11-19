/**
 * VIETTEL TAMMII - Main JavaScript
 * Interactive Logic for Viettel Telecom Solutions Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initServiceFilter();
  initCalculator();
  initFaqAccordion();
  initConsultationModal();
  initFormSubmit();
  initBackToTop();
});

/* ================= 1. NAVBAR LOGIC ================= */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = hamburgerBtn.querySelector('i') || hamburgerBtn;
      if (navMenu.classList.contains('open')) {
        hamburgerBtn.innerHTML = '✕';
      } else {
        hamburgerBtn.innerHTML = '☰';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.innerHTML = '☰';
      });
    });
  }
}

/* ================= 2. SERVICES TAB FILTER ================= */
function initServiceFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 3. INTERACTIVE CALCULATOR ================= */
const SERVICES_DATA = [
  { id: 'ca', name: 'Chữ ký số Viettel-CA (1 Năm)', price: 1200000, category: 'dn,hkd' },
  { id: 'sinvoice', name: 'Hóa đơn điện tử S-Invoice (500 số)', price: 850000, category: 'dn,hkd' },
  { id: 'tendoo', name: 'Phần mềm bán hàng Tendoo (1 Năm)', price: 1800000, category: 'hkd,dn' },
  { id: 'vcontract', name: 'Hợp đồng điện tử vContract (100 HĐ)', price: 950000, category: 'dn' },
  { id: 'vbhxh', name: 'Phần mềm Kê khai BHXH (1 Năm)', price: 790000, category: 'dn' },
  { id: 'yte-gd', name: 'Phần mềm Y tế - Giáo dục (SMAS/HIS)', price: 2500000, category: 'dn' },
  { id: 'ketoan-hkd', name: 'Kế toán & Kê khai thuế HKD (Quý)', price: 1500000, category: 'hkd' },
  { id: 'gpkd', name: 'Hỗ trợ Đăng ký Giấy phép KD trọn gói', price: 990000, category: 'hkd,dn' },
  { id: 'sim-dep', name: 'Sim Viettel số đẹp (Hotline VIP)', price: 1200000, category: 'dn,hkd' },
  { id: 'wifi-5g', name: 'Internet Cáp quang & WiFi 4G-5G Doanh nghiệp', price: 350000, category: 'dn,hkd' }
];

function initCalculator() {
  const calcItems = document.querySelectorAll('.calc-service-item');
  const selectedList = document.getElementById('calcSelectedList');
  const subtotalEl = document.getElementById('calcSubtotal');
  const discountEl = document.getElementById('calcDiscount');
  const grandTotalEl = document.getElementById('calcGrandTotal');
  const btnCalcSubmit = document.getElementById('btnCalcSubmit');

  if (!calcItems.length) return;

  function updateCalculator() {
    let subtotal = 0;
    const selectedServices = [];

    calcItems.forEach(item => {
      const checkbox = item.querySelector('.calc-checkbox');
      if (checkbox.checked) {
        item.classList.add('selected');
        const price = parseInt(item.getAttribute('data-price'), 10);
        const name = item.getAttribute('data-name');
        subtotal += price;
        selectedServices.push({ name, price });
      } else {
        item.classList.remove('selected');
      }
    });

    // Discount tiers
    let discountPercent = 0;
    if (selectedServices.length === 2) {
      discountPercent = 0.10; // 10%
    } else if (selectedServices.length >= 3) {
      discountPercent = 0.20; // 20% combo discount
    }

    const discountAmount = subtotal * discountPercent;
    const grandTotal = subtotal - discountAmount;

    // Render receipt list
    if (selectedServices.length === 0) {
      selectedList.innerHTML = `<div class="calc-selected-empty">Chưa chọn dịch vụ nào. Hãy click vào dịch vụ bên trái để tính phí!</div>`;
    } else {
      selectedList.innerHTML = selectedServices.map(s => `
        <div class="calc-selected-row">
          <span>${s.name}</span>
          <span class="fw-semibold">${formatCurrency(s.price)}</span>
        </div>
      `).join('');
    }

    subtotalEl.textContent = formatCurrency(subtotal);
    discountEl.textContent = discountPercent > 0 
      ? `-${formatCurrency(discountAmount)} (${discountPercent * 100}%)` 
      : '0 đ';
    grandTotalEl.textContent = formatCurrency(grandTotal);
  }

  calcItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const cb = item.querySelector('.calc-checkbox');
        cb.checked = !cb.checked;
      }
      updateCalculator();
    });
  });

  if (btnCalcSubmit) {
    btnCalcSubmit.addEventListener('click', () => {
      const selected = Array.from(document.querySelectorAll('.calc-checkbox:checked'))
        .map(cb => cb.closest('.calc-service-item').getAttribute('data-name'));
      
      const modal = document.getElementById('consultModal');
      const serviceSelect = document.getElementById('modalServiceSelect');
      const noteInput = document.getElementById('modalNote');
      
      if (modal && serviceSelect) {
        if (selected.length > 0) {
          noteInput.value = `Khách hàng tính phí combo gồm: ${selected.join(', ')}`;
        }
        openModal();
      }
    });
  }

  // Initial calculation
  updateCalculator();
}

function formatCurrency(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

/* ================= 4. FAQ ACCORDION ================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ================= 5. CONSULTATION MODAL ================= */
function initConsultationModal() {
  const modal = document.getElementById('consultModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const consultTriggers = document.querySelectorAll('.btn-consult-trigger');

  if (!modal) return;

  consultTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('modalServiceSelect');
      if (serviceName && serviceSelect) {
        serviceSelect.value = serviceName;
      }
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openModal() {
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ================= 6. FORM SUBMISSIONS ================= */
function initFormSubmit() {
  const contactForm = document.getElementById('mainContactForm');
  const modalForm = document.getElementById('modalContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(contactForm);
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(modalForm);
      closeModal();
    });
  }
}

function handleFormSubmit(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Đang gửi thông tin...';

  // Simulate fast network dispatch
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    form.reset();

    showToast('✓ Cảm ơn bạn! Trương Phước Hoàng đã tiếp nhận thông tin và sẽ gọi lại trong 5 phút!');
  }, 700);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ================= 7. BACK TO TOP ================= */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
