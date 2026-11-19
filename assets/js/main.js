/**
 * HOÀNG THỐNG NHẤT - HỆ SINH THÁI GIẢI PHÁP DOANH NGHIỆP & HỘ KINH DOANH
 * Chuyên viên: Trương Phước Hoàng (Viettel Đồng Nai)
 * Hotline/Zalo: 08 1789 1789 - Email: hoangtp2@viettel.com.vn / cskhVietteldni@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initServiceFilter();
  initPricingTabs();
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
        const category = card.getAttribute('data-category') || '';
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

/* ================= 3. OFFICIAL PRICING TABS ================= */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab-btn');
  const panes = document.querySelectorAll('.pricing-tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ================= 4. INTERACTIVE CALCULATOR ================= */
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
      if (checkbox && checkbox.checked) {
        item.classList.add('selected');
        const price = parseInt(item.getAttribute('data-price'), 10) || 0;
        const name = item.getAttribute('data-name');
        subtotal += price;
        selectedServices.push({ name, price });
      } else {
        item.classList.remove('selected');
      }
    });

    // Combo discounts
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
        if (cb) cb.checked = !cb.checked;
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

/* ================= 5. FAQ ACCORDION ================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ================= 6. CONSULTATION MODAL ================= */
function initConsultationModal() {
  const modal = document.getElementById('consultModal');
  const closeBtn = document.querySelector('.modal-close');
  const consultTriggers = document.querySelectorAll('.btn-consult-trigger');
  const serviceSelect = document.getElementById('modalServiceSelect');

  consultTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        let found = false;
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName || serviceSelect.options[i].text.includes(serviceName)) {
            serviceSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          serviceSelect.value = serviceName;
        }
      }
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
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

/* ================= 7. FORM SUBMISSIONS ================= */
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

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    form.reset();

    showToast('✓ Cảm ơn bạn! Trương Phước Hoàng đã tiếp nhận thông tin và sẽ liên hệ trong 5 phút!');
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

/* ================= 8. BACK TO TOP ================= */
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
