/**
 * Personal Website JavaScript Architecture
 * Single Page Application Router, Blog Manager, Article Reader & Thai Tax Calculator 2026
 * Author: Noppasin Pronsawad
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRouter();
  initAnimatedCounters();
  initDetailModal();
  initBlogModule();
  initTaxCalculator();
  initScrollEffects();
});

/* ==========================================================================
   1. Light / Dark Theme Switcher
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeBtn ? themeBtn.querySelector('.theme-icon') : null;
  
  const savedTheme = localStorage.getItem('apple_resume_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('apple_resume_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

/* ==========================================================================
   2. SPA Client Router
   ========================================================================== */
function initRouter() {
  const navLinks = document.querySelectorAll('.nav-link[data-route]');
  const views = document.querySelectorAll('.page-view');

  function handleRoute() {
    let hash = window.location.hash.replace('#', '') || 'home';

    // Map route aliases
    let targetViewId = `${hash}-view`;
    if (hash === 'about' || hash === 'resume') targetViewId = 'resume-view';
    if (hash === 'tax') targetViewId = 'tax-view';

    const targetView = document.getElementById(targetViewId);
    if (!targetView) {
      hash = 'home';
      targetViewId = 'home-view';
    }

    // Update active view
    views.forEach(view => {
      if (view.id === targetViewId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update nav links
    navLinks.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === hash || (hash === 'resume' && route === 'about')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (hash === 'resume' || hash === 'about') {
      setTimeout(() => initAnimatedCounters(), 100);
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/* ==========================================================================
   3. Apple Keynote Animated Stat Counters
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.metric-val[data-target], .metric-number[data-target]');
  if (!counterElements.length) return;

  const observerOptions = { threshold: 0.3 };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNum = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        
        animateValue(el, 0, targetNum, duration, prefix, suffix);
        observerInstance.unobserve(el);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));

  function animateValue(obj, start, end, duration, prefix, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * (end - start) + start);
      
      obj.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   4. Blog Module (Supports Optional Article Images, Pagination & Overlay Reader)
   ========================================================================== */
function initBlogModule() {
  const blogGrid = document.getElementById('blogGrid');
  const filterBtns = document.querySelectorAll('.blog-tab-btn');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const pageInfo = document.getElementById('pageInfo');
  
  const articleModal = document.getElementById('blogArticleModal');
  const closeArticleBtn = document.getElementById('closeArticleModalBtn');

  if (!blogGrid || typeof BLOG_POSTS === 'undefined') return;

  let currentCategory = 'all';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 10;

  function getFilteredPosts() {
    if (currentCategory === 'all') return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category.toLowerCase() === currentCategory.toLowerCase());
  }

  function renderBlog() {
    const posts = getFilteredPosts();
    const totalPages = Math.max(1, Math.ceil(posts.length / ITEMS_PER_PAGE));
    
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    blogGrid.innerHTML = '';
    if (paginatedPosts.length === 0) {
      blogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No articles found in this category.</p>`;
    } else {
      paginatedPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-id', post.id);

        const catClass = post.category.toLowerCase();
        
        // Optional Image Header
        const imageHTML = post.image ? `
          <div class="blog-card-image-wrap">
            <img src="${post.image}" alt="${post.title}" class="blog-card-img" loading="lazy">
          </div>
        ` : '';

        card.innerHTML = `
          ${imageHTML}
          <div class="blog-card-body">
            <div>
              <div class="blog-card-meta">
                <span class="blog-cat-pill ${catClass}">${post.category}</span>
                <span class="blog-date-text">${post.date} • ${post.readTime}</span>
              </div>
              <h3 class="blog-card-title">${post.title}</h3>
              <p class="blog-card-summary">${post.summary}</p>
            </div>
            <span class="blog-card-readmore">
              Read Article
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        `;

        card.addEventListener('click', () => openArticleModal(post));
        blogGrid.appendChild(card);
      });
    }

    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-blog-filter');
      currentPage = 1;
      renderBlog();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderBlog();
        window.scrollTo({ top: blogGrid.offsetTop - 150, behavior: 'smooth' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const posts = getFilteredPosts();
      const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderBlog();
        window.scrollTo({ top: blogGrid.offsetTop - 150, behavior: 'smooth' });
      }
    });
  }

  function openArticleModal(post) {
    if (!articleModal) return;

    const titleEl = document.getElementById('articleModalTitle');
    const catPillEl = document.getElementById('articleCategoryPill');
    const dateEl = document.getElementById('articleDateText');
    const readTimeEl = document.getElementById('articleReadTimeText');
    const bodyEl = document.getElementById('articleModalBody');

    if (titleEl) titleEl.textContent = post.title;
    if (catPillEl) {
      catPillEl.textContent = post.category;
      catPillEl.className = `blog-cat-pill ${post.category.toLowerCase()}`;
    }
    if (dateEl) dateEl.textContent = post.date;
    if (readTimeEl) readTimeEl.textContent = post.readTime;
    
    // Header Image inside Modal if present
    const imgHeader = post.image ? `<img src="${post.image}" class="article-modal-header-img" alt="${post.title}">` : '';
    if (bodyEl) bodyEl.innerHTML = imgHeader + post.content;

    articleModal.showModal();
  }

  if (closeArticleBtn && articleModal) {
    closeArticleBtn.addEventListener('click', () => articleModal.close());

    articleModal.addEventListener('click', (e) => {
      const rect = articleModal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        articleModal.close();
      }
    });
  }

  renderBlog();
}

/* ==========================================================================
   5. Thai Personal Income Tax 2026 Calculator Module
   ========================================================================== */
const TAX_BRACKETS_2026 = [
  { min: 0, max: 150000, rate: 0.00, label: "0 - 150,000", maxTaxInBracket: 0 },
  { min: 150000, max: 300000, rate: 0.05, label: "150,001 - 300,000", maxTaxInBracket: 7500 },
  { min: 300000, max: 500000, rate: 0.10, label: "300,001 - 500,000", maxTaxInBracket: 20000 },
  { min: 500000, max: 750000, rate: 0.15, label: "500,001 - 750,000", maxTaxInBracket: 37500 },
  { min: 750000, max: 1000000, rate: 0.20, label: "750,001 - 1,000,000", maxTaxInBracket: 50000 },
  { min: 1000000, max: 2000000, rate: 0.25, label: "1,000,001 - 2,000,000", maxTaxInBracket: 250000 },
  { min: 2000000, max: 5000000, rate: 0.30, label: "2,000,001 - 5,000,000", maxTaxInBracket: 900000 },
  { min: 5000000, max: Infinity, rate: 0.35, label: "> 5,000,000", maxTaxInBracket: Infinity }
];

function initTaxCalculator() {
  const form = document.getElementById('taxCalcForm');
  if (!form) return;

  // Currency Formatter Helpers
  function parseCurrency(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleanStr = String(val).replace(/,/g, '').trim();
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  }

  function formatCurrencyString(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Setup Currency Masking on Form Inputs
  const currencyInputs = form.querySelectorAll('.currency-input');
  currencyInputs.forEach(input => {
    // Initial format check
    const initialVal = parseCurrency(input.value);
    input.value = formatCurrencyString(initialVal);

    // Format on blur
    input.addEventListener('blur', () => {
      const val = parseCurrency(input.value);
      input.value = formatCurrencyString(val);
      calculateTax();
    });
  });

  const yearlySalaryInput = document.getElementById('yearlySalary');
  const yearlyBonusInput = document.getElementById('yearlyBonus');
  const otherIncomeInput = document.getElementById('otherIncome');

  const spouseAllowanceInput = document.getElementById('spouseAllowance');
  const childCountInput = document.getElementById('childCount');
  const parentCountInput = document.getElementById('parentCount');

  const socialSecurityInput = document.getElementById('socialSecurity');
  const healthInsInput = document.getElementById('healthIns');
  const lifeInsInput = document.getElementById('lifeIns');
  const thaiEsgInput = document.getElementById('thaiEsg');
  const pvdInput = document.getElementById('pvdFund');
  const ssfInput = document.getElementById('ssfFund');
  const rmfInput = document.getElementById('rmfFund');
  const pensionInsInput = document.getElementById('pensionIns');
  const otherDeductionInput = document.getElementById('otherDeductions');

  const grossSummaryVal = document.getElementById('grossSummaryVal');
  const standardDeductionVal = document.getElementById('standardDeductionVal');
  const totalAllowancesVal = document.getElementById('totalAllowancesVal');
  const netIncomeVal = document.getElementById('netIncomeVal');
  const taxPayableVal = document.getElementById('taxPayableVal');
  const currentBracketRateVal = document.getElementById('currentBracketRateVal');
  const warningContainer = document.getElementById('taxWarningContainer');
  const recommenderBody = document.getElementById('taxRecommenderBody');

  function calculateTax() {
    // 1. Income Breakdown (Default Salary 360,000.00 THB)
    const salary = parseCurrency(yearlySalaryInput ? yearlySalaryInput.value : 360000);
    const bonus = parseCurrency(yearlyBonusInput ? yearlyBonusInput.value : 0);
    const otherIncome = parseCurrency(otherIncomeInput ? otherIncomeInput.value : 0);
    const grossIncome = Math.max(0, salary + bonus + otherIncome);

    // Standard Deduction: 50% of gross income, max 100,000 THB
    const standardDeduction = Math.min(100000, grossIncome * 0.5);

    // 2. Personal & Family Allowances
    const personalAllowance = 60000;
    const spouseAllowance = parseCurrency(spouseAllowanceInput ? spouseAllowanceInput.value : 0);
    const childCount = Math.max(0, parseInt(childCountInput ? childCountInput.value : 0, 10) || 0);
    const parentCount = Math.max(0, Math.min(4, parseInt(parentCountInput ? parentCountInput.value : 0, 10) || 0));

    const childAllowance = childCount * 30000;
    const parentAllowance = parentCount * 30000;
    const familyTotalAllowance = personalAllowance + spouseAllowance + childAllowance + parentAllowance;

    // 3. Insurances & Funds
    const socialSecurity = Math.min(9000, parseCurrency(socialSecurityInput ? socialSecurityInput.value : 0));
    const rawHealthIns = parseCurrency(healthInsInput ? healthInsInput.value : 0);
    const rawLifeIns = parseCurrency(lifeInsInput ? lifeInsInput.value : 0);
    const thaiEsg = parseCurrency(thaiEsgInput ? thaiEsgInput.value : 0);
    const pvd = parseCurrency(pvdInput ? pvdInput.value : 0);
    const ssf = parseCurrency(ssfInput ? ssfInput.value : 0);
    const rmf = parseCurrency(rmfInput ? rmfInput.value : 0);
    const pension = parseCurrency(pensionInsInput ? pensionInsInput.value : 0);
    const otherDeductions = parseCurrency(otherDeductionInput ? otherDeductionInput.value : 0);

    // Capping Logic
    // Health Insurance: max 25,000. Life + Health combined: max 100,000 THB
    const cappedHealthIns = Math.min(25000, rawHealthIns);
    const maxLifeAllowed = Math.max(0, 100000 - cappedHealthIns);
    const cappedLifeIns = Math.min(maxLifeAllowed, rawLifeIns);

    // Thai ESG: Max 30% of Gross, Max 300,000 THB
    const thaiEsgLimit = Math.min(300000, grossIncome * 0.30);
    const cappedThaiEsg = Math.min(thaiEsgLimit, thaiEsg);

    // Retirement Group Capping: Combined Max 500,000 THB (PVD + SSF + RMF + Pension)
    const pvdLimit = Math.min(500000, grossIncome * 0.15);
    const ssfLimit = Math.min(200000, grossIncome * 0.30);
    const rmfLimit = Math.min(500000, grossIncome * 0.30);
    const pensionLimit = Math.min(200000, grossIncome * 0.15);

    const rawPVD = Math.min(pvdLimit, pvd);
    const rawSSF = Math.min(ssfLimit, ssf);
    const rawRMF = Math.min(rmfLimit, rmf);
    const rawPension = Math.min(pensionLimit, pension);

    const totalRetirementRaw = rawPVD + rawSSF + rawRMF + rawPension;
    const retirementGroupCap = 500000;
    const retirementScale = totalRetirementRaw > retirementGroupCap ? (retirementGroupCap / totalRetirementRaw) : 1;

    const cappedPVD = rawPVD * retirementScale;
    const cappedSSF = rawSSF * retirementScale;
    const cappedRMF = rawRMF * retirementScale;
    const cappedPension = rawPension * retirementScale;
    const totalRetirementCapped = cappedPVD + cappedSSF + cappedRMF + cappedPension;

    // Total Allowances
    const totalAllowances = familyTotalAllowance + socialSecurity + cappedHealthIns + cappedLifeIns + cappedThaiEsg + totalRetirementCapped + otherDeductions;

    // 4. Net Income = Gross - Standard Deduction - Total Allowances
    const netIncome = Math.max(0, grossIncome - standardDeduction - totalAllowances);

    // 5. Exceeded Caps Warning Alerts
    if (warningContainer) {
      const warnings = [];
      if (pvd + ssf + rmf + pension > 500000) {
        warnings.push(`⚠️ ยอดรวมกลุ่มเกษียณ (PVD + SSF + RMF + บำนาญ) กรอกรวมกัน ${(pvd + ssf + rmf + pension).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท เกินสิทธิ 500,000.00 บาท (ระบบจะคำนวณหักตามเพดาน 500,000.00 บาทอัตโนมัติ)`);
      }
      if (rawLifeIns + rawHealthIns > 100000) {
        warnings.push(`⚠️ ยอดประกันชีวิตและสุขภาพ กรอกรวมกัน ${(rawLifeIns + rawHealthIns).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท เกินสิทธิ 100,000.00 บาท (ระบบจะคำนวณหักตามเพดาน 100,000.00 บาทอัตโนมัติ)`);
      }
      if (thaiEsg > thaiEsgLimit) {
        warnings.push(`⚠️ ยอดกองทุน Thai ESG เกินสิทธิ ${thaiEsgLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท (ระบบจะคำนวณหักตามเพดานอัตโนมัติ)`);
      }

      if (warnings.length > 0) {
        warningContainer.innerHTML = warnings.map(w => `<div class="tax-warning-banner">${w}</div>`).join('');
      } else {
        warningContainer.innerHTML = '';
      }
    }

    // 6. Progressive Tax Payable Calculation
    let taxPayable = 0;
    let currentBracketIndex = 0;

    for (let i = 0; i < TAX_BRACKETS_2026.length; i++) {
      const b = TAX_BRACKETS_2026[i];
      if (netIncome > b.min) {
        currentBracketIndex = i;
        const taxableChunk = Math.min(netIncome - b.min, b.max - b.min);
        taxPayable += taxableChunk * b.rate;
      }
    }

    const currentBracket = TAX_BRACKETS_2026[currentBracketIndex];

    // Update Summary Values (Formatted with 2 decimals)
    if (grossSummaryVal) grossSummaryVal.textContent = `${formatCurrencyString(grossIncome)} ฿`;
    if (standardDeductionVal) standardDeductionVal.textContent = `- ${formatCurrencyString(standardDeduction)} ฿`;
    if (totalAllowancesVal) totalAllowancesVal.textContent = `- ${formatCurrencyString(totalAllowances)} ฿`;
    if (netIncomeVal) netIncomeVal.textContent = `${formatCurrencyString(netIncome)} ฿`;
    if (taxPayableVal) taxPayableVal.textContent = `${formatCurrencyString(Math.round(taxPayable))} ฿`;
    if (currentBracketRateVal) currentBracketRateVal.textContent = `${(currentBracket.rate * 100).toFixed(0)}%`;

    // 7. Meter Visualization Update
    updateTaxMeterVisualization(netIncome, currentBracketIndex);

    // 8. Tax Bracket Drop Recommendation Engine
    generateTaxRecommender(grossIncome, netIncome, currentBracketIndex, cappedLifeIns, cappedThaiEsg, pvd, ssf, rmf, pension);
  }

  function updateTaxMeterVisualization(netIncome, activeBracketIdx) {
    const meterRows = document.querySelectorAll('.bracket-step-row');
    meterRows.forEach((row, index) => {
      const b = TAX_BRACKETS_2026[index];
      const fillBar = row.querySelector('.bracket-bar-fill');

      if (index === activeBracketIdx) {
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }

      if (netIncome >= b.max) {
        if (fillBar) fillBar.style.width = '100%';
      } else if (netIncome > b.min) {
        const pct = Math.min(100, ((netIncome - b.min) / (b.max - b.min)) * 100);
        if (fillBar) fillBar.style.width = `${pct}%`;
      } else {
        if (fillBar) fillBar.style.width = '0%';
      }
    });
  }

  function generateTaxRecommender(grossIncome, netIncome, currentBracketIdx, lifeIns, thaiEsg, pvd, ssf, rmf, pension) {
    if (!recommenderBody) return;

    const currentBracket = TAX_BRACKETS_2026[currentBracketIdx];

    if (currentBracketIdx === 0 || netIncome <= 150000) {
      recommenderBody.innerHTML = `
        <div class="rec-header">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          คุณอยู่ในฐานภาษี 0% (ได้รับยกเว้นภาษี)
        </div>
        <p class="rec-body-text">
          ยอดเงินได้สุทธิของคุณคือ <strong>${formatCurrencyString(netIncome)} บาท</strong> ซึ่งอยู่ในช่วงยกเว้นภาษี จึงไม่มีภาษีต้องชำระเพิ่มเติมในปัจจุบัน
        </p>
      `;
      return;
    }

    const lowerBracket = TAX_BRACKETS_2026[currentBracketIdx - 1];
    const requiredDeduction = netIncome - lowerBracket.max;
    const currentBracketRateText = `${(currentBracket.rate * 100).toFixed(0)}%`;

    // Quota Formulas according to exact user spec:
    // Q_LifeIns
    const Q_LifeIns = Math.max(0, 100000 - lifeIns);

    // Q_ThaiESG
    const Q_ThaiESG = Math.max(0, Math.min(grossIncome * 0.30, 300000) - thaiEsg);

    // Q_Retirement_Total = 500,000 - (PVD + RMF + SSF + ประกันบำนาญ)
    const Q_Retirement_Total = Math.max(0, 500000 - (pvd + rmf + ssf + pension));

    // Q_SSF_Real = Min((Min(รายได้รวม * 30%, 200,000) - SSF), Q_Retirement_Total)
    const ssfUncapped = Math.max(0, Math.min(grossIncome * 0.30, 200000) - ssf);
    const Q_SSF_Real = Math.max(0, Math.min(ssfUncapped, Q_Retirement_Total));

    // Q_RMF_Real = Min((Min(รายได้รวม * 30%, 500,000) - RMF), Q_Retirement_Total)
    const rmfUncapped = Math.max(0, Math.min(grossIncome * 0.30, 500000) - rmf);
    const Q_RMF_Real = Math.max(0, Math.min(rmfUncapped, Q_Retirement_Total));

    const formatReq = (req, quota) => formatCurrencyString(Math.min(req, quota));
    const formatQuota = (quota) => formatCurrencyString(quota);

    // 1. Thai ESG Item
    let thaiEsgHTML = '';
    if (Q_ThaiESG > 0) {
      thaiEsgHTML = `<li class="rec-quota-item">
        <span class="rec-quota-label">🌱 กองทุน Thai ESG:</span>
        <span class="rec-quota-val">แนะนำให้ซื้อจำนวน <strong>${formatReq(requiredDeduction, Q_ThaiESG)} บาท</strong> <em>(คุณยังซื้อได้สูงสุดอีก ${formatQuota(Q_ThaiESG)} บาท)</em></span>
      </li>`;
    } else {
      thaiEsgHTML = `<li class="rec-quota-item" style="opacity: 0.6;">
        <span class="rec-quota-label">❌ กองทุน Thai ESG:</span>
        <span class="rec-quota-val" style="color: var(--text-tertiary);"><strong>(ลดหย่อนครบแล้ว)</strong></span>
      </li>`;
    }

    // 2. SSF Item
    let ssfHTML = '';
    if (Q_SSF_Real > 0) {
      ssfHTML = `<li class="rec-quota-item">
        <span class="rec-quota-label">📈 กองทุน SSF (กลุ่มเกษียณ):</span>
        <span class="rec-quota-val">แนะนำให้ซื้อจำนวน <strong>${formatReq(requiredDeduction, Q_SSF_Real)} บาท</strong> <em>(คุณยังซื้อได้สูงสุดอีก ${formatQuota(Q_SSF_Real)} บาท)</em></span>
      </li>`;
    } else {
      ssfHTML = `<li class="rec-quota-item" style="opacity: 0.6;">
        <span class="rec-quota-label">❌ กองทุน SSF:</span>
        <span class="rec-quota-val" style="color: var(--text-tertiary);"><strong>(ลดหย่อนครบแล้ว)</strong></span>
      </li>`;
    }

    // 3. RMF Item
    let rmfHTML = '';
    if (Q_RMF_Real > 0) {
      rmfHTML = `<li class="rec-quota-item">
        <span class="rec-quota-label">📊 กองทุน RMF (กลุ่มเกษียณ):</span>
        <span class="rec-quota-val">แนะนำให้ซื้อจำนวน <strong>${formatReq(requiredDeduction, Q_RMF_Real)} บาท</strong> <em>(คุณยังซื้อได้สูงสุดอีก ${formatQuota(Q_RMF_Real)} บาท)</em></span>
      </li>`;
    } else {
      rmfHTML = `<li class="rec-quota-item" style="opacity: 0.6;">
        <span class="rec-quota-label">❌ กองทุน RMF:</span>
        <span class="rec-quota-val" style="color: var(--text-tertiary);"><strong>(ลดหย่อนครบแล้ว)</strong></span>
      </li>`;
    }

    // 4. Life Insurance Item
    let lifeInsHTML = '';
    if (Q_LifeIns > 0) {
      lifeInsHTML = `<li class="rec-quota-item">
        <span class="rec-quota-label">🛡️ ประกันชีวิตทั่วไป / ประกันออมทรัพย์:</span>
        <span class="rec-quota-val">แนะนำให้ซื้อประกันเพิ่มเบี้ยจำนวน <strong>${formatReq(requiredDeduction, Q_LifeIns)} บาท</strong> <em>(คุณยังทำได้สูงสุดอีก ${formatQuota(Q_LifeIns)} บาท)</em></span>
      </li>`;
    } else {
      lifeInsHTML = `<li class="rec-quota-item" style="opacity: 0.6;">
        <span class="rec-quota-label">❌ ประกันชีวิต:</span>
        <span class="rec-quota-val" style="color: var(--text-tertiary);"><strong>(ลดหย่อนครบแล้ว)</strong></span>
      </li>`;
    }

    recommenderBody.innerHTML = `
      <div class="rec-header">
        ⚡ คำแนะนำเพื่อลดฐานภาษี (Tax Bracket Drop)
      </div>
      <p class="rec-body-text">
        • ยอดเงินได้สุทธิของคุณคือ <strong>${formatCurrencyString(netIncome)} บาท</strong> (อยู่ในฐานภาษี <strong>${currentBracketRateText}</strong>)<br>
        • หากต้องการลดฐานภาษีลงมา 1 ระดับ คุณต้องหาค่าลดหย่อนเพิ่มอีก <strong>${formatCurrencyString(requiredDeduction)} บาท</strong><br>
        • <strong>ทางเลือกเพื่อลดฐานภาษี (เลือกผสมกันได้เพื่อให้ได้ยอด ${formatCurrencyString(requiredDeduction)} บาท):</strong>
      </p>
      <ul class="rec-quota-list">
        ${thaiEsgHTML}
        ${ssfHTML}
        ${rmfHTML}
        ${lifeInsHTML}
      </ul>
    `;
  }

  // Bind input listeners for live updates
  const inputs = form.querySelectorAll('input');
  inputs.forEach(inp => inp.addEventListener('input', calculateTax));

  // Run initial calculation
  calculateTax();
}

/* ==========================================================================
   6. Interactive Detail Spec Modal (<dialog id="specModal">)
   ========================================================================== */
const SPEC_DATA = {
  kbtg: {
    title: "KASIKORN Business-Technology Group (KBTG)",
    subtitle: "Senior Business Analyst (Sep 2023 - Present)",
    description: "Led core enterprise revamps for merchant reporting, payment infrastructure, eSlips, back-office reconciliation automation, ThaiQR refund optimization, and cybersecurity compliance via Hardware Security Modules (HSM).",
    specs: {
      "Merchants Impacted": "100,000+",
      "Reconciliation Workload": "30% Operational Cut",
      "ThaiQR Refund Speed": "Next-Day (Down from 7-14 Days)",
      "Cybersecurity": "100% HSM Compliant",
      "Core Technologies": "BAHTNET API, E-Wallet Engine, Central eSlip, Python, RESTful API",
      "Domain": "Payment Gateway, Reconciliation, ThaiQR Refunds, Security"
    }
  },
  iconext: {
    title: "ICONEXT.CO.,LTD",
    subtitle: "Business Analyst & Project Manager (Oct 2022 - Sep 2023)",
    description: "Managed Mastercard integration for Aeon Scan to Pay, deployed OCR-based credit card lending automation, and built Customer Code Tracking for marketing ROI.",
    specs: {
      "Go-Live Speedup": "25% Reduced Delays",
      "Resolution Time": "30% Faster Support",
      "Core Automation": "OCR Document Extraction",
      "Payment Partner": "Mastercard QR / Aeon",
      "Core Technologies": "REST API, CMS Architecture, Workflow Engine",
      "Domain": "Digital Lending, Marketing Analytics, Credit Card"
    }
  },
  scb: {
    title: "Siam Commercial Bank (SCB)",
    subtitle: "Business Analyst (Apr 2022 - Oct 2022)",
    description: "Engineered core workflows for SCB Payment Hub initiatives including Central Bank Digital Currency (CBDC) and post-core system upgrade customer data alignment.",
    specs: {
      "Core Initiative": "Payment Hub & CBDC Pipeline",
      "Data Alignment": "CPX Core System Synchronization",
      "Integrations": "Bill Payments, CBDC Ledger",
      "Key Output": "End-to-End Technical Specs",
      "Domain": "Digital Currency, Payment Hub, Core Banking"
    }
  },
  cdg: {
    title: "CDG Group (NOSTRA Maps)",
    subtitle: "Business Analyst & System Engineer (Oct 2019 - Mar 2022)",
    description: "Partnered with FATOS (South Korea) for backend map technology integration. Upgraded Vehicle Routing Problem (VRP) algorithms for enterprise logistics using ArcGIS/QGIS.",
    specs: {
      "International Partner": "FATOS (South Korea)",
      "GIS Platform": "NOSTRA Maps & ArcGIS / QGIS",
      "Core Tech": "Vehicle Routing Problem (VRP) Engine",
      "CMS Project": "CBT-DASTA Tourism Platform",
      "Domain": "Geospatial, Fleet Logistics, UI/UX Workflow"
    }
  }
};

function initDetailModal() {
  const modal = document.getElementById('specModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDesc = document.getElementById('modalDesc');
  const specGrid = document.getElementById('specGrid');

  if (!modal) return;

  const detailButtons = document.querySelectorAll('.btn-detail');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-spec');
      const data = SPEC_DATA[key];

      if (data) {
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalDesc.textContent = data.description;

        specGrid.innerHTML = '';
        Object.entries(data.specs).forEach(([label, value]) => {
          const item = document.createElement('div');
          item.className = 'spec-item';
          item.innerHTML = `
            <span class="spec-label">${label}</span>
            <span class="spec-value">${value}</span>
          `;
          specGrid.appendChild(item);
        });

        modal.showModal();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      modal.close();
    }
  });
}

/* ==========================================================================
   7. Scroll Reveal & Animations
   ========================================================================== */
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.hero-left-card, .hero-right-content, .timeline-item, .skill-category-card, .blog-card, .tax-card-box');
  animateElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
  });
}
