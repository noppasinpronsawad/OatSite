/**
 * Personal Website JavaScript Architecture
 * Single Page Application Router, Blog Manager, Article Reader & Thai Tax Calculator 2026
 * Author: Noppasin Pronsawad
 */

function initApp() {
  initThemeToggle();
  initRouter();
  initAnimatedCounters();
  initDetailModal();
  initBlogModule();
  initTaxCalculator();
  initToeicSimulator();
  initScrollEffects();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

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
    if (hash === 'tax' || hash === 'tax-calculator') targetViewId = 'tax-view';
    if (hash === 'toeic' || hash === 'toeic-simulator') {
      targetViewId = 'toeic-view';
      if (typeof resetToeicExam === 'function') resetToeicExam();
    } else {
      if (typeof toeicTimerInterval !== 'undefined' && toeicTimerInterval) {
        clearInterval(toeicTimerInterval);
      }
    }
    if (hash === 'showcase') targetViewId = 'showcase-view';

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
      if (route === hash || (hash === 'resume' && route === 'about') || (hash === 'tax' && route === 'showcase') || (hash === 'toeic' && route === 'showcase')) {
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

/* Minimal Cover Fallback Helper for Broken Image URLs (e.g. 404 when source deletes image) */
window.handleCoverImageFallback = function(imgEl, category) {
  if (!imgEl || !imgEl.parentElement) return;
  const parent = imgEl.parentElement;
  parent.className = 'blog-card-minimal-cover';
  parent.innerHTML = `<span class="minimal-badge">${category || 'Article'}</span>`;
};

/* Helper to guarantee exact Day Month Year format (e.g. 07 Aug 2026) for all posts */
function formatFullDisplayDate(post) {
  if (!post) return '07 Aug 2026';
  
  const dateObj = post.createdAt ? new Date(post.createdAt) : (post.publishAt ? new Date(post.publishAt) : null);
  if (dateObj && !isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }

  if (post.date && /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(post.date.trim())) {
    return post.date.trim();
  }

  if (post.date && /^[A-Za-z]{3}\s+\d{4}$/.test(post.date.trim())) {
    return `01 ${post.date.trim()}`;
  }

  return post.date || 'No Date';
}

function initBlogModule() {
  const blogGrid = document.getElementById('blogGrid');
  const filterBtns = document.querySelectorAll('.blog-tab-btn');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const pageInfo = document.getElementById('pageInfo');
  
  const articleModal = document.getElementById('blogArticleModal');
  const closeArticleBtn = document.getElementById('closeArticleModalBtn');

  if (!blogGrid) return;

  // Use static BLOG_POSTS as fallback, activePostsData will store dynamic data from API
  let activePostsData = (typeof BLOG_POSTS !== 'undefined') ? BLOG_POSTS : [];
  let currentCategory = 'all';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 10;

  async function fetchDynamicPosts() {
    try {
      if (blogGrid) {
        blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">⏳ Loading latest articles...</p>';
      }
      const response = await fetch('/api/posts?_t=' + Date.now());
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts) && posts.length > 0) {
          activePostsData = posts;
        } else if (typeof BLOG_POSTS !== 'undefined') {
          activePostsData = BLOG_POSTS;
        }
      } else if (typeof BLOG_POSTS !== 'undefined') {
        activePostsData = BLOG_POSTS;
      }
    } catch (err) {
      console.warn('API /api/posts unreachable, using fallback blog-data.js:', err);
    } finally {
      // Enforce client-side sorting (Newest to Oldest) for any fallback data
      if (activePostsData && activePostsData.length > 0) {
        activePostsData.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : (a.publishAt ? new Date(a.publishAt) : new Date(a.date || 0));
          const dateB = b.createdAt ? new Date(b.createdAt) : (b.publishAt ? new Date(b.publishAt) : new Date(b.date || 0));
          return dateB - dateA;
        });
      }
      renderBlog();
    }
  }

  function getFilteredPosts() {
    if (currentCategory === 'all') return activePostsData;
    return activePostsData.filter(post => (post.category || '').toLowerCase() === currentCategory.toLowerCase());
  }

  function renderBlog() {
    const posts = getFilteredPosts();
    const totalPages = Math.max(1, Math.ceil(posts.length / ITEMS_PER_PAGE));
    
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    blogGrid.innerHTML = '';
    if (paginatedPosts.length === 0) {
      blogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No articles found in this category.</p>`;
    } else {
      paginatedPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-id', post.id || post._id);

        const catClass = (post.category || 'Science').toLowerCase().replace(/\s+/g, '-');
        
        // Image Header with Minimal Fallback on 404/broken URL
        const imageHTML = post.image ? `
          <div class="blog-card-image-wrap">
            <img src="${post.image}" alt="${post.title}" class="blog-card-img" loading="lazy" onerror="handleCoverImageFallback(this, '${escapeHTML(post.category)}')">
          </div>
        ` : `
          <div class="blog-card-minimal-cover">
            <span class="minimal-badge">${escapeHTML(post.category)}</span>
          </div>
        `;

        card.innerHTML = `
          ${imageHTML}
          <div class="blog-card-body">
            <div>
              <div class="blog-card-meta">
                <span class="blog-cat-pill ${catClass}">${post.category}</span>
                <span class="blog-date-text">${formatFullDisplayDate(post)} • ${post.readTime || '5 min read'}</span>
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

  async function openArticleModal(post) {
    if (!articleModal) return;

    const titleEl = document.getElementById('articleModalTitle');
    const catPillEl = document.getElementById('articleCategoryPill');
    const dateEl = document.getElementById('articleDateText');
    const readTimeEl = document.getElementById('articleReadTimeText');
    const bodyEl = document.getElementById('articleModalBody');

    if (titleEl) titleEl.textContent = post.title;
    if (catPillEl) {
      catPillEl.textContent = post.category;
      catPillEl.className = `blog-cat-pill ${(post.category || 'Science').toLowerCase()}`;
    }
    if (dateEl) dateEl.textContent = formatFullDisplayDate(post);
    if (readTimeEl) readTimeEl.textContent = post.readTime || '5 min read';
    
    // Show loading state while fetching full content
    if (bodyEl) {
      bodyEl.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">⏳ Loading article content...</p>';
    }

    articleModal.showModal();

    // Fetch full content by ID
    let fullContent = post.content;
    const postId = post.id || post._id;
    
    if (!fullContent && postId) {
      try {
        const response = await fetch(`/api/posts/detail?id=${postId}`);
        if (response.ok) {
          const detail = await response.json();
          fullContent = detail.content;
        } else {
          fullContent = '<p style="color: red; text-align: center;">Failed to load article content.</p>';
        }
      } catch (err) {
        console.error('Error fetching post detail:', err);
        fullContent = '<p style="color: red; text-align: center;">Error loading article content.</p>';
      }
    } else if (!fullContent) {
      fullContent = '<p style="color: red; text-align: center;">Content unavailable.</p>';
    }

    // Header Image inside Modal if present
    const imgHeader = post.image ? `<img src="${post.image}" class="article-modal-header-img" alt="${post.title}">` : '';
    if (bodyEl) {
      let sanitizedContent = fullContent;
      if (window.DOMPurify) {
        sanitizedContent = window.DOMPurify.sanitize(fullContent, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
        });
      } else {
        console.warn('DOMPurify not loaded, skipping sanitization');
      }

      bodyEl.innerHTML = imgHeader + sanitizedContent;
      // Trigger KaTeX to render LaTeX equations
      if (window.renderMathInElement) {
        renderMathInElement(bodyEl, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '\\(', right: '\\)', display: false}
          ],
          throwOnError: false
        });
      }
    }
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

  // Fetch dynamic posts from API on init
  fetchDynamicPosts();
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
  const withholdingTaxInput = document.getElementById('withholdingTax');

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
  const taxCalculatedVal = document.getElementById('taxCalculatedVal');
  const withholdingTaxVal = document.getElementById('withholdingTaxVal');
  const finalTaxLabel = document.getElementById('finalTaxLabel');
  const taxPayableVal = document.getElementById('taxPayableVal');
  const currentBracketRateVal = document.getElementById('currentBracketRateVal');
  const warningContainer = document.getElementById('taxWarningContainer');
  const recommenderBody = document.getElementById('taxRecommenderBody');

  function calculateTax() {
    // 1. Income Breakdown & Withholding Tax
    const salary = parseCurrency(yearlySalaryInput ? yearlySalaryInput.value : 360000);
    const bonus = parseCurrency(yearlyBonusInput ? yearlyBonusInput.value : 0);
    const otherIncome = parseCurrency(otherIncomeInput ? otherIncomeInput.value : 0);
    const withholdingTax = parseCurrency(withholdingTaxInput ? withholdingTaxInput.value : 0);
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
    let taxCalculated = 0;
    let currentBracketIndex = 0;

    for (let i = 0; i < TAX_BRACKETS_2026.length; i++) {
      const b = TAX_BRACKETS_2026[i];
      if (netIncome > b.min) {
        currentBracketIndex = i;
        const taxableChunk = Math.min(netIncome - b.min, b.max - b.min);
        taxCalculated += taxableChunk * b.rate;
      }
    }

    const roundedTaxCalculated = Math.round(taxCalculated);
    const finalNetTax = roundedTaxCalculated - withholdingTax;
    const currentBracket = TAX_BRACKETS_2026[currentBracketIndex];

    // Update Summary Values (Formatted with 2 decimals)
    if (grossSummaryVal) grossSummaryVal.textContent = `${formatCurrencyString(grossIncome)} ฿`;
    if (standardDeductionVal) standardDeductionVal.textContent = `- ${formatCurrencyString(standardDeduction)} ฿`;
    if (totalAllowancesVal) totalAllowancesVal.textContent = `- ${formatCurrencyString(totalAllowances)} ฿`;
    if (netIncomeVal) netIncomeVal.textContent = `${formatCurrencyString(netIncome)} ฿`;
    if (taxCalculatedVal) taxCalculatedVal.textContent = `${formatCurrencyString(roundedTaxCalculated)} ฿`;
    if (withholdingTaxVal) withholdingTaxVal.textContent = `- ${formatCurrencyString(withholdingTax)} ฿`;

    if (finalTaxLabel && taxPayableVal) {
      if (finalNetTax > 0) {
        finalTaxLabel.textContent = 'ภาษีที่ต้องชำระเพิ่มเติม:';
        taxPayableVal.textContent = `${formatCurrencyString(finalNetTax)} ฿`;
        taxPayableVal.style.color = 'var(--accent-cyan)';
      } else if (finalNetTax < 0) {
        finalTaxLabel.textContent = 'ภาษีชำระไว้เกิน (ได้รับคืน):';
        taxPayableVal.textContent = `${formatCurrencyString(Math.abs(finalNetTax))} ฿`;
        taxPayableVal.style.color = 'var(--accent-green)';
      } else {
        finalTaxLabel.textContent = 'ภาษีที่ต้องชำระเพิ่มเติม:';
        taxPayableVal.textContent = `0.00 ฿`;
        taxPayableVal.style.color = 'var(--accent-cyan)';
      }
    }

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

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ==========================================================================
   8. TOEIC READING TEST SIMULATOR ENGINE (Part 5, 6, 7 & CEFR Scaling)
   ========================================================================== */
let toeicExamMode = 'full'; // 'full' (100 Qs, 75 mins) or 'quick' (20 Qs, 15 mins)
let toeicQuestions = [];
let currentToeicIndex = 0;
let toeicUserAnswers = {};
let toeicFlagged = {};
let toeicTimerInterval = null;
let toeicTimeRemainingSec = 4500;

// ETS TOEIC Reading Score Mapping Matrix (Raw 0-100 -> Scaled Score 5-495)
const TOEIC_RAW_TO_SCALED = {
  100: 495, 99: 495, 98: 490, 97: 485, 96: 475, 95: 470, 94: 460, 93: 455, 92: 450, 91: 440,
  90: 435, 89: 430, 88: 425, 87: 420, 86: 415, 85: 410, 84: 405, 83: 400, 82: 395, 81: 390,
  80: 385, 79: 380, 78: 375, 77: 370, 76: 365, 75: 360, 74: 355, 73: 350, 72: 345, 71: 340,
  70: 335, 69: 330, 68: 325, 67: 320, 66: 315, 65: 310, 64: 300, 63: 295, 62: 290, 61: 280,
  60: 275, 59: 270, 58: 265, 57: 260, 56: 255, 55: 250, 54: 245, 53: 240, 52: 235, 51: 230,
  50: 225, 49: 220, 48: 215, 47: 210, 46: 200, 45: 195, 44: 190, 43: 185, 42: 180, 41: 170,
  40: 165, 39: 160, 38: 155, 37: 150, 36: 145, 35: 140, 34: 135, 33: 130, 32: 125, 31: 120,
  30: 115, 29: 110, 28: 105, 27: 100, 26: 95, 25: 90, 24: 85, 23: 80, 22: 75, 21: 70,
  20: 60, 19: 55, 18: 50, 17: 45, 16: 40, 15: 35, 14: 30, 13: 25, 12: 20, 11: 15,
  10: 10, 9: 5, 8: 5, 7: 5, 6: 5, 5: 5, 4: 5, 3: 5, 2: 5, 1: 5, 0: 5
};

window.selectToeicMode = function(mode) {
  toeicExamMode = mode;
  const fullCard = document.getElementById('modeFullCard');
  const quickCard = document.getElementById('modeQuickCard');
  if (fullCard && quickCard) {
    if (mode === 'full') {
      fullCard.classList.add('active');
      quickCard.classList.remove('active');
    } else {
      quickCard.classList.add('active');
      fullCard.classList.remove('active');
    }
  }
};

window.switchToeicPart = function(partNum) {
  const tabs = document.querySelectorAll('.part-tab');
  tabs.forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById(`tabPart${partNum}`);
  if (activeTab) activeTab.classList.add('active');

  // Jump to first question of specified Part
  const targetIndex = toeicQuestions.findIndex(q => q.part === partNum);
  if (targetIndex !== -1) {
    renderToeicQuestion(targetIndex);
  }
};


// Auto-clear legacy/outdated test history from older version once to ensure pristine fresh state on all devices
(function clearOutdatedToeicStorage() {
  try {
    const versionKey = 'toeic_pool_version';
    const currentVersion = '4.9_pristine';
    if (localStorage.getItem(versionKey) !== currentVersion) {
      localStorage.removeItem('toeic_history');
      localStorage.removeItem('toeic_saved_progress');
      localStorage.setItem(versionKey, currentVersion);
      console.log('[TOEIC Simulator] Cleared outdated legacy test history for fresh pristine v4.9 experience.');
    }
  } catch (e) {
    console.error('Storage reset error:', e);
  }
})();


function initToeicSimulator() {
  renderToeicHistory();

  const startExamBtn = document.getElementById('startExamBtn');
  const submitExamBtn = document.getElementById('submitExamBtn');
  const toggleReviewBtn = document.getElementById('toggleReviewBtn');
  const retakeExamBtn = document.getElementById('retakeExamBtn');

  if (startExamBtn) startExamBtn.addEventListener('click', startToeicExam);
  if (submitExamBtn) submitExamBtn.addEventListener('click', () => {
    if (confirm('คุณต้องการส่งข้อสอบและสรุปผลคะแนนใช่หรือไม่?')) {
      submitToeicExam();
    }
  });
  if (toggleReviewBtn) toggleReviewBtn.addEventListener('click', toggleDetailedReview);
  if (retakeExamBtn) retakeExamBtn.addEventListener('click', resetToeicExam);
}


function getPristineFallbackQuestions(mode) {
  console.log('[TOEIC Simulator] Fallback triggered, but mock data was cleaned up for production.');
  return [];
}


async function startToeicExam() {
  const startScreen = document.getElementById('toeicStartScreen');
  const workspace = document.getElementById('toeicExamWorkspace');
  const resultsScreen = document.getElementById('toeicResultsScreen');
  const timerWidget = document.getElementById('toeicTimerWidget');

  if (startScreen) startScreen.style.display = 'none';
  if (resultsScreen) resultsScreen.style.display = 'none';

  if (workspace) workspace.style.display = 'block';
  if (timerWidget) timerWidget.style.display = 'flex';

  const pane = document.getElementById('toeicQuestionPane');
  if (pane) {
    pane.innerHTML = `
      <div class="toeic-loading-container" style="text-align: center; padding: 4rem 2rem;">
        <div class="spinner-ring" style="display: inline-block; width: 48px; height: 48px; border: 4px solid rgba(0, 210, 255, 0.2); border-top-color: #00d2ff; border-radius: 50%; animation: toeicSpin 0.8s linear infinite; margin-bottom: 1.5rem;"></div>
        <h3 style="font-size: 1.3rem; color: #00d2ff; margin-bottom: 0.5rem;">⏳ กำลังจัดเตรียมคลังข้อสอบและสุ่มโจทย์...</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">โปรดรอสักครู่ ระบบกำลังจัดสรรพาร์ทข้อสอบและเฉลยภาษาไทย</p>
      </div>
    `;
  }

  // Fetch questions from API with 100% In-Memory Fallback Guarantee
  // [DISABLED PER USER REQUEST] - Using Mockup Data exclusively until question bank grows
  /*
  try {
    const res = await fetch(`/api/toeic/questions?mode=${toeicExamMode}&shuffle=true&new_attempt=true&_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        toeicQuestions = data.questions;
      } else {
        toeicQuestions = getPristineFallbackQuestions(toeicExamMode);
      }
    } else {
      toeicQuestions = getPristineFallbackQuestions(toeicExamMode);
    }
  } catch (e) {
    console.warn('API fetch failed, utilizing Pristine In-Memory Dataset:', e);
    toeicQuestions = getPristineFallbackQuestions(toeicExamMode);
  }
  */

  // Force using mockups
  toeicQuestions = getPristineFallbackQuestions(toeicExamMode);

  currentToeicIndex = 0;
  toeicUserAnswers = {};
  toeicFlagged = {};
  toeicTimeRemainingSec = toeicExamMode === 'full' ? 4500 : 900; // 75 mins vs 15 mins

  renderQuestionPalette();
  renderToeicQuestion(0);
  startExamTimer();
}

function startExamTimer() {
  if (toeicTimerInterval) clearInterval(toeicTimerInterval);
  updateTimerDisplay();

  toeicTimerInterval = setInterval(() => {
    toeicTimeRemainingSec--;
    updateTimerDisplay();

    if (toeicTimeRemainingSec <= 0) {
      clearInterval(toeicTimerInterval);
      alert('⏰ หมดเวลาทำข้อสอบแล้ว! ระบบกำลังคำนวณและสรุปผลคะแนนของคุณ...');
      submitToeicExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('toeicTimeDisplay');
  const widget = document.getElementById('toeicTimerWidget');
  if (!display) return;

  const mins = Math.floor(toeicTimeRemainingSec / 60);
  const secs = toeicTimeRemainingSec % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  display.textContent = formatted;

  if (widget) {
    if (toeicTimeRemainingSec <= 180) { // < 3 mins
      widget.className = 'toeic-timer-widget critical';
    } else if (toeicTimeRemainingSec <= 600) { // < 10 mins
      widget.className = 'toeic-timer-widget warning';
    } else {
      widget.className = 'toeic-timer-widget';
    }
  }
}


function isPlaceholderPassage(str) {
  if (!str) return true;
  const clean = String(str).replace(/<[^>]*>/g, '').trim().toLowerCase();
  if (!clean || clean.length < 35) return true;
  if (clean.includes('see double passage above') || clean.includes('see passage above') || clean.includes('see text above')) return true;
  return false;
}


function renderToeicQuestion(index) {
  if (index < 0 || index >= toeicQuestions.length) return;
  currentToeicIndex = index;
  const q = toeicQuestions[index];

  // Sync Part tab UI
  const tabs = document.querySelectorAll('.part-tab');
  tabs.forEach(t => t.classList.remove('active'));
  const activeTab = document.getElementById(`tabPart${q.part}`);
  if (activeTab) activeTab.classList.add('active');

  const pane = document.getElementById('toeicQuestionPane');
  if (!pane) return;

  const isFlagged = !!toeicFlagged[q.question_id];
  const selectedChoice = toeicUserAnswers[q.question_id] || '';
  const cleanQText = String(q.question_text || '').replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();

  // Part 5 Layout (Single Pane)
  if (q.part === 5) {
    pane.innerHTML = `
      <div class="q-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
        <span class="q-number-badge" style="background: rgba(0, 210, 255, 0.15); color: #00d2ff; padding: 0.3rem 0.8rem; border-radius: 12px; font-weight: 700;">
          Question ${index + 1} of ${toeicQuestions.length} (Part 5)
        </span>
        <button type="button" class="btn-flag ${isFlagged ? 'active' : ''}" onclick="toggleFlagCurrent('${q.question_id}')" style="background: none; border: 1px solid var(--border-color); color: ${isFlagged ? '#ffd60a' : 'var(--text-secondary)'}; padding: 0.35rem 0.85rem; border-radius: 20px; cursor: pointer;">
          📌 ${isFlagged ? 'Flagged for Review' : 'Flag Question'}
        </button>
      </div>

      <div class="q-text-box" style="font-size: 1.15rem; line-height: 1.6; margin-bottom: 1.8rem; font-weight: 500;">
        ${escapeHTML(cleanQText)}
      </div>

      <div class="choice-list">
        ${['A', 'B', 'C', 'D'].map(key => `
          <div class="choice-card ${selectedChoice === key ? 'selected' : ''}" onclick="selectAnswer('${q.question_id}', '${key}')">
            <input type="radio" name="q_${q.question_id}" value="${key}" class="choice-radio" ${selectedChoice === key ? 'checked' : ''}>
            <span class="choice-label">(${key})</span>
            <span class="choice-text">${escapeHTML(q.choices[key])}</span>
          </div>
        `).join('')}
      </div>

      <div class="q-nav-buttons" style="display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem;">
        <button type="button" class="btn-q-prev" onclick="navigateQuestion(${index - 1})" ${index === 0 ? 'disabled' : ''}>
          ⬅️ Previous Question
        </button>
        <button type="button" class="btn-q-next" onclick="navigateQuestion(${index + 1})" ${index === toeicQuestions.length - 1 ? 'disabled' : ''}>
          Next Question ➡️
        </button>
      </div>
    `;
  } else {
    // PASSAGE RETENTION LOGIC (Part 6 & Part 7)
    // Find passage_title and passage_content from current question or look backwards to parent question
    let passageTitle = q.passage_title || '';
    let passageContent = q.passage_content || '';

    if (isPlaceholderPassage(passageContent)) {
      passageContent = '';
      // Search backward for real passage content in same Part
      for (let i = index - 1; i >= 0; i--) {
        const prevQ = toeicQuestions[i];
        if (prevQ.part === q.part && prevQ.passage_content && !isPlaceholderPassage(prevQ.passage_content)) {
          passageTitle = prevQ.passage_title || passageTitle;
          passageContent = prevQ.passage_content;
          break;
        }
      }
      // If not found backward, search forward in same Part
      if (!passageContent) {
        for (let i = index + 1; i < toeicQuestions.length; i++) {
          const nextQ = toeicQuestions[i];
          if (nextQ.part === q.part && nextQ.passage_content && !isPlaceholderPassage(nextQ.passage_content)) {
            passageTitle = nextQ.passage_title || passageTitle;
            passageContent = nextQ.passage_content;
            break;
          }
        }
      }
    }

    if (!passageContent) {
      passageTitle = `Part ${q.part} Reading Passage`;
      passageContent = '<p>Read the passage carefully and select the best answer for each question below.</p>';
    }

    // Handle Multiple Passages JSON formatting
    try {
      let jsonStart = passageContent.indexOf('[');
      if (jsonStart !== -1) {
        let possibleHeader = passageContent.substring(0, jsonStart).trim();
        // Only proceed if it looks like an array and the header looks like our tag (or is empty)
        if (possibleHeader === '' || possibleHeader.includes('**[')) {
          let jsonStr = passageContent.substring(jsonStart);
          const passagesArr = JSON.parse(jsonStr); 
          
          if (Array.isArray(passagesArr)) {
            let headerHtml = possibleHeader ? `<div style="margin-bottom: 1rem; font-weight: bold; color: #a1a1aa;">${possibleHeader.replace(/\*\*/g, '')}</div>` : '';
            
            let htmlPassages = passagesArr.map((doc, idx) => {
              const colors = ['#00d2ff', '#30d158', '#af52de', '#ff9f0a'];
              const rgbBorder = ['0,210,255', '48,209,88', '175,82,222', '255,159,10'];
              const color = colors[idx % colors.length];
              const border = rgbBorder[idx % rgbBorder.length];
              
              let title = '';
              let text = '';
              if (typeof doc === 'string') {
                  text = doc;
              } else {
                  title = doc.title || doc.passage_title || '';
                  text = doc.text || doc.passage_text || doc.content || '';
              }

              let titleHtml = title ? `<div style="color: ${color}; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT ${idx+1}: ${title}</div>` : `<div style="color: ${color}; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT ${idx+1}</div>`;

              return `
                <div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(${border},0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                  ${titleHtml}
                  <p style="white-space: pre-line; line-height: 1.6; margin: 0;">${text}</p>
                </div>
              `;
            }).join('<hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;">');
            
            passageContent = headerHtml + htmlPassages;
          }
        }
      }
    } catch (e) {
      // Not a JSON array, ignore and render as normal text
    }

    // Top-Bottom Layout with NO Guidance Panel (100% Full Width Passage Box)
    pane.innerHTML = `
      <div class="toeic-passage-layout">
        <!-- TOP SECTION: Full-Width Reading Passage Box -->
        <div class="passage-top-row" style="margin-bottom: 1.5rem;">
          <div class="passage-container" style="max-height: 350px; overflow-y: auto; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; width: 100%;">
            <div class="passage-title" style="font-weight: 700; color: #00d2ff; margin-bottom: 0.8rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: space-between;">
              <span>📖 ${escapeHTML(passageTitle)}</span>
              <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 400;">Part ${q.part} (${q.part === 6 ? 'Text Completion' : 'Reading Comprehension'})</span>
            </div>
            <div class="passage-body" style="font-size: 0.95rem; line-height: 1.65; color: var(--text-primary);">
              ${passageContent}
            </div>
          </div>
        </div>

        <!-- BOTTOM SECTION: Question & Answer Choices -->
        <div class="passage-bottom-question" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
          <div class="q-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="q-number-badge" style="background: rgba(0, 210, 255, 0.15); color: #00d2ff; padding: 0.3rem 0.8rem; border-radius: 12px; font-weight: 700;">
              Question ${index + 1} of ${toeicQuestions.length} (Part ${q.part})
            </span>
            <button type="button" class="btn-flag ${isFlagged ? 'active' : ''}" onclick="toggleFlagCurrent('${q.question_id}')" style="background: none; border: 1px solid var(--border-color); color: ${isFlagged ? '#ffd60a' : 'var(--text-secondary)'}; padding: 0.3rem 0.75rem; border-radius: 20px; cursor: pointer; font-size: 0.85rem;">
              📌 ${isFlagged ? 'Flagged' : 'Flag'}
            </button>
          </div>

          <div class="q-text-box" style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; font-weight: 500;">
            ${escapeHTML(cleanQText)}
          </div>

          <div class="choice-list">
            ${['A', 'B', 'C', 'D'].map(key => `
              <div class="choice-card ${selectedChoice === key ? 'selected' : ''}" onclick="selectAnswer('${q.question_id}', '${key}')">
                <input type="radio" name="q_${q.question_id}" value="${key}" class="choice-radio" ${selectedChoice === key ? 'checked' : ''}>
                <span class="choice-label">(${key})</span>
                <span class="choice-text">${escapeHTML(q.choices[key])}</span>
              </div>
            `).join('')}
          </div>

          <div class="q-nav-buttons" style="display: flex; justify-content: space-between; gap: 1rem; margin-top: 1.8rem;">
            <button type="button" class="btn-q-prev" onclick="navigateQuestion(${index - 1})" ${index === 0 ? 'disabled' : ''}>
              ⬅️ Previous Question
            </button>
            <button type="button" class="btn-q-next" onclick="navigateQuestion(${index + 1})" ${index === toeicQuestions.length - 1 ? 'disabled' : ''}>
              Next Question ➡️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  updatePaletteHighlight();
}

window.navigateQuestion = function(index) {
  renderToeicQuestion(index);
};

window.selectAnswer = function(qId, key) {
  toeicUserAnswers[qId] = key;
  renderToeicQuestion(currentToeicIndex);
  updatePaletteHighlight();
};

window.toggleFlagCurrent = function(qId) {
  toeicFlagged[qId] = !toeicFlagged[qId];
  renderToeicQuestion(currentToeicIndex);
  updatePaletteHighlight();
};

function renderQuestionPalette() {
  const grid = document.getElementById('questionPaletteGrid');
  if (!grid) return;

  grid.innerHTML = toeicQuestions.map((q, idx) => `
    <button type="button" id="qbtn_${idx}" class="q-btn" onclick="navigateQuestion(${idx})">
      ${idx + 1}
    </button>
  `).join('');

  updatePaletteHighlight();
}

function updatePaletteHighlight() {
  toeicQuestions.forEach((q, idx) => {
    const btn = document.getElementById(`qbtn_${idx}`);
    if (!btn) return;

    let cls = 'q-btn';
    if (idx === currentToeicIndex) cls += ' current';
    if (toeicUserAnswers[q.question_id]) cls += ' answered';
    if (toeicFlagged[q.question_id]) cls += ' flagged';
    btn.className = cls;
  });

  const countBadge = document.getElementById('answeredCountBadge');
  if (countBadge) {
    const answeredCount = Object.keys(toeicUserAnswers).length;
    countBadge.textContent = `${answeredCount}/${toeicQuestions.length}`;
  }
}

function submitToeicExam() {
  if (toeicTimerInterval) clearInterval(toeicTimerInterval);

  let rawTotal = 0;
  let rawPart5 = 0;
  let totalPart5 = 0;
  let rawPart6 = 0;
  let totalPart6 = 0;
  let rawPart7 = 0;
  let totalPart7 = 0;

  toeicQuestions.forEach(q => {
    const isCorrect = (toeicUserAnswers[q.question_id] === q.correct_answer);
    if (q.part === 5) {
      totalPart5++;
      if (isCorrect) rawPart5++;
    } else if (q.part === 6) {
      totalPart6++;
      if (isCorrect) rawPart6++;
    } else if (q.part === 7) {
      totalPart7++;
      if (isCorrect) rawPart7++;
    }
    if (isCorrect) rawTotal++;
  });

  const totalQuestions = toeicQuestions.length;
  const normalizedRaw = Math.min(100, Math.max(0, Math.round((rawTotal / totalQuestions) * 100)));
  const scaledScore = TOEIC_RAW_TO_SCALED[normalizedRaw] || 5;

  let cefrLevel = 'A1';
  let cefrBadge = 'A1 Beginner';
  let cefrDesc = 'ทักษะภาษาอังกฤษพื้นฐานเริ่มต้น ควรปูพื้นฐานไวยากรณ์เพิ่มเติม';
  if (scaledScore >= 470) {
    cefrLevel = 'C1';
    cefrBadge = 'C1 Advanced';
    cefrDesc = 'เข้าใจภาษาอังกฤษในการทำงานระดับสูง บทความซับซ้อน ได้เป็นอย่างดีเยี่ยม';
  } else if (scaledScore >= 385) {
    cefrLevel = 'B2';
    cefrBadge = 'B2 Upper-Intermediate';
    cefrDesc = 'เข้าใจประเด็นหลักของบทความธุรกิจ เข้าใจและสื่อสารได้อย่างคล่องแคล่ว';
  } else if (scaledScore >= 275) {
    cefrLevel = 'B1';
    cefrBadge = 'B1 Intermediate';
    cefrDesc = 'สื่อสารภาษาอังกฤษในการทำงานระดับกลางได้อย่างมีประสิทธิภาพ';
  } else if (scaledScore >= 115) {
    cefrLevel = 'A2';
    cefrBadge = 'A2 Elementary';
    cefrDesc = 'เข้าใจประโยคและคำศัพท์ในชีวิตประจำวันและการทำงานขั้นพื้นฐาน';
  }

  // Display Results
  document.getElementById('resScaledScore').textContent = scaledScore;
  document.getElementById('resRawScore').textContent = rawTotal;
  document.getElementById('resTotalQuestions').textContent = totalQuestions;
  
  const accuracyPct = Math.round((rawTotal / totalQuestions) * 100);
  document.getElementById('resAccuracyPercent').textContent = `ความถูกต้อง ${accuracyPct}%`;

  const badgeEl = document.getElementById('resCefrBadge');
  if (badgeEl) {
    badgeEl.textContent = cefrBadge;
  }
  const descEl = document.getElementById('resCefrDesc');
  if (descEl) descEl.textContent = cefrDesc;

  // Render Part Breakdown Bars
  const p5Pct = totalPart5 > 0 ? Math.round((rawPart5 / totalPart5) * 100) : 0;
  const p6Pct = totalPart6 > 0 ? Math.round((rawPart6 / totalPart6) * 100) : 0;
  const p7Pct = totalPart7 > 0 ? Math.round((rawPart7 / totalPart7) * 100) : 0;

  document.getElementById('barPart5').style.width = `${p5Pct}%`;
  document.getElementById('statPart5').textContent = `${rawPart5}/${totalPart5} (${p5Pct}%)`;

  document.getElementById('barPart6').style.width = `${p6Pct}%`;
  document.getElementById('statPart6').textContent = `${rawPart6}/${totalPart6} (${p6Pct}%)`;

  document.getElementById('barPart7').style.width = `${p7Pct}%`;
  document.getElementById('statPart7').textContent = `${rawPart7}/${totalPart7} (${p7Pct}%)`;

  // Save Attempt to localStorage
  saveToeicHistory({
    date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    mode: toeicExamMode,
    rawScore: rawTotal,
    totalQuestions,
    scaledScore,
    cefrLevel
  });

  // Switch UI Screens
  document.getElementById('toeicExamWorkspace').style.display = 'none';
  document.getElementById('toeicTimerWidget').style.display = 'none';
  document.getElementById('toeicResultsScreen').style.display = 'block';

  renderSkillImprovementRecommendations();
  renderDetailedReviewList();
}

function renderSkillImprovementRecommendations() {
  const container = document.getElementById('toeicSkillRecommendations');
  if (!container) return;

  const incorrectQuestions = toeicQuestions.filter(q => toeicUserAnswers[q.question_id] !== q.correct_answer);

  if (incorrectQuestions.length === 0) {
    container.innerHTML = `
      <div style="padding: 1rem; background: rgba(48, 209, 88, 0.15); border: 1px solid #30d158; border-radius: 8px; color: #30d158;">
        🎉 <strong>ยอดเยี่ยมระดับมืออาชีพ!</strong> คุณทำข้อสอบถูกทุกข้อ ความรู้ไวยากรณ์และการอ่านภาษาอังกฤษของคุณอยู่ในระดับท็อปมาตรฐาน C1
      </div>
    `;
    return;
  }

  // Count primary topic for each incorrect question
  const topicCountMap = {};
  incorrectQuestions.forEach(q => {
    const primaryTopic = (Array.isArray(q.tags) && q.tags.length > 0) ? q.tags[0] : 'General Grammar';
    topicCountMap[primaryTopic] = (topicCountMap[primaryTopic] || 0) + 1;
  });

  const sortedTopics = Object.keys(topicCountMap).sort((a, b) => topicCountMap[b] - topicCountMap[a]);
  // Limit topics shown to not exceed the actual number of incorrect questions
  const displayTopics = sortedTopics.slice(0, Math.min(sortedTopics.length, incorrectQuestions.length));

  const tagAdviceMap = {
    'Grammar': 'ควรทบทวนเรื่องโครงสร้างไวยากรณ์ (Grammar Rules), Tenses, และการผันกริยาตามประธาน (Subject-Verb Agreement)',
    'Vocabulary': 'ควรท่องคลังคำศัพท์ภาษาอังกฤษเชิงธุรกิจ (Business Vocabulary) และเรื่องคำพ้องความหมาย (Synonyms)',
    'Preposition': 'ควรฝึกฝนบุพบทบอกเวลาและสถานที่ (Prepositions of Time & Place) เช่น by, until, on, within',
    'Part of Speech': 'ควรฝึกแยกประเภทของคำ (Noun, Verb, Adjective, Adverb) และตำแหน่งการวางคำในประโยค',
    'Business Context': 'ควรฝึกอ่านเอกสารภาษาอังกฤษในบริบทออฟฟิศ การจัดซื้อ การประชุม และอีเมลติดต่อธุรกิจ',
    'If-Clause': 'ควรทบทวนประโยคเงื่อนไข If-Clause ทั้ง 3 รูปแบบ',
    'Passive Voice': 'ควรทบทวนเรื่องประธานโดนกระทำ (be + V.3)',
    'Gerund': 'ควรทบทวนและฝึกทำโจทย์ในหมวด Gerund และ Infinitive เพิ่มเติม',
    'Adjective': 'ควรทบทวนคำคุณศัพท์และการขยายคำนามในประโยค',
    'Part 6': 'ควรฝึกอ่านบทความสั้นและทักษะการเติมประโยคที่สอดคล้องกับบริบท (Sentence Insertion)',
    'Part 7': 'ควรฝึกสแกนหาข้อมูลอย่างรวดเร็ว (Skimming & Scanning) ในอีเมล บันทึกข้อความ และเอกสารหลายฉบับ'
  };

  container.innerHTML = displayTopics.map(topic => {
    const advice = tagAdviceMap[topic] || `ควรทบทวนและฝึกทำโจทย์ในหมวด ${topic} เพิ่มเติมเพื่อลดข้อผิดพลาด`;
    return `
      <div style="display: flex; gap: 0.8rem; align-items: flex-start; padding: 0.85rem 1.2rem; background: rgba(255, 255, 255, 0.04); border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 0.6rem;">
        <span style="font-size: 1.2rem;">📌</span>
        <div>
          <strong style="color: #00d2ff; font-size: 0.98rem;">ด้านที่ต้องปรับปรุง: ${escapeHTML(topic)} (ตอบผิด ${topicCountMap[topic]} ข้อ)</strong>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.4;">${advice}</p>
        </div>
      </div>
    `;
  }).join('');
}

function toggleDetailedReview() {
  const container = document.getElementById('toeicReviewContainer');
  if (container) {
    const isHidden = (container.style.display === 'none');
    container.style.display = isHidden ? 'block' : 'none';
    if (isHidden) container.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderDetailedReviewList() {
  const reviewList = document.getElementById('toeicReviewList');
  if (!reviewList) return;

  reviewList.innerHTML = toeicQuestions.map((q, idx) => {
    const userAns = toeicUserAnswers[q.question_id] || 'ยังไม่ได้ตอบ';
    const isCorrect = (userAns === q.correct_answer);

    return `
      <div class="review-card ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="review-header" style="display: flex; justify-content: space-between; margin-bottom: 0.8rem;">
          <span style="font-weight: 700; color: ${isCorrect ? '#30d158' : '#ff453a'};">
            ${isCorrect ? '✅ ถูกต้อง (Correct)' : '❌ ตอบผิด (Incorrect)'} — ข้อ ${idx + 1} (Part ${q.part})
          </span>
          <span style="font-size: 0.85rem; color: var(--text-tertiary);">CEFR ${q.cefr_level || 'B1'}</span>
        </div>

        <div style="font-size: 1.05rem; font-weight: 500; margin-bottom: 1rem; color: var(--text-primary);">
          ${escapeHTML(q.question_text)}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; font-size: 0.95rem;">
          <div>คำตอบของคุณ: <strong style="color: ${isCorrect ? '#30d158' : '#ff453a'};">(${userAns}) ${escapeHTML(q.choices[userAns] || '')}</strong></div>
          <div>คำตอบที่ถูกต้อง: <strong style="color: #30d158;">(${q.correct_answer}) ${escapeHTML(q.choices[q.correct_answer])}</strong></div>
        </div>

        <div class="review-explanation">
          <strong>💡 คำอธิบายเฉลยภาษาไทย:</strong><br>
          ${escapeHTML(q.detailed_explanation ? q.detailed_explanation.correct_reason : 'ไม่มีคำอธิบายเพิ่มเติม')}<br><br>
          <small style="color: var(--text-secondary);">${escapeHTML(q.detailed_explanation ? q.detailed_explanation.incorrect_reasons : '')}</small>
        </div>
      </div>
    `;
  }).join('');
}

function resetToeicExam() {
  if (toeicTimerInterval) clearInterval(toeicTimerInterval);
  document.getElementById('toeicResultsScreen').style.display = 'none';
  document.getElementById('toeicExamWorkspace').style.display = 'none';
  document.getElementById('toeicReviewContainer').style.display = 'none';
  document.getElementById('toeicTimerWidget').style.display = 'none';
  document.getElementById('toeicStartScreen').style.display = 'block';
  renderToeicHistory();
}

function saveToeicHistory(record) {
  try {
    let history = JSON.parse(localStorage.getItem('toeic_history') || '[]');
    history.unshift(record);
    history = history.slice(0, 10); // Keep last 10 attempts
    localStorage.setItem('toeic_history', JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to localStorage:', e);
  }
}

function renderToeicHistory() {
  const container = document.getElementById('toeicHistoryList');
  if (!container) return;

  try {
    const history = JSON.parse(localStorage.getItem('toeic_history') || '[]');
    if (history.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">ยังไม่มีประวัติการทำข้อสอบ</p>';
      return;
    }

    container.innerHTML = history.map(item => `
      <div class="history-item">
        <div>
          <strong style="color: #00d2ff; font-size: 1.1rem;">TOEIC Reading: ${item.scaledScore} / 495 คะแนน</strong>
          <span style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 0.8rem;">(${item.rawScore}/${item.totalQuestions} ข้อ)</span>
          <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.2rem;">📅 ${item.date} • ${item.mode === 'full' ? 'Full Exam (100 Qs)' : 'Quick Practice (20 Qs)'}</div>
        </div>
        <div>
          <span class="cefr-pill" style="font-size: 0.85rem; padding: 0.25rem 0.75rem;">${item.cefrLevel}</span>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">ยังไม่มีประวัติการทำข้อสอบ</p>';
  }
}
