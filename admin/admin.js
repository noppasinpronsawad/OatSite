/**
 * Admin Panel JavaScript Architecture
 * Authentication, 15-Minute Auto-Logout, Interactive Image Cropper (File & URL),
 * Flatpickr Modern Datetime Picker (DD/MM/YYYY HH:mm),
 * Search & Date Range Filters, Category Filters, Newest-to-Oldest Default Sorting,
 * 10 Articles/Page Pagination, Visual Rich Text Toolbar & Posts CRUD
 * Author: Noppasin Pronsawad
 */


window.closeAdminModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
};

window.showNewsLogDetails = function(logId) {
  console.log('[Modal] showNewsLogDetails called for id:', logId);
  const logs = window.cachedDailyNewsLogs || [
    {
      id: 'news-001',
      date: '2026-08-08 07:30',
      source: 'BBC World News / Business',
      topic: 'Global Tech & Enterprise Supply Chain Modernization 2026',
      url: 'https://www.bbc.com/news/business',
      summary: 'สรุปข่าวเศรษฐกิจและห่วงโซ่อุปทานระดับโลก มีการใช้เทคโนโลยีปัญญาประดิษฐ์ (AI) เข้ามาเพิ่มประสิทธิภาพองค์กร',
      questionsGenerated: 100,
      partBreakdown: { part5: 30, part6: 30, part7: 40 }
    }
  ];
  const item = logs.find(l => l.id === logId) || logs[0];

  const srcEl = document.getElementById('newsModalSource');
  const headEl = document.getElementById('newsModalHeadline');
  const urlEl = document.getElementById('newsModalUrl');
  const dateEl = document.getElementById('newsModalDate');
  const sumEl = document.getElementById('newsModalSummary');
  const breakdownEl = document.getElementById('newsModalBreakdown');

  if (srcEl) srcEl.textContent = item.source || 'BBC News';
  if (headEl) headEl.textContent = item.topic || 'Global Business News';
  if (urlEl) {
    urlEl.textContent = item.url || 'https://www.bbc.com/news/business';
    urlEl.href = item.url || 'https://www.bbc.com/news/business';
  }
  if (dateEl) dateEl.textContent = item.date || '2026-08-08 07:30';
  if (sumEl) sumEl.textContent = item.summary || 'สรุปเนื้อหาข่าวสารภาษาไทยเรียบร้อยแล้ว';

  if (breakdownEl && item.partBreakdown) {
    breakdownEl.innerHTML = `
      <span class="timer-badge" style="background: rgba(0,210,255,0.15); color: #00d2ff;">Part 5: ${item.partBreakdown.part5} ข้อ</span>
      <span class="timer-badge" style="background: rgba(48,209,88,0.15); color: #30d158;">Part 6: ${item.partBreakdown.part6} ข้อ</span>
      <span class="timer-badge" style="background: rgba(175,82,222,0.15); color: #af52de;">Part 7: ${item.partBreakdown.part7} ข้อ</span>
      <strong style="color: #fff; margin-left: auto;">รวมทั้งสิ้น: +${item.questionsGenerated} ข้อ</strong>
    `;
  }

  const modal = document.getElementById('newsDetailModal');
  if (modal) {
    modal.style.setProperty('display', 'flex', 'important'); modal.classList.add('active');
    modal.classList.add('active');
  } else {
    alert('📰 Details: ' + item.topic);
  }
};

window.openQuestionBankModal = async function() {
  console.log('[Modal] openQuestionBankModal called');
  const container = document.getElementById('qbListContainer');
  if (container) container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 2rem;">⚡ กำลังโหลดรายการข้อสอบจาก MongoDB Atlas...</div>';

  const modal = document.getElementById('questionBankModal');
  if (modal) {
    modal.style.setProperty('display', 'flex', 'important'); modal.classList.add('active');
    modal.classList.add('active');
  }

  try {
    const res = await fetch('/api/toeic/questions?_t=' + Date.now(), { cache: 'no-store' });
    const data = await res.json();
    if (data.success && Array.isArray(data.questions)) {
      window.cachedDbQuestions = data.questions;
      window.filterQuestionBank();
    } else {
      if (container) container.innerHTML = '<div style="color: #ff453a; text-align: center;">❌ ไม่สามารถโหลดรายการข้อสอบได้</div>';
    }
  } catch (err) {
    console.error('Fetch DB questions error:', err);
    if (container) container.innerHTML = '<div style="color: #ff453a; text-align: center;">❌ ไม่สามารถเชื่อมต่อ DB ได้</div>';
  }
};


function initAdminPanel() {
  try { initThemeToggle(); } catch(e) { console.error('Theme Init Error:', e); }
  try { initAuthFlow(); } catch(e) { console.error('Auth Init Error:', e); }
  try { initDashboard(); } catch(e) { console.error('Dashboard Init Error:', e); }
  try { initRichTextEditor(); } catch(e) { console.error('Editor Init Error:', e); }
  try { initImageCropper(); } catch(e) { console.error('Cropper Init Error:', e); }
  try { initSchedulePicker(); } catch(e) { console.error('Schedule Init Error:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
  initAdminPanel();
}

// Global state variables
let autoLogoutTimer = null;
let sessionHeartbeatTimer = null;
let cropperInstance = null;
let publishAtFlatpickr = null;
let fromDateFlatpickr = null;
let toDateFlatpickr = null;
let unsavedCropPublicId = null;

let allAdminPosts = [];
let filteredAdminPosts = [];
let currentAdminPage = 1;
const ADMIN_ITEMS_PER_PAGE = 10;
const FORTY_FIVE_MINUTES_MS = 2700000; // 45 minutes = 2,700,000 milliseconds

let isExecutingLogin = false;

window.executeAdminLogin = async function executeLogin() {
  if (isExecutingLogin) return;

  const pwdEl = document.getElementById('adminPassword');
  const btnEl = document.getElementById('loginBtn');
  const password = pwdEl ? pwdEl.value.trim() : '';

  if (!password) {
    showLoginAlert('⚠️ กรุณากรอกรหัสผ่านก่อนเข้าสู่ระบบ', true);
    if (pwdEl) pwdEl.focus();
    return;
  }

  isExecutingLogin = true;
  showLoginAlert('🔄 กำลังตรวจสอบรหัสผ่าน กรุณารอสักครู่...', false);
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span class="spinner-icon"></span> 🔄 กำลังเข้าสู่ระบบ...</span>';
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse response JSON:', e);
    }

    if (response.ok && data.token) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_login_time', Date.now().toString());
      if (data.sessionId) localStorage.setItem('admin_session_id', data.sessionId);

      showLoginAlert('✅ เข้าสู่ระบบสำเร็จ! กำลังเปิดหน้า Dashboard...', false);
      if (btnEl) {
        btnEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span class="spinner-icon"></span> ✅ สำเร็จ! กำลังโหลด Dashboard...</span>';
      }

      if (pwdEl) pwdEl.value = '';
      setTimeout(() => {
        showDashboardView();
        scheduleAutoLogout(FORTY_FIVE_MINUTES_MS);
        loadPostsTable();
      }, 500);
    } else {
      const errMsg = data.error || (data.message ? data.message : `Authentication failed (Status ${response.status})`);
      showLoginAlert(`❌ รหัสผ่านไม่ถูกต้อง หรือเกิดข้อผิดพลาด: ${errMsg}`, true);
      if (pwdEl) {
        pwdEl.value = '';
        pwdEl.focus();
      }
    }
  } catch (err) {
    console.error('Login error:', err);
    const errMsg = `ไม่สามารถเชื่อมต่อกับ Server ได้: ${err.message || err}`;
    showLoginAlert(`❌ ${errMsg}`, true);
  } finally {
    isExecutingLogin = false;
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = '<span>🔓 Unlock CMS</span>';
    }
  }
};

window.switchAdminTab = function(tab) {
  const blogSec = document.getElementById('blogManagementSection');
  const sysSec = document.getElementById('systemDashboardSection');
  const toeicSec = document.getElementById('toeicStatsSection');

  const blogBtn = document.getElementById('blogMgmtTabBtn');
  const sysBtn = document.getElementById('sysDashTabBtn');
  const toeicBtn = document.getElementById('toeicStatsTabBtn');

  if (blogSec) blogSec.style.display = 'none';
  if (sysSec) sysSec.style.display = 'none';
  if (toeicSec) toeicSec.style.display = 'none';

  if (blogBtn) blogBtn.classList.remove('active');
  if (sysBtn) sysBtn.classList.remove('active');
  if (toeicBtn) toeicBtn.classList.remove('active');

  if (tab === 'system') {
    if (sysSec) sysSec.style.display = 'block';
    if (sysBtn) sysBtn.classList.add('active');
    fetchAdminMetrics();
  } else if (tab === 'toeic') {
    if (toeicSec) toeicSec.style.display = 'block';
    if (toeicBtn) toeicBtn.classList.add('active');
    fetchAdminMetrics();
  } else {
    if (blogSec) blogSec.style.display = 'block';
    if (blogBtn) blogBtn.classList.add('active');
  }
};

async function fetchAdminMetrics() {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('admin_jwt_token');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/metrics', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.success && data.metrics) {
      const m = data.metrics;
      
      // Vercel
      if (m.vercel) {
        document.getElementById('m_vercel_status').textContent = m.vercel.status;
        document.getElementById('m_vercel_region').textContent = m.vercel.region;
      }

      // Cloudinary
      if (m.cloudinary) {
        document.getElementById('m_cloud_name').textContent = m.cloudinary.cloudName;
      }

      // MongoDB
      if (m.mongodb) {
        document.getElementById('m_mongo_posts').textContent = m.mongodb.totalPosts;
        document.getElementById('m_mongo_toeic').textContent = m.mongodb.totalToeicQuestions;
      }

      // Summary & Daily News Ingestion Logs
      const summaryQs = document.getElementById('summary_total_qs');
      if (summaryQs && m.mongodb) {
        summaryQs.textContent = `${m.mongodb.totalToeicQuestions} ข้อ`;
      }

      window.cachedDailyNewsLogs = m.dailyNewsLogs || [];

      const logsTableBody = document.getElementById('dailyNewsLogsTableBody');
      if (logsTableBody && m.dailyNewsLogs && Array.isArray(m.dailyNewsLogs)) {
        logsTableBody.innerHTML = m.dailyNewsLogs.map(log => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.6rem; color: var(--text-secondary);">${log.date}</td>
            <td style="padding: 0.6rem; font-weight: 500;">${log.source}</td>
            <td style="padding: 0.6rem;">${log.topic}</td>
            <td style="padding: 0.6rem;"><strong style="color: #30d158;">+${log.questionsGenerated} ข้อ</strong></td>
            <td style="padding: 0.6rem;">${log.status}</td>
            <td style="padding: 0.6rem;">
              <button type="button" class="btn-admin-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;" onclick="window.showNewsLogDetails('${log.id}')">
                🔍 ดูรายละเอียด
              </button>
            </td>
          </tr>
        `).join('');
      }

      // Gemini API
      if (m.gemini) {
        document.getElementById('m_gemini_key').textContent = m.gemini.maskedKey;
        document.getElementById('m_gemini_status').textContent = m.gemini.status;
        const badge = document.getElementById('m_gemini_badge');
        if (badge) {
          if (m.gemini.configured) {
            badge.style.background = 'rgba(48, 209, 88, 0.15)';
            badge.style.color = '#30d158';
            badge.textContent = 'GEMINI ACTIVE';
          } else {
            badge.style.background = 'rgba(255, 69, 58, 0.15)';
            badge.style.color = '#ff453a';
            badge.textContent = 'KEY MISSING';
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch admin metrics:', err);
  }
}

/* ==========================================================================
   1. Light / Dark Theme Switcher
   ========================================================================== */
function updateThemeToggleIcon(theme) {
  const iconEl = document.querySelector('#themeToggleBtn .theme-icon') || document.getElementById('themeToggleBtn');
  if (iconEl) {
    iconEl.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('apple_resume_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('apple_resume_theme', newTheme);
      updateThemeToggleIcon(newTheme);
    });
  }
}

/* ==========================================================================
   2. Authentication & Single Active Session Manager (Auto-Logout & Heartbeat)
   ========================================================================== */
function startSessionHeartbeat() {
  stopSessionHeartbeat();
  // Check active session status every 8 seconds
  sessionHeartbeatTimer = setInterval(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return stopSessionHeartbeat();

    try {
      const res = await fetch('/api/auth/session', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        let data = {};
        try { data = await res.json(); } catch (e) {}
        stopSessionHeartbeat();
        forceLogout();
        const msg = '🚨 Security Alert: Another login session was detected from another device or browser tab. You have been logged out immediately for security.';
        showLoginAlert(msg, true);
        alert(msg);
      }
    } catch (err) {
      console.error('Session heartbeat error:', err);
    }
  }, 8000);
}

function stopSessionHeartbeat() {
  if (sessionHeartbeatTimer) {
    clearInterval(sessionHeartbeatTimer);
    sessionHeartbeatTimer = null;
  }
}

function initAuthFlow() {
  try {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('adminPassword');
    const loginAlert = document.getElementById('loginAlert');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check existing session on load
    let token = null;
    let loginTime = 0;
    try {
      token = localStorage.getItem('admin_token');
      loginTime = parseInt(localStorage.getItem('admin_login_time') || '0', 10);
    } catch(e) {
      console.warn("localStorage not available", e);
    }
    const now = Date.now();

    if (token && loginTime && (now - loginTime < FORTY_FIVE_MINUTES_MS)) {
      const remainingMs = FORTY_FIVE_MINUTES_MS - (now - loginTime);
      showDashboardView();
      scheduleAutoLogout(remainingMs);
    } else {
      forceLogout();
    }

    // Handle Login Submit (Prevents Native HTML Form Refresh)
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.executeAdminLogin();
        return false;
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        forceLogout();
      });
    }
  } catch(err) {
    console.error("Critical error in initAuthFlow:", err);
  }
}

function scheduleAutoLogout(delayMs) {
  if (autoLogoutTimer) clearTimeout(autoLogoutTimer);

  const timerBadge = document.getElementById('sessionTimer');
  if (timerBadge) {
    const minutesLeft = Math.round(delayMs / 60000);
    timerBadge.textContent = `Session: ~${minutesLeft} min left`;
  }

  autoLogoutTimer = setTimeout(() => {
    alert('Security Alert: Your 45-minute admin session has expired. Please log in again.');
    forceLogout();
  }, delayMs);
}

function forceLogout() {
  if (autoLogoutTimer) clearTimeout(autoLogoutTimer);
  stopSessionHeartbeat();
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_login_time');
  localStorage.removeItem('admin_session_id');

  document.getElementById('loginView').style.display = 'block';
  document.getElementById('dashboardView').style.display = 'none';

  const timerBadge = document.getElementById('sessionTimer');
  if (timerBadge) timerBadge.textContent = 'Session Expiry: 45 Mins';
}

function showDashboardView() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'block';
  startSessionHeartbeat();
  fetchAdminMetrics();

  const refreshBtn = document.getElementById('refreshMetricsBtn');
  if (refreshBtn && !refreshBtn.dataset.bound) {
    refreshBtn.dataset.bound = 'true';
    refreshBtn.addEventListener('click', () => {
      fetchAdminMetrics();
    });
  }
}

function showLoginAlert(msg, isError) {
  const alertBox = document.getElementById('loginAlert');
  if (!alertBox) return;
  if (!msg) {
    alertBox.style.display = 'none';
    return;
  }
  alertBox.textContent = msg;
  alertBox.className = `alert-banner ${isError ? 'alert-error' : 'alert-success'}`;
  alertBox.style.display = 'block';
}

function showDashboardAlert(msg, isError) {
  const alertBox = document.getElementById('dashboardAlert');
  if (!alertBox) return;
  if (!msg) {
    alertBox.style.display = 'none';
    return;
  }
  alertBox.textContent = msg;
  alertBox.className = `alert-banner ${isError ? 'alert-error' : 'alert-success'}`;
  alertBox.style.display = 'block';
  setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
}

/* ==========================================================================
   3. Interactive Image Cropper (Supports BOTH Local File & Image URL)
   ========================================================================== */
function initImageCropper() {
  const dropzoneBox = document.getElementById('dropzoneBox');
  const imageFileInput = document.getElementById('imageFileInput');
  const cropModal = document.getElementById('cropModal');
  const cropImageElement = document.getElementById('cropImageElement');
  const closeCropModalBtn = document.getElementById('closeCropModalBtn');
  const cancelCropBtn = document.getElementById('cancelCropBtn');
  const applyCropBtn = document.getElementById('applyCropBtn');

  const cropZoomInBtn = document.getElementById('cropZoomInBtn');
  const cropZoomOutBtn = document.getElementById('cropZoomOutBtn');
  const cropResetBtn = document.getElementById('cropResetBtn');

  const postImageUrlInput = document.getElementById('postImageUrl');
  const cropUrlBtn = document.getElementById('cropUrlBtn');
  const imagePreviewBox = document.getElementById('imagePreviewBox');

  if (dropzoneBox && imageFileInput) {
    dropzoneBox.addEventListener('click', () => imageFileInput.click());

    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        cropImageElement.crossOrigin = 'anonymous';
        cropImageElement.src = event.target.result;
        openCropModal();
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle URL Image Cropping
  if (postImageUrlInput && cropUrlBtn) {
    postImageUrlInput.addEventListener('input', () => {
      const url = postImageUrlInput.value.trim();
      if (url) {
        cropUrlBtn.style.display = 'block';
        imagePreviewBox.src = url;
        imagePreviewBox.style.display = 'block';
      } else {
        cropUrlBtn.style.display = 'none';
        imagePreviewBox.style.display = 'none';
      }
    });

    cropUrlBtn.addEventListener('click', () => {
      const url = postImageUrlInput.value.trim();
      if (!url) {
        alert('Please enter a valid Image URL first.');
        return;
      }
      cropImageElement.crossOrigin = 'anonymous';
      cropImageElement.src = url;
      openCropModal();
    });
  }

  function openCropModal() {
    cropModal.classList.add('active');
    if (cropperInstance) cropperInstance.destroy();

    cropperInstance = new Cropper(cropImageElement, {
      aspectRatio: 16 / 9,
      viewMode: 1,
      autoCropArea: 0.9,
      responsive: true,
      zoomable: true,
      movable: true,
      scalable: true
    });
  }

  function closeCropModal() {
    cropModal.classList.remove('active');
    if (cropperInstance) {
      cropperInstance.destroy();
      cropperInstance = null;
    }
  }

  if (closeCropModalBtn) closeCropModalBtn.addEventListener('click', closeCropModal);
  if (cancelCropBtn) cancelCropBtn.addEventListener('click', closeCropModal);

  if (cropZoomInBtn) {
    cropZoomInBtn.addEventListener('click', () => {
      if (cropperInstance) cropperInstance.zoom(0.1);
    });
  }

  if (cropZoomOutBtn) {
    cropZoomOutBtn.addEventListener('click', () => {
      if (cropperInstance) cropperInstance.zoom(-0.1);
    });
  }

  if (cropResetBtn) {
    cropResetBtn.addEventListener('click', () => {
      if (cropperInstance) cropperInstance.reset();
    });
  }

  // Crop & Upload to Cloudinary
  if (applyCropBtn) {
    applyCropBtn.addEventListener('click', async () => {
      if (!cropperInstance) return;

      const origBtnHTML = applyCropBtn.innerHTML;
      const dropzoneText = document.getElementById('dropzoneText');
      
      applyCropBtn.disabled = true;
      applyCropBtn.style.opacity = '0.6';
      applyCropBtn.innerHTML = '<span>⏳ Uploading to Cloudinary...</span>';
      if (dropzoneText) dropzoneText.textContent = '⏳ Cropping & uploading image to Cloudinary...';

      try {
        const canvas = cropperInstance.getCroppedCanvas({
          width: 1200,
          height: 675
        });

        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        const token = localStorage.getItem('admin_token') || '';
        let res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ image: croppedBase64 })
        });

        // Robust fallback retry if Vercel route returns 404 for /api/upload
        if (res.status === 404) {
          console.warn('/api/upload returned 404, retrying /api/upload/index...');
          res = await fetch('/api/upload/index', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ image: croppedBase64 })
          });
        }

        if (res.status === 401) {
          forceLogout();
          return;
        }

        let data = {};
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            data = await res.json();
          } catch (e) {
            data = { error: 'Invalid JSON response from server' };
          }
        } else {
          const rawText = await res.text();
          console.error('Server returned non-JSON error:', rawText);
          data = { error: `Server returned HTTP status ${res.status}` };
        }

        if (res.ok && data.url) {
          // Store public_id of unsaved crop for automatic cleanup if modal is cancelled
          unsavedCropPublicId = data.public_id || null;
          postImageUrlInput.value = data.url;
          imagePreviewBox.src = data.url;
          imagePreviewBox.style.display = 'block';
          if (cropUrlBtn) cropUrlBtn.style.display = 'block';
          if (dropzoneText) dropzoneText.textContent = '✅ Image cropped & uploaded to Cloudinary!';
        } else {
          alert(`Upload Error: ${data.error || 'Failed to upload image'}`);
          if (dropzoneText) dropzoneText.textContent = '📸 Click or drag image file here to crop & upload';
        }
      } catch (err) {
        console.error('Crop upload error:', err);
        alert(`Crop upload failed: ${err.message || err}`);
        if (dropzoneText) dropzoneText.textContent = '📸 Click or drag image file here to crop & upload';
      } finally {
        applyCropBtn.disabled = false;
        applyCropBtn.style.opacity = '1';
        applyCropBtn.innerHTML = origBtnHTML;
      }
    });
  }
}

/* ==========================================================================
   4. Flatpickr Datetime Picker Integration (DD/MM/YYYY HH:mm) & Schedule Presets
   ========================================================================== */
function formatDDMMYYYYHHmm(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const mins = String(dateObj.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${mins}`;
}

function initSchedulePicker() {
  const enableScheduleCheck = document.getElementById('enableScheduleCheck');
  const scheduleFieldWrap = document.getElementById('scheduleFieldWrap');
  const postPublishAtInput = document.getElementById('postPublishAt');
  const formattedDateBadge = document.getElementById('formattedDateBadge');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!enableScheduleCheck || !scheduleFieldWrap || !postPublishAtInput) return;

  // Initialize Flatpickr on #postPublishAt input field
  if (typeof flatpickr !== 'undefined') {
    publishAtFlatpickr = flatpickr(postPublishAtInput, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      altInput: true,
      altFormat: "d/m/Y H:i", // Displays DD/MM/YYYY HH:mm
      time_24hr: true,
      allowInput: true,
      clickOpens: true,
      appendTo: document.body,
      onChange: (selectedDates) => {
        if (selectedDates && selectedDates[0]) {
          updateFormattedBadge(selectedDates[0]);
        }
      }
    });
  }

  enableScheduleCheck.addEventListener('change', () => {
    if (enableScheduleCheck.checked) {
      scheduleFieldWrap.style.opacity = '1';
      scheduleFieldWrap.style.pointerEvents = 'auto';
      postPublishAtInput.disabled = false;
      if (publishAtFlatpickr) {
        if (publishAtFlatpickr.altInput) publishAtFlatpickr.altInput.disabled = false;
        if (publishAtFlatpickr.element) publishAtFlatpickr.element.disabled = false;
      }

      if (!postPublishAtInput.value && (!publishAtFlatpickr || !publishAtFlatpickr.selectedDates[0])) {
        const defaultDate = new Date(Date.now() + 3600000); // 1 hr in future
        if (publishAtFlatpickr) {
          publishAtFlatpickr.setDate(defaultDate);
        } else {
          postPublishAtInput.value = defaultDate.toISOString().slice(0, 16);
        }
        updateFormattedBadge(defaultDate);
      }
    } else {
      scheduleFieldWrap.style.opacity = '0.4';
      scheduleFieldWrap.style.pointerEvents = 'none';
      postPublishAtInput.disabled = true;
      if (publishAtFlatpickr) {
        if (publishAtFlatpickr.altInput) publishAtFlatpickr.altInput.disabled = true;
        if (publishAtFlatpickr.element) publishAtFlatpickr.element.disabled = true;
        publishAtFlatpickr.clear();
      }
      postPublishAtInput.value = '';
      if (formattedDateBadge) formattedDateBadge.style.display = 'none';
    }
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-preset');
      const now = new Date();
      let targetDate = new Date();

      if (type === '1h') {
        targetDate = new Date(now.getTime() + 3600000);
      } else if (type === 'tomorrow') {
        targetDate.setDate(now.getDate() + 1);
        targetDate.setHours(9, 0, 0, 0);
      } else if (type === 'nextweek') {
        targetDate.setDate(now.getDate() + 7);
        targetDate.setHours(9, 0, 0, 0);
      }

      enableScheduleCheck.checked = true;
      scheduleFieldWrap.style.opacity = '1';
      scheduleFieldWrap.style.pointerEvents = 'auto';
      postPublishAtInput.disabled = false;
      if (publishAtFlatpickr) {
        if (publishAtFlatpickr.altInput) publishAtFlatpickr.altInput.disabled = false;
        if (publishAtFlatpickr.element) publishAtFlatpickr.element.disabled = false;
        publishAtFlatpickr.setDate(targetDate);
      } else {
        postPublishAtInput.value = targetDate.toISOString().slice(0, 16);
      }
      updateFormattedBadge(targetDate);
    });
  });

  function updateFormattedBadge(dateObj) {
    if (!formattedDateBadge) return;
    const formatted = formatDDMMYYYYHHmm(dateObj);
    if (formatted) {
      formattedDateBadge.textContent = `📅 กำหนดเผยแพร่: ${formatted} (รูปแบบ DD/MM/YYYY HH:mm)`;
      formattedDateBadge.style.display = 'inline-block';
    }
  }
}

/* ==========================================================================
   5. Visual Rich Text Editor Toolbar (H1-H4, B/I/U, Font Size, Image URL insert)
   Strictly Enforces NO Color Customization
   ========================================================================== */
function initRichTextEditor() {
  const toolbar = document.getElementById('editorToolbar');
  const editorContent = document.getElementById('postContentEditor');
  const headingSelect = document.getElementById('editorHeadingSelect');
  const fontSizeSelect = document.getElementById('editorFontSizeSelect');
  const insertImageUrlBtn = document.getElementById('insertImageUrlBtn');

  if (!toolbar || !editorContent) return;

  // Format buttons (Bold, Italic, Underline, RemoveFormat)
  const buttons = toolbar.querySelectorAll('.toolbar-btn[data-command]');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-command');
      document.execCommand(cmd, false, null);
      editorContent.focus();
      updateActiveToolbarState();
    });
  });

  // Heading Selector (p, h1, h2, h3, h4)
  if (headingSelect) {
    headingSelect.addEventListener('change', () => {
      const val = headingSelect.value;
      document.execCommand('formatBlock', false, `<${val}>`);
      editorContent.focus();
    });
  }

  // Font Size Selector (1, 3, 4, 6)
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', () => {
      const val = fontSizeSelect.value;
      document.execCommand('fontSize', false, val);
      editorContent.focus();
    });
  }

  // Insert Image URL or <pic>URL</pic> tag handler
  if (insertImageUrlBtn) {
    insertImageUrlBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = prompt('Enter Image URL (or paste <pic>https://...</pic>):');
      if (!input) return;

      let cleanUrl = input.trim();

      const picMatch = cleanUrl.match(/<pic>(.*?)<\/pic>/i);
      if (picMatch && picMatch[1]) {
        cleanUrl = picMatch[1].trim();
      }

      if (cleanUrl) {
        const imageHTML = `<p><img src="${cleanUrl}" class="article-body-img" alt="Article Image" onerror="this.style.display='none'"></p>`;
        document.execCommand('insertHTML', false, imageHTML);
        editorContent.focus();
      }
    });
  }

  // Auto-convert typed <pic>https://...</pic> tags inside editor automatically
  editorContent.addEventListener('input', () => {
    const rawHTML = editorContent.innerHTML;
    if (rawHTML.includes('&lt;pic&gt;') || rawHTML.includes('<pic>')) {
      const convertedHTML = rawHTML
        .replace(/&lt;pic&gt;(.*?)&lt;\/pic&gt;/gi, '<img src="$1" class="article-body-img" alt="Article Image">')
        .replace(/<pic>(.*?)<\/pic>/gi, '<img src="$1" class="article-body-img" alt="Article Image">');

      if (convertedHTML !== rawHTML) {
        editorContent.innerHTML = convertedHTML;
      }
    }
    updateActiveToolbarState();
  });

  editorContent.addEventListener('keyup', updateActiveToolbarState);
  editorContent.addEventListener('click', updateActiveToolbarState);

  function updateActiveToolbarState() {
    buttons.forEach(btn => {
      const cmd = btn.getAttribute('data-command');
      if (cmd && ['bold', 'italic', 'underline'].includes(cmd)) {
        if (document.queryCommandState(cmd)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }
}

/* ==========================================================================
   6. Search, Filter, Sorting (Newest to Oldest) & 10-Articles/Page Pagination
   ========================================================================== */
function initAdminSearchAndFilters() {
  const searchInput = document.getElementById('adminSearchInput');
  const catSelect = document.getElementById('adminCategorySelect');
  const fromDateInput = document.getElementById('adminFromDate');
  const toDateInput = document.getElementById('adminToDate');
  const resetBtn = document.getElementById('adminResetFilterBtn');

  const prevBtn = document.getElementById('adminPrevPageBtn');
  const nextBtn = document.getElementById('adminNextPageBtn');

  // Initialize Flatpickr for Date Range filtering
  if (typeof flatpickr !== 'undefined') {
    fromDateFlatpickr = flatpickr(fromDateInput, {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      onChange: () => applyAdminFilters()
    });

    toDateFlatpickr = flatpickr(toDateInput, {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      onChange: () => applyAdminFilters()
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyAdminFilters);
  if (catSelect) catSelect.addEventListener('change', applyAdminFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catSelect) catSelect.value = 'all';
      if (fromDateFlatpickr) fromDateFlatpickr.clear();
      if (toDateFlatpickr) toDateFlatpickr.clear();
      applyAdminFilters();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentAdminPage > 1) {
        currentAdminPage--;
        renderAdminPostsTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.max(1, Math.ceil(filteredAdminPosts.length / ADMIN_ITEMS_PER_PAGE));
      if (currentAdminPage < totalPages) {
        currentAdminPage++;
        renderAdminPostsTable();
      }
    });
  }
}

function applyAdminFilters() {
  const searchKeyword = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
  const selectedCategory = document.getElementById('adminCategorySelect')?.value || 'all';
  
  const fromDateVal = fromDateFlatpickr ? fromDateFlatpickr.selectedDates[0] : null;
  const toDateVal = toDateFlatpickr ? toDateFlatpickr.selectedDates[0] : null;

  filteredAdminPosts = allAdminPosts.filter(p => {
    // 1. Keyword search (Title & Summary)
    const titleMatch = (p.title || '').toLowerCase().includes(searchKeyword);
    const summaryMatch = (p.summary || '').toLowerCase().includes(searchKeyword);
    if (searchKeyword && !titleMatch && !summaryMatch) return false;

    // 2. Category Filter (Supports 'all')
    if (selectedCategory !== 'all' && (p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // 3. Date Range Filter
    const postDate = p.publishAt ? new Date(p.publishAt) : (p.createdAt ? new Date(p.createdAt) : null);
    if (postDate) {
      if (fromDateVal && postDate < fromDateVal) return false;
      if (toDateVal) {
        const endOfDay = new Date(toDateVal);
        endOfDay.setHours(23, 59, 59, 999);
        if (postDate > endOfDay) return false;
      }
    }

    return true;
  });

  // Default Sort: Newest to Oldest
  filteredAdminPosts.sort((a, b) => {
    const timeA = new Date(a.publishAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  currentAdminPage = 1;
  renderAdminPostsTable();
}

function renderAdminPostsTable() {
  const tbody = document.getElementById('postsTableBody');
  const paginationInfo = document.getElementById('adminPaginationInfo');
  const pageNumDisplay = document.getElementById('adminPageNumDisplay');
  const prevBtn = document.getElementById('adminPrevPageBtn');
  const nextBtn = document.getElementById('adminNextPageBtn');

  if (!tbody) return;

  if (filteredAdminPosts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No matching articles found.</td></tr>';
    if (paginationInfo) paginationInfo.textContent = 'Showing 0 of 0 articles';
    if (pageNumDisplay) pageNumDisplay.textContent = 'Page 1 of 1';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const totalArticles = filteredAdminPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ADMIN_ITEMS_PER_PAGE));
  if (currentAdminPage > totalPages) currentAdminPage = totalPages;

  const startIndex = (currentAdminPage - 1) * ADMIN_ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ADMIN_ITEMS_PER_PAGE, totalArticles);
  const pagePosts = filteredAdminPosts.slice(startIndex, endIndex);

  const now = new Date();

  tbody.innerHTML = pagePosts.map(p => {
    const catClass = (p.category || 'Science').toLowerCase().replace(/\s+/g, '-');
    const isScheduled = p.publishAt && new Date(p.publishAt) > now;
    const statusHTML = isScheduled
      ? `<span style="color: var(--accent-gold); font-size: 0.78rem; font-weight: 700;">🕒 Scheduled</span>`
      : `<span style="color: #30d158; font-size: 0.78rem; font-weight: 700;">🟢 Published</span>`;

    return `
    <tr>
      <td>
        <img src="${p.image || '../assets/images/avatar.png'}" class="post-thumb-preview" alt="Thumb" onerror="this.src='../avatar.png'">
      </td>
      <td>
        <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHTML(p.title)}</strong>
        <br>
        <small style="color: var(--text-tertiary);">${escapeHTML(p.summary ? p.summary.substring(0, 60) + '...' : '')}</small>
      </td>
      <td>
        <span class="badge-cat ${catClass}">${p.category}</span>
      </td>
      <td>
        ${formatFullDisplayDate(p)}
        <br>
        ${statusHTML}
      </td>
      <td>${p.readTime || '5 min read'}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-admin-secondary" onclick="editPost('${p.id || p._id}')" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Edit</button>
          <button class="btn-admin-secondary btn-danger" onclick="deletePost('${p.id || p._id}')" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Delete</button>
        </div>
      </td>
    </tr>
  `;
  }).join('');

  if (paginationInfo) paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalArticles} articles`;
  if (pageNumDisplay) pageNumDisplay.textContent = `Page ${currentAdminPage} of ${totalPages}`;
  if (prevBtn) prevBtn.disabled = (currentAdminPage === 1);
  if (nextBtn) nextBtn.disabled = (currentAdminPage === totalPages);
}

/* ==========================================================================
   7. Dashboard & Post CRUD Operations
   ========================================================================== */
function initDashboard() {
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelPostBtn = document.getElementById('cancelPostBtn');
  const postForm = document.getElementById('postForm');

  const postImageUrlInput = document.getElementById('postImageUrl');
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  const enableScheduleCheck = document.getElementById('enableScheduleCheck');
  const postPublishAtInput = document.getElementById('postPublishAt');

  initAdminSearchAndFilters();

  // Load posts table if already logged in
  if (localStorage.getItem('admin_token')) {
    loadPostsTable();
  }

  // Modal handlers
  if (openAddModalBtn) {
    openAddModalBtn.addEventListener('click', () => {
      openPostModal();
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closePostModal);
  if (cancelPostBtn) cancelPostBtn.addEventListener('click', closePostModal);

  // Handle Form Submit (Add / Edit)
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const savePostBtn = document.getElementById('savePostBtn');
      const origBtnHTML = savePostBtn ? savePostBtn.innerHTML : '<span>Save & Publish</span>';
      
      if (savePostBtn) {
        savePostBtn.disabled = true;
        savePostBtn.style.opacity = '0.6';
        savePostBtn.innerHTML = '<span>⏳ Saving Article...</span>';
      }

      try {
        const postId = document.getElementById('postId').value;
        const title = document.getElementById('postTitle').value.trim();
        const category = document.getElementById('postCategory').value;
        const readTime = document.getElementById('postReadTime').value.trim();
        const summary = document.getElementById('postSummary').value.trim();
        const image = document.getElementById('postImageUrl').value.trim();

        // Sync rich text editor content into postContent payload
        const editorContent = document.getElementById('postContentEditor');
        let content = editorContent ? editorContent.innerHTML.trim() : '';

        content = content
          .replace(/&lt;pic&gt;(.*?)&lt;\/pic&gt;/gi, '<img src="$1" class="article-body-img" alt="Article Image">')
          .replace(/<pic>(.*?)<\/pic>/gi, '<img src="$1" class="article-body-img" alt="Article Image">');

        if (!content || content === '<br>') {
          alert('Please write article content before publishing.');
          return;
        }

        const token = localStorage.getItem('admin_token');
        if (!token) {
          forceLogout();
          return;
        }

        const isEdit = !!postId;
        const isScheduledChecked = enableScheduleCheck && enableScheduleCheck.checked;
        const publishAtVal = (isScheduledChecked && postPublishAtInput && postPublishAtInput.value) ? postPublishAtInput.value : '';

        // Build payload: Preserve original publish date on Edit unless user explicitly set a new schedule
        const postData = { title, category, readTime, summary, image, content };
        if (isScheduledChecked && publishAtVal) {
          postData.publishAt = publishAtVal;
        }

        const endpoint = isEdit ? `/api/posts/detail?id=${postId}` : '/api/posts';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });

        if (res.status === 401) {
          forceLogout();
          return;
        }

        const data = await res.json();
        if (res.ok) {
          // Success: Keep the cropped image on Cloudinary (do not clean up on modal close)
          unsavedCropPublicId = null;
          closePostModal();
          showDashboardAlert(isEdit ? 'Article updated successfully!' : 'Article saved & scheduled/published successfully!', false);
          loadPostsTable();
        } else {
          alert(`Error: ${data.error || 'Failed to save post'}`);
        }
      } catch (err) {
        console.error('Save post error:', err);
        alert('Network error while saving post');
      } finally {
        if (savePostBtn) {
          savePostBtn.disabled = false;
          savePostBtn.style.opacity = '1';
          savePostBtn.innerHTML = origBtnHTML;
        }
      }
    });
  }
}

function formatFullDisplayDate(post) {
  if (!post) return '07 Aug 2026';
  
  if (post.date && /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(post.date.trim())) {
    return post.date.trim();
  }

  const dateObj = post.publishAt ? new Date(post.publishAt) : (post.createdAt ? new Date(post.createdAt) : null);
  if (dateObj && !isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }

  if (post.date && /^[A-Za-z]{3}\s+\d{4}$/.test(post.date.trim())) {
    return `01 ${post.date.trim()}`;
  }

  return post.date || '07 Aug 2026';
}

async function loadPostsTable() {
  const tbody = document.getElementById('postsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">⏳ Loading articles from MongoDB...</td></tr>';

  try {
    const res = await fetch('/api/posts?admin=true');
    const posts = await res.json();

    if (!Array.isArray(posts)) {
      const errMsg = posts && posts.error ? posts.error : 'Failed to load posts from server.';
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ff453a; padding: 2rem; font-weight: 600;">⚠️ Failed to load posts: ${escapeHTML(errMsg)}</td></tr>`;
      return;
    }

    allAdminPosts = posts;

    // Default Sort: Newest to Oldest
    allAdminPosts.sort((a, b) => {
      const timeA = new Date(a.publishAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.publishAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    applyAdminFilters();
  } catch (err) {
    console.error('Load posts error:', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ff453a;">Network error loading posts.</td></tr>';
  }
}

function openPostModal(post = null) {
  const modal = document.getElementById('postModal');
  const modalTitle = document.getElementById('modalTitleText');
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  const dropzoneText = document.getElementById('dropzoneText');
  const editorContent = document.getElementById('postContentEditor');
  const enableScheduleCheck = document.getElementById('enableScheduleCheck');
  const scheduleFieldWrap = document.getElementById('scheduleFieldWrap');
  const publishAtInput = document.getElementById('postPublishAt');
  const formattedDateBadge = document.getElementById('formattedDateBadge');
  const cropUrlBtn = document.getElementById('cropUrlBtn');

  document.getElementById('postForm').reset();
  if (dropzoneText) dropzoneText.textContent = '📸 Click or drag image file here to crop & upload';
  if (cropUrlBtn) cropUrlBtn.style.display = 'none';

  if (post) {
    modalTitle.textContent = 'Edit Article';
    document.getElementById('postId').value = post.id || post._id;
    document.getElementById('postTitle').value = post.title || '';
    document.getElementById('postCategory').value = post.category || 'Science';
    document.getElementById('postReadTime').value = post.readTime || '5 min read';
    document.getElementById('postSummary').value = post.summary || '';
    document.getElementById('postImageUrl').value = post.image || '';

    if (post.image && cropUrlBtn) {
      cropUrlBtn.style.display = 'block';
    }

    const isFutureScheduled = post.publishAt && (new Date(post.publishAt) > new Date());
    if (enableScheduleCheck && scheduleFieldWrap && publishAtInput) {
      if (isFutureScheduled) {
        enableScheduleCheck.checked = true;
        scheduleFieldWrap.style.opacity = '1';
        scheduleFieldWrap.style.pointerEvents = 'auto';
        publishAtInput.disabled = false;
        if (publishAtFlatpickr) {
          if (publishAtFlatpickr.altInput) publishAtFlatpickr.altInput.disabled = false;
          if (publishAtFlatpickr.element) publishAtFlatpickr.element.disabled = false;
        }

        const d = new Date(post.publishAt);
        if (publishAtFlatpickr) {
          publishAtFlatpickr.setDate(d);
        } else {
          publishAtInput.value = d.toISOString().slice(0, 16);
        }

        if (formattedDateBadge) {
          formattedDateBadge.textContent = `📅 กำหนดเผยแพร่: ${formatDDMMYYYYHHmm(d)} (รูปแบบ DD/MM/YYYY HH:mm)`;
          formattedDateBadge.style.display = 'inline-block';
        }
      } else {
        enableScheduleCheck.checked = false;
        scheduleFieldWrap.style.opacity = '0.4';
        scheduleFieldWrap.style.pointerEvents = 'none';
        publishAtInput.disabled = true;
        if (publishAtFlatpickr) {
          if (publishAtFlatpickr.altInput) publishAtFlatpickr.altInput.disabled = true;
          if (publishAtFlatpickr.element) publishAtFlatpickr.element.disabled = true;
          publishAtFlatpickr.clear();
        }
        publishAtInput.value = '';
        if (formattedDateBadge) formattedDateBadge.style.display = 'none';
      }
    }

    if (editorContent) {
      editorContent.innerHTML = post.content || '';
    }

    if (post.image) {
      imagePreviewBox.src = post.image;
      imagePreviewBox.style.display = 'block';
    } else {
      imagePreviewBox.style.display = 'none';
    }
  } else {
    modalTitle.textContent = 'Add New Article';
    document.getElementById('postId').value = '';
    if (enableScheduleCheck && scheduleFieldWrap && publishAtInput) {
      enableScheduleCheck.checked = false;
      scheduleFieldWrap.style.opacity = '0.4';
      scheduleFieldWrap.style.pointerEvents = 'none';
      publishAtInput.disabled = true;
      if (publishAtFlatpickr) publishAtFlatpickr.clear();
      publishAtInput.value = '';
      if (formattedDateBadge) formattedDateBadge.style.display = 'none';
    }
    if (editorContent) editorContent.innerHTML = '';
    imagePreviewBox.style.display = 'none';
  }

  modal.classList.add('active');
}

async function cleanupUnsavedCrop() {
  if (unsavedCropPublicId) {
    const pubId = unsavedCropPublicId;
    unsavedCropPublicId = null;
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ public_id: pubId })
        }).catch(err => console.error('Cloudinary cleanup error:', err));
        console.log('Cleaned up unsaved Cloudinary image:', pubId);
      } catch (e) {}
    }
  }
}

function closePostModal() {
  const modal = document.getElementById('postModal');
  modal.classList.remove('active');
  cleanupUnsavedCrop();
}

window.editPost = async function(id) {
  const token = localStorage.getItem('admin_token');
  if (!token) return forceLogout();

  try {
    const res = await fetch('/api/posts?admin=true');
    const posts = await res.json();
    const target = posts.find(p => (p.id === id || p._id === id));

    if (target) {
      openPostModal(target);
    } else {
      alert('Post not found.');
    }
  } catch (err) {
    console.error('Fetch post detail error:', err);
  }
};

window.deletePost = async function(id) {
  if (!confirm('Are you sure you want to delete this article?')) return;

  const token = localStorage.getItem('admin_token');
  if (!token) return forceLogout();

  try {
    const res = await fetch(`/api/posts/detail?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      forceLogout();
      return;
    }

    if (res.ok) {
      showDashboardAlert('Article and associated Cloudinary image deleted successfully.', false);
      loadPostsTable();
    } else {
      const data = await res.json();
      alert(`Delete Error: ${data.error || 'Failed'}`);
    }
  } catch (err) {
    console.error('Delete post error:', err);
    alert('Network error deleting post');
  }
};

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ==========================================================================
   Admin Panel Initialization Bootstrapper
   Executes strictly AFTER all global window methods and handlers are defined.
   ========================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
  initAdminPanel();
}
