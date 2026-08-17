/**
 * Admin Panel JavaScript Architecture v11.0 (Master Restored Edition)
 * Tab-Isolated Session Enforcement, MongoDB Atlas Article Integration & 10,480 TOEIC Qs Analytics
 * Author: Noppasin Pronsawad
 */

let isExecutingLogin = false;

// Layer 1: Cross-Tab Storage Event Listener (Fires immediately when another tab logs in)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'admin_session_id' && e.newValue) {
      const tabSession = sessionStorage.getItem('my_active_session');
      if (tabSession && e.newValue !== tabSession) {
        alert('⚠️ ตรวจพบการเข้าสู่ระบบซ้อนจากอุปกรณ์/แท็บอื่น! เซสชันปัจจุบันของคุณถูกยกเลิกแล้ว');
        window.executeLogout();
      }
    }
  });
}

window.executeAdminLogin = async function executeLogin(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (isExecutingLogin) return;
  isExecutingLogin = true;

  const passwordInput = document.getElementById('adminPassword');
  const btnEl = document.getElementById('loginBtn');
  const alertBox = document.getElementById('loginAlert');

  if (!passwordInput || !passwordInput.value.trim()) {
    if (alertBox) {
      alertBox.className = 'alert-banner alert-error';
      alertBox.textContent = '❌ โปรดกรอกรหัสผ่าน Admin';
      alertBox.style.display = 'block';
    }
    isExecutingLogin = false;
    return;
  }

  const password = passwordInput.value.trim();

  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<span class="spinner-icon"></span> ⏳ กำลังตรวจสอบรหัสผ่าน...';
  }
  if (alertBox) {
    alertBox.className = 'alert-banner alert-loading';
    alertBox.innerHTML = '<span class="spinner-icon"></span> กำลังตรวจสอบรหัสผ่านและยืนยันเซสชัน...';
    alertBox.style.display = 'block';
  }

  function grantAdminAccess(tokenStr, sessionIdStr) {
    const activeSessionId = sessionIdStr || ('session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
    localStorage.setItem('admin_token', tokenStr || 'fallback_admin_token');
    localStorage.setItem('admin_jwt_token', tokenStr || 'fallback_admin_token');

    // Tab-Isolated Storage: Store tab session in sessionStorage (unique per tab)
    sessionStorage.setItem('my_active_session', activeSessionId);
    // Shared Storage: Update shared admin_session_id in localStorage (triggers storage event in other tabs)
    localStorage.setItem('admin_session_id', activeSessionId);

    if (alertBox) {
      alertBox.className = 'alert-banner alert-success';
      alertBox.textContent = '✅ ยืนยันตัวตนสำเร็จ กำลังเข้าสู่ระบบ...';
      alertBox.style.display = 'block';
    }

    setTimeout(() => {
      const loginView = document.getElementById('loginView') || document.getElementById('loginOverlay');
      if (loginView) loginView.style.display = 'none';

      const dashboardView = document.getElementById('dashboardView') || document.getElementById('adminMainContainer');
      if (dashboardView) dashboardView.style.display = 'block';

      fetchAdminMetrics();
      fetchBlogPosts();
      startSessionMonitoring();

      isExecutingLogin = false;
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<span>🔓 Unlock CMS</span>';
      }
    }, 300);
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        grantAdminAccess(data.token, data.sessionId);
        return;
      }
    }
    
    // API Error handling
    let errorMsg = 'Login failed';
    try {
      const errorData = await res.json();
      errorMsg = errorData.error || errorData.message || `API Error: ${res.status}`;
    } catch (_) {
      errorMsg = `API Error: ${res.status}`;
    }
    throw new Error(errorMsg);

  } catch (err) {
    console.error('Backend login API error:', err.message);
    if (alertBox) {
      alertBox.className = 'alert-banner alert-error';
      alertBox.textContent = '❌ ' + (err.message || 'การเข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง');
      alertBox.style.display = 'block';
    }
    isExecutingLogin = false;
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = '<span>🔓 Unlock CMS</span>';
    }
  }
};

window.executeLogout = function() {
  console.log('[Auth] Admin Logout Executed');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_jwt_token');
  localStorage.removeItem('admin_session_id');
  sessionStorage.removeItem('my_active_session');

  if (window.sessionMonitorInterval) clearInterval(window.sessionMonitorInterval);

  const loginView = document.getElementById('loginView') || document.getElementById('loginOverlay');
  const dashboardView = document.getElementById('dashboardView') || document.getElementById('adminMainContainer');
  const alertBox = document.getElementById('loginAlert');

  if (dashboardView) dashboardView.style.display = 'none';
  if (loginView) loginView.style.display = 'block';

  if (alertBox) {
    alertBox.className = 'alert-banner alert-success';
    alertBox.innerHTML = '🔒 ออกจากระบบเรียบร้อยแล้ว เซสชันของคุณถูกลบออกจากความจำแล้ว';
    alertBox.style.display = 'block';
  }
};

window.switchAdminTab = function(tab) {
  const blogSec = document.getElementById('blogManagementSection');
  const sysSec = document.getElementById('systemDashboardSection');
  const toeicSec = document.getElementById('toeicStatsSection');

  const blogBtn = document.getElementById('blogMgmtTabBtn');
  const sysBtn = document.getElementById('sysDashTabBtn');
  const toeicBtn = document.getElementById('toeicStatsTabBtn');

  if (blogSec) blogSec.style.display = tab === 'blog' ? 'block' : 'none';
  if (sysSec) sysSec.style.display = tab === 'system' ? 'block' : 'none';
  if (toeicSec) toeicSec.style.display = tab === 'toeic' ? 'block' : 'none';

  if (blogBtn) blogBtn.className = tab === 'blog' ? 'btn-admin-secondary active' : 'btn-admin-secondary';
  if (sysBtn) sysBtn.className = tab === 'system' ? 'btn-admin-secondary active' : 'btn-admin-secondary';
  if (toeicBtn) toeicBtn.className = tab === 'toeic' ? 'btn-admin-secondary active' : 'btn-admin-secondary';

  if (tab === 'toeic' || tab === 'system') {
    fetchAdminMetrics();
  }
};

async function fetchAdminMetrics() {
  const token = localStorage.getItem('admin_token');
  const logsTableBody = document.getElementById('dailyNewsLogsTableBody');

  const defaultLogs = [];

  window.cachedDailyNewsLogs = defaultLogs;

  function renderLogs(logs) {
    if (!logsTableBody) return;
    logsTableBody.innerHTML = logs.map(log => `
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

  renderLogs(defaultLogs);

  const summaryQs = document.getElementById('summary_total_qs');
  if (summaryQs) {
    summaryQs.textContent = window.totalToeicCount !== undefined ? window.totalToeicCount.toLocaleString() + ' ข้อ' : 'กำลังโหลด...';
  }

  try {
    const res = await fetch('/api/admin/metrics?_t=' + Date.now(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.metrics) {
        const m = data.metrics;
        if (m.mongodb && m.mongodb.totalToeicQuestions !== undefined) {
          window.totalToeicCount = m.mongodb.totalToeicQuestions;
          if (summaryQs) summaryQs.textContent = window.totalToeicCount.toLocaleString() + ' ข้อ';
        }
        if (m.dailyNewsLogs && Array.isArray(m.dailyNewsLogs) && m.dailyNewsLogs.length > 0) {
          window.cachedDailyNewsLogs = m.dailyNewsLogs;
          renderLogs(m.dailyNewsLogs);
        }
      }
    }
  } catch (err) {
    console.warn('Fetch metrics error:', err);
  }
}

window.closeAdminModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
};

window.showSessionExpiredModal = function() {
  if (window.sessionMonitorInterval) clearInterval(window.sessionMonitorInterval);
  const timerBadge = document.getElementById('sessionTimer');
  if (timerBadge) timerBadge.textContent = 'Session Expired';
  const modal = document.getElementById('sessionKickModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
};

window.showNewsLogDetails = function(logId) {
  const logs = window.cachedDailyNewsLogs || [
    {
      id: 'log-006',
      date: '2026-08-08 07:30',
      source: 'BBC World News / Business',
      topic: 'Global Tech & Enterprise Supply Chain Modernization 2026',
      url: 'https://www.bbc.com/news/business',
      summary: 'สรุปข่าวเศรษฐกิจและห่วงโซ่อุปทานระดับโลก มีการใช้เทคโนโลยีปัญญาประดิษฐ์ (AI) เข้ามาเพิ่มประสิทธิภาพองค์กร',
      questionsGenerated: 300,
      partBreakdown: { part5: 90, part6: 48, part7: 162 }
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
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
};

window.openQuestionBankModal = async function() {
  const modal = document.getElementById('questionBankModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }

  const container = document.getElementById('qbListContainer');
  if (container) {
    container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 3rem;">⏳ กำลังโหลดคลังข้อสอบทั้งหมดจาก DB...</div>';
  }

  try {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/questions?_t=' + Date.now(), { 
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        window.cachedDbQuestions = data.questions;
        window.filterQuestionBank();
        return;
      }
    }
  } catch (err) {
    console.warn('Fetch DB questions error:', err);
  }

  if (typeof getPristineFallbackQuestions === 'function') {
    window.cachedDbQuestions = getPristineFallbackQuestions('full');
  } else {
    window.cachedDbQuestions = [];
  }
  window.filterQuestionBank();
};

window.refreshQuestionBank = async function() {
  const container = document.getElementById('qbListContainer');
  if (container) {
    container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 3rem;">⏳ กำลังโหลดและสุ่มข้อสอบชุดใหม่...</div>';
  }

  try {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/questions?shuffle=true&_t=' + Date.now(), { 
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        window.cachedDbQuestions = data.questions;
        window.filterQuestionBank();
        return;
      }
    }
  } catch (err) {
    console.warn('Fetch DB questions error:', err);
  }
  
  // Fallback if failed
  window.filterQuestionBank();
};

window.filterQuestionBank = function() {
  const partFilter = document.getElementById('qbPartSelect')?.value || 'all';
  const search = (document.getElementById('qbSearchInput')?.value || '').toLowerCase().trim();
  const container = document.getElementById('qbListContainer');
  const countEl = document.getElementById('qbTotalCountBadge');

  if (!container) return;

  let questions = window.cachedDbQuestions || [];

  if (partFilter !== 'all') {
    questions = questions.filter(q => String(q.part) === partFilter);
  }
  if (search) {
    questions = questions.filter(q => 
      (q.question_text || '').toLowerCase().includes(search) ||
      (q.passage_title || '').toLowerCase().includes(search) ||
      (q.passage_content || '').toLowerCase().includes(search)
    );
  }

  if (countEl) countEl.textContent = `แสดงล่าสุด 100 ข้อ | ตรงเงื่อนไข ${questions.length} ข้อ`;

  if (questions.length === 0) {
    container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 2rem;">ไม่พบข้อสอบที่ตรงกับเงื่อนไข</div>';
    return;
  }

  const selected = questions; // Show all filtered (up to 100)

  container.innerHTML = selected.map((q, idx) => `
    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.2rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
        <span class="blog-cat-pill" style="background: rgba(0,210,255,0.15); color: #00d2ff;">Part ${q.part}</span>
        <span style="font-size: 0.8rem; color: var(--text-secondary);">ID: ${q.question_id || 'q-'+idx} | CEFR: ${q.cefr_level || 'B2'}</span>
      </div>

      ${q.passage_title || q.passage_content ? `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(0,210,255,0.2); padding: 0.8rem; border-radius: 6px; margin-bottom: 0.8rem; font-size: 0.88rem;">
          <div style="color: #00d2ff; font-weight: 600; margin-bottom: 0.3rem;">📖 ${q.passage_title || 'Passage Content'}</div>
          <div>${q.passage_content}</div>
        </div>
      ` : ''}

      <div style="font-weight: 600; margin-bottom: 0.8rem; line-height: 1.5; color: #fff; font-size: 0.95rem;">${idx + 1}. ${escapeHTML(q.question_text)}</div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.88rem; margin-bottom: 0.8rem;">
        ${['A','B','C','D'].map(k => `
          <div style="padding: 0.4rem 0.6rem; border-radius: 4px; ${q.correct_answer === k ? 'background: rgba(48,209,88,0.2); border: 1px solid #30d158; color: #30d158; font-weight: 600;' : 'background: rgba(255,255,255,0.03); color: var(--text-secondary, #aaa);'}">
            ${k}. ${escapeHTML(q.choices?.[k] || '')} ${q.correct_answer === k ? '✓ (เฉลย)' : ''}
          </div>
        `).join('')}
      </div>

      ${q.detailed_explanation ? `
        <div style="font-size: 0.83rem; background: rgba(0,210,255,0.05); border-left: 3px solid #00d2ff; padding: 0.5rem 0.8rem; border-radius: 2px;">
          <div style="color: #00d2ff; font-weight: 600; margin-bottom: 0.2rem;">💡 เฉลยรายละเอียดภาษาไทย:</div>
          <div style="color: var(--text-secondary, #aaa);">${escapeHTML(q.detailed_explanation.correct_reason || '')}</div>
        </div>
      ` : ''}
    </div>
  `).join('');
};

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.openCreatePostModal = function() {
  const modal = document.getElementById('postModal');
  const titleText = document.getElementById('modalTitleText');
  const postIdInput = document.getElementById('postId');
  const form = document.getElementById('postForm');

  if (form) form.reset();
  if (postIdInput) postIdInput.value = '';
  if (titleText) titleText.textContent = 'Create New Article';

  const scheduleCard = document.getElementById('schedulePickerCard');
  if (scheduleCard) scheduleCard.style.display = 'block';

  // Explicitly clear rich text editor and image preview
  const editor = document.getElementById('postContentEditor');
  if (editor) editor.innerHTML = '';
  const imagePreview = document.getElementById('imagePreviewBox');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }

  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
};

window.closePostModal = function() {
  const modal = document.getElementById('postModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
};

window.savePostArticle = async function(e) {
  if (e) e.preventDefault();

  // Sync content from rich editor to hidden input before validation
  const editor = document.getElementById('postContentEditor');
  const hiddenInput = document.getElementById('postContent');
  if (editor && hiddenInput) {
    hiddenInput.value = editor.innerHTML;
  }

  const title = (document.getElementById('postTitle')?.value || '').trim();
  const category = (document.getElementById('postCategory')?.value || 'Daily Life').trim();
  const summary = (document.getElementById('postSummary')?.value || '').trim();
  const content = (document.getElementById('postContent')?.value || '').trim();
  const image = (document.getElementById('postImageUrl')?.value || '').trim();
  const readTime = (document.getElementById('postReadTime')?.value || '3 min read').trim();
  const postId = (document.getElementById('postId')?.value || '').trim();

  if (!title || !summary || !content) {
    alert('⚠️ โปรดกรอกข้อมูล หัวข้อบทความ, สรุปย่อ, และเนื้อหาบทความให้ครบถ้วน');
    return;
  }

  const newArticle = {
    id: postId || ('custom_post_' + Date.now()),
    title,
    category,
    summary,
    content: `<div class="article-rich-body">${content}</div>`,
    image: image || '',
    readTime: readTime || '3 min read'
  };

  // Only assign current date or schedule if it's a new post
  if (!postId) {
    let finalPublishDate = new Date();
    const enableScheduleCheck = document.getElementById('enableScheduleCheck');
    if (enableScheduleCheck && enableScheduleCheck.checked) {
      const scheduleInput = document.getElementById('postPublishAt')?.value;
      if (scheduleInput) {
        const parsedDate = new Date(scheduleInput);
        if (!isNaN(parsedDate.getTime())) {
          finalPublishDate = parsedDate;
        }
      }
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    newArticle.date = `${String(finalPublishDate.getDate()).padStart(2, '0')} ${months[finalPublishDate.getMonth()]} ${finalPublishDate.getFullYear()}`;
    newArticle.publishAt = finalPublishDate.toISOString();
  }

  const saveBtn = document.getElementById('savePostBtn');
  const originalBtnContent = saveBtn ? saveBtn.innerHTML : 'Save & Publish';
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳ Saving...</span>';
  }

  try {
    const token = localStorage.getItem('admin_token');
    const endpoint = postId && !postId.startsWith('custom_post_') ? `/api/posts/detail?id=${postId}` : '/api/posts';
    const method = postId && !postId.startsWith('custom_post_') ? 'PUT' : 'POST';
    
    const res = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newArticle)
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    alert('🎉 บันทึกบทความใหม่เรียบร้อยแล้ว!');
    window.closePostModal();
    fetchBlogPosts();
  } catch (err) {
    alert('❌ บันทึกบทความล้มเหลว: ' + err.message);
    console.error('[Post Save] API error:', err);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalBtnContent;
    }
  }
};

window.editBlogPost = function(postId) {
  let posts = window.cachedAllBlogPosts || [];
  const post = posts.find(p => String(p.id) === String(postId) || String(p._id) === String(postId));
  if (!post) return;

  window.openCreatePostModal();
  document.getElementById('modalTitleText').textContent = 'Edit Article';
  document.getElementById('postId').value = post.id || post._id;
  document.getElementById('postTitle').value = post.title || '';
  document.getElementById('postCategory').value = post.category || 'Daily Life';
  document.getElementById('postSummary').value = post.summary || '';
  document.getElementById('postContent').value = post.content || '';
  
  const scheduleCard = document.getElementById('schedulePickerCard');
  if (scheduleCard) scheduleCard.style.display = 'none';
  const editor = document.getElementById('postContentEditor');
  if (editor) editor.innerHTML = post.content || '';
  
  const imageUrlInput = document.getElementById('postImageUrl');
  if (imageUrlInput) imageUrlInput.value = post.image || '';
  
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  if (imagePreviewBox && post.image) {
    imagePreviewBox.src = post.image;
    imagePreviewBox.style.display = 'block';
  } else if (imagePreviewBox) {
    imagePreviewBox.src = '';
    imagePreviewBox.style.display = 'none';
  }
};

window.deleteBlogPost = async function(postId) {
  if (!confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) return;

  try {
    const token = localStorage.getItem('admin_token');
    if (postId && !postId.startsWith('custom_post_')) {
      const res = await fetch(`/api/posts/detail?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Delete API failed: ${res.status}`);
      }
    }
    
    alert('🗑️ ลบบทความเรียบร้อยแล้ว');
    fetchBlogPosts();
  } catch (err) {
    alert('❌ ลบบทความล้มเหลว: ' + err.message);
    console.error('API delete failed:', err);
  }
};

// Layer 2: 1.5-Second Interval Tab-Isolated Session Enforcement Loop
function startSessionMonitoring() {
  if (window.sessionMonitorInterval) clearInterval(window.sessionMonitorInterval);

  let expiryTime = Date.now() + 45 * 60 * 1000; // 45 minutes fallback

  const updateTimerUI = () => {
    const timerBadge = document.getElementById('sessionTimer');
    if (!timerBadge) return;
    const remaining = Math.max(0, expiryTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    timerBadge.textContent = `Session Expiry: ${mins}:${secs.toString().padStart(2, '0')}`;
    if (remaining === 0) {
      window.showSessionExpiredModal();
      window.executeLogout();
    }
  };

  window.sessionMonitorInterval = setInterval(async () => {
    updateTimerUI();

    const tabSession = sessionStorage.getItem('my_active_session');
    const globalSession = localStorage.getItem('admin_session_id');
    const token = localStorage.getItem('admin_token');

    if (tabSession && globalSession && tabSession !== globalSession) {
      window.showSessionExpiredModal();
      window.executeLogout();
      return;
    }

    // Ping backend to ensure session is valid across multiple devices
    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/auth/check', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) {
          window.showSessionExpiredModal();
          window.executeLogout();
        } else if (res.ok) {
          const data = await res.json();
          if (data.exp) expiryTime = data.exp * 1000;
        }
      } catch (err) {}
    }
  }, 5000); // Check every 5 seconds
}

// Fetch & Render Blog Posts from MongoDB Atlas & Fallback (Item 3)
async function fetchBlogPosts() {
  let posts = [];
  try {
    const res = await fetch('/api/posts?admin=true&_t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        posts = data;
      }
    }
  } catch (err) {
    console.warn('Fetch posts API unreachable, using fallback dataset:', err.message);
  }

  if (posts.length === 0 && typeof BLOG_POSTS !== 'undefined') {
    posts = [...BLOG_POSTS];
  } else if (posts.length === 0 && typeof window.BLOG_POSTS !== 'undefined') {
    posts = [...window.BLOG_POSTS];
  }

  // Enforce client-side sorting (Newest to Oldest)
  if (posts.length > 0) {
    posts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : (a.publishAt ? new Date(a.publishAt) : new Date(a.date || 0));
      const dateB = b.createdAt ? new Date(b.createdAt) : (b.publishAt ? new Date(b.publishAt) : new Date(b.date || 0));
      return dateB - dateA;
    });
  }

  window.cachedAllBlogPosts = posts;
  
  // Call the filtering function immediately
  applyAdminFilters();
  setupAdminFilters();
}

function renderAdminPosts(postsToRender) {
  const tableBody = document.getElementById('postsTableBody');
  const paginationInfo = document.getElementById('adminPaginationInfo');
  
  if (!tableBody) return;

  if (postsToRender.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">ไม่พบบทความ หรือยังไม่มีข้อมูลในระบบ</td></tr>';
    if (paginationInfo) paginationInfo.textContent = 'Showing 0 articles';
    return;
  }

  tableBody.innerHTML = postsToRender.map(p => {
    const postId = p.id || p._id;
    const catClass = (p.category || 'Daily Life').toLowerCase().replace(/\s+/g, '-');
    const imgSrc = p.image ? (p.image.startsWith('http') || p.image.startsWith('data:') || p.image.startsWith('/') || p.image.startsWith('../') ? p.image : `../${p.image}`) : '';

    let displayDate = p.date || 'No Date';
    const dateObj = p.createdAt ? new Date(p.createdAt) : (p.publishAt ? new Date(p.publishAt) : null);
    if (dateObj && !isNaN(dateObj.getTime())) {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      displayDate = `${day} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    } else if (p.date && /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(p.date.trim())) {
      displayDate = p.date.trim();
    }

    return `
      <tr style="border-bottom: 1px solid var(--border-subtle);">
        <td style="padding: 0.8rem;">${imgSrc ? `<img src="${imgSrc}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);" alt="">` : '<span style="font-size:0.8rem; color: var(--text-tertiary);">No Image</span>'}</td>
        <td style="padding: 0.8rem; font-weight: 600; color: var(--text-primary); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</td>
        <td style="padding: 0.8rem;"><span class="badge-cat ${catClass}">${p.category || 'Daily Life'}</span></td>
        <td style="padding: 0.8rem; color: var(--text-secondary); font-size: 0.85rem;">${displayDate}</td>
        <td style="padding: 0.8rem; color: var(--text-secondary); font-size: 0.85rem;">${p.readTime || '4 min read'}</td>
        <td style="padding: 0.8rem;">
          <button type="button" class="btn-admin-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; margin-right: 0.4rem;" onclick="window.editBlogPost('${postId}')">✏️ Edit</button>
          <button type="button" class="btn-danger" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; border-radius: 4px;" onclick="window.deleteBlogPost('${postId}')">🗑️ Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  if (paginationInfo) {
    paginationInfo.textContent = `Showing 1-${postsToRender.length} of ${postsToRender.length} articles`;
  }
}
window.fetchBlogPosts = fetchBlogPosts;

function applyAdminFilters() {
  const search = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
  const category = document.getElementById('adminCategorySelect')?.value || 'all';
  const fromDate = document.getElementById('adminFromDate')?.value || '';
  const toDate = document.getElementById('adminToDate')?.value || '';

  let filtered = window.cachedAllBlogPosts || [];

  if (search) {
    filtered = filtered.filter(p => 
      (p.title || '').toLowerCase().includes(search) || 
      (p.summary || '').toLowerCase().includes(search) ||
      (p.category || '').toLowerCase().includes(search)
    );
  }

  if (category !== 'all') {
    filtered = filtered.filter(p => (p.category || 'Daily Life') === category);
  }

  if (fromDate || toDate) {
    const fromTime = fromDate ? new Date(fromDate).getTime() : 0;
    const toTime = toDate ? new Date(toDate).getTime() : Infinity;
    filtered = filtered.filter(p => {
      const pTime = p.createdAt ? new Date(p.createdAt).getTime() : (p.publishAt ? new Date(p.publishAt).getTime() : new Date(p.date || 0).getTime());
      if (isNaN(pTime)) return true;
      return pTime >= fromTime && pTime <= toTime;
    });
  }

  renderAdminPosts(filtered);
}
window.applyAdminFilters = applyAdminFilters;

function setupAdminFilters() {
  const searchInput = document.getElementById('adminSearchInput');
  const catSelect = document.getElementById('adminCategorySelect');
  const fromDate = document.getElementById('adminFromDate');
  const toDate = document.getElementById('adminToDate');
  const resetBtn = document.getElementById('adminResetFilterBtn');

  // Restrict to today max
  const today = new Date().toISOString().split('T')[0];
  if (fromDate) fromDate.max = today;
  if (toDate) toDate.max = today;

  const onFilterChange = () => {
    if (window.applyAdminFilters) window.applyAdminFilters();
  };

  if (searchInput) searchInput.addEventListener('input', onFilterChange);
  if (catSelect) catSelect.addEventListener('change', onFilterChange);
  if (fromDate) fromDate.addEventListener('change', onFilterChange);
  if (toDate) toDate.addEventListener('change', onFilterChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catSelect) catSelect.value = 'all';
      if (fromDate) fromDate.value = '';
      if (toDate) toDate.value = '';
      onFilterChange();
    });
  }
}
window.setupAdminFilters = setupAdminFilters;

function initRichEditor() {
  document.execCommand('defaultParagraphSeparator', false, 'p');

  // Intercept Paste to Strip Formatting (Plain Text Only)
  const editor = document.getElementById('postContentEditor');
  if (editor) {
    editor.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });
  }

  // Setup Rich Text Formatting Buttons
  document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.getAttribute('data-command');
      document.execCommand(command, false, null);
      updateToolbarState();
    });
  });

  function updateToolbarState() {
    document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
      const command = btn.getAttribute('data-command');
      if (document.queryCommandState(command)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock) {
      const headingSelect = document.getElementById('editorHeadingSelect');
      if (headingSelect) {
        const matchedOption = Array.from(headingSelect.options).find(opt => opt.value.toLowerCase() === formatBlock.toLowerCase());
        if (matchedOption) {
          headingSelect.value = matchedOption.value;
        } else {
          headingSelect.value = 'p';
        }
      }
    }

    const fontSize = document.queryCommandValue('fontSize');
    if (fontSize) {
      const fontSelect = document.getElementById('editorFontSizeSelect');
      if (fontSelect) {
        fontSelect.value = fontSize;
      }
    }
  }

  const headingSelect = document.getElementById('editorHeadingSelect');
  if (headingSelect) {
    headingSelect.addEventListener('change', (e) => {
      document.execCommand('formatBlock', false, e.target.value);
    });
  }
  
  const fontSelect = document.getElementById('editorFontSizeSelect');
  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      document.execCommand('fontSize', false, e.target.value);
    });
  }

  // Setup Image Insert Button (Browse File or Link)
  const insertImageBtn = document.getElementById('insertImageUrlBtn');
  if (insertImageBtn) {
    let editorFileInput = document.getElementById('editorFileInput');
    if (!editorFileInput) {
      editorFileInput = document.createElement('input');
      editorFileInput.type = 'file';
      editorFileInput.id = 'editorFileInput';
      editorFileInput.accept = 'image/*';
      editorFileInput.style.display = 'none';
      document.body.appendChild(editorFileInput);
    }

    let savedRange = null;

    insertImageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const selection = window.getSelection();
      savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      const attachModal = document.getElementById('editorAttachModal');
      if (attachModal) {
        document.getElementById('editorAttachUrlInput').value = '';
        attachModal.style.display = 'flex';
        attachModal.classList.add('active');
      }
    });

    document.getElementById('editorAttachConfirmBtn')?.addEventListener('click', () => {
      const url = document.getElementById('editorAttachUrlInput').value.trim();
      if (url) {
        const editor = document.getElementById('postContentEditor');
        editor.focus();
        if (savedRange) {
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(savedRange);
        }
        document.execCommand('insertImage', false, url);
        window.closeAdminModal('editorAttachModal');
      }
    });

    document.getElementById('editorAttachUploadBtn')?.addEventListener('click', () => {
      window.closeAdminModal('editorAttachModal');
      editorFileInput.onchange = (evt) => {
        const file = evt.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e2) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const scale = Math.min(MAX_WIDTH / img.width, 1);
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              const base64Str = canvas.toDataURL('image/jpeg', 0.7);
              
              const editor = document.getElementById('postContentEditor');
              editor.focus();
              if (savedRange) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(savedRange);
              }
              document.execCommand('insertImage', false, base64Str);
            };
            img.src = e2.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
      editorFileInput.click();
    });
  }

  // Allow resizing images inside the editor and add paste interception / selection updates
  const editorBox = document.getElementById('postContentEditor');
  if (editorBox) {
    editorBox.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        window.currentResizeTargetElement = e.target;
        const resizeModal = document.getElementById('editorResizeModal');
        if (resizeModal) {
          // get current width % if set
          let currentWidth = e.target.style.width || '100%';
          document.getElementById('editorResizeRange').value = parseInt(currentWidth) || 100;
          document.getElementById('editorResizeValue').textContent = currentWidth;
          resizeModal.style.display = 'flex';
          resizeModal.classList.add('active');
        }
      }
    });

    editorBox.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.originalEvent || e).clipboardData.getData('text/plain');
      const paragraphs = text.split(/\r?\n\r?\n/).map(p => {
        const escapedText = String(p).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        return `<p>${escapedText}</p>`;
      }).join('');
      document.execCommand('insertHTML', false, paragraphs);
    });

    editorBox.addEventListener('keyup', updateToolbarState);
    editorBox.addEventListener('mouseup', updateToolbarState);
  }

  const resizeRange = document.getElementById('editorResizeRange');
  if (resizeRange) {
    resizeRange.addEventListener('input', (e) => {
      document.getElementById('editorResizeValue').textContent = e.target.value + '%';
      if (window.currentResizeTargetElement) {
        window.currentResizeTargetElement.style.width = e.target.value + '%';
        window.currentResizeTargetElement.style.height = 'auto'; // keep aspect ratio
      }
    });
  }

  // Math Modal Logic
  const insertMathBtn = document.getElementById('insertMathBtn');
  const mathModal = document.getElementById('mathModal');
  const mathInput = document.getElementById('mathInput');
  const mathPreview = document.getElementById('mathPreview');
  const confirmInsertMathBtn = document.getElementById('confirmInsertMathBtn');

  if (insertMathBtn && mathModal) {
    let savedSelectionRange = null;

    insertMathBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const selection = window.getSelection();
      savedSelectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      mathInput.value = '';
      mathPreview.innerHTML = '';
      mathModal.style.display = 'flex';
      mathModal.classList.add('active');
    });

    const renderPreview = () => {
      if (!window.katex) {
        mathPreview.innerHTML = `<span style="color: red;">Error: KaTeX library is not loaded. Please hard refresh the page.</span>`;
        return;
      }
      
      let latex = mathInput.value.trim();
      latex = latex.replace(/^\$\$([\s\S]*)\$\$$/, '$1').trim();
      latex = latex.replace(/^\\\(([\s\S]*)\\\)$/, '$1').trim();

      const isDisplay = document.querySelector('input[name="mathMode"]:checked').value === 'display';
      try {
        window.katex.render(latex, mathPreview, {
          displayMode: isDisplay,
          throwOnError: false
        });
      } catch (err) {
        mathPreview.innerHTML = `<span style="color: red;">${err.message}</span>`;
      }
    };

    mathInput.addEventListener('input', renderPreview);
    document.querySelectorAll('input[name="mathMode"]').forEach(r => r.addEventListener('change', renderPreview));

    confirmInsertMathBtn.addEventListener('click', () => {
      let latex = mathInput.value.trim();
      if (latex) {
        // Strip existing delimiters if the user manually typed them in the input
        latex = latex.replace(/^\$\$([\s\S]*)\$\$$/, '$1').trim();
        latex = latex.replace(/^\\\(([\s\S]*)\\\)$/, '$1').trim();

        const isDisplay = document.querySelector('input[name="mathMode"]:checked').value === 'display';
        const formattedLatex = isDisplay ? `$$ ${latex} $$` : `\\( ${latex} \\)`;
        
        const editor = document.getElementById('postContentEditor');
        editor.focus();
        if (savedSelectionRange) {
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(savedSelectionRange);
        }
        
        document.execCommand('insertText', false, formattedLatex);
      }
      window.closeAdminModal('mathModal');
    });
  }

  const imageFileInput = document.getElementById('imageFileInput');
  const dropzoneBox = document.getElementById('dropzoneBox');
  const postImageUrl = document.getElementById('postImageUrl');

  let cropperInstance = null;

  if (dropzoneBox && imageFileInput) {
    dropzoneBox.addEventListener('click', () => imageFileInput.click());
    
    window.openCropper = function(srcUrl) {
      const cropperModal = document.getElementById('cropperModal');
      const cropperImage = document.getElementById('cropperImage');
      if (cropperModal && cropperImage && srcUrl) {
        // Must prevent caching or use crossorigin for external images to avoid canvas taint
        cropperImage.src = srcUrl.startsWith('http') ? srcUrl + (srcUrl.includes('?') ? '&' : '?') + 'notaint=1' : srcUrl;
        cropperModal.style.display = 'flex';
        cropperModal.classList.add('active');
        if (cropperInstance) cropperInstance.destroy();
        cropperInstance = new Cropper(cropperImage, { aspectRatio: 16 / 9, viewMode: 1 });
      }
    };

    const imagePreviewBox = document.getElementById('imagePreviewBox');
    if (imagePreviewBox) {
      imagePreviewBox.addEventListener('click', () => {
        window.currentCropTargetElement = null; // Cover image cropping
        if (imagePreviewBox.src) window.openCropper(imagePreviewBox.src);
      });
    }

    if (postImageUrl && imagePreviewBox) {
      postImageUrl.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          imagePreviewBox.src = val;
          imagePreviewBox.style.display = 'block';
        } else {
          imagePreviewBox.src = '';
          imagePreviewBox.style.display = 'none';
        }
      });
    }

    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        window.currentCropTargetElement = null; // Cover image upload
        const reader = new FileReader();
        reader.onload = function(evt) { window.openCropper(evt.target.result); };
        reader.readAsDataURL(file);
      }
    });

    const confirmCropBtn = document.getElementById('confirmCropBtn');
    if (confirmCropBtn) {
      confirmCropBtn.addEventListener('click', () => {
        if (cropperInstance) {
          const canvas = cropperInstance.getCroppedCanvas({ width: 800 });
          if (canvas) {
            const base64Str = canvas.toDataURL('image/jpeg', 0.7);
            // We are cropping the cover image
            if (postImageUrl) postImageUrl.value = base64Str;
            const preview = document.getElementById('imagePreviewBox');
            if (preview) {
              preview.src = base64Str;
              preview.style.display = 'block';
            }
          }
          if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
          }
          window.closeAdminModal('cropperModal');
          imageFileInput.value = '';
        }
      });
    }
  }
}

function initAdminPanel() {
  try {
    // 4. Session Persistence Check
    const token = localStorage.getItem('admin_token');
    const sessionId = sessionStorage.getItem('my_active_session');
    
    if (token && sessionId) {
      const loginView = document.getElementById('loginView') || document.getElementById('loginOverlay');
      if (loginView) loginView.style.display = 'none';
      const dashboardView = document.getElementById('dashboardView') || document.getElementById('adminMainContainer');
      if (dashboardView) dashboardView.style.display = 'block';
    }
    const qbBtn = document.getElementById('openQuestionBankBtn');
    if (qbBtn) {
      qbBtn.onclick = function(e) {
        if (e) e.preventDefault();
        if (window.openQuestionBankModal) window.openQuestionBankModal();
      };
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = function(e) {
        if (e) e.preventDefault();
        if (window.executeLogout) window.executeLogout();
      };
    }

    // Admin Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeBtn ? themeBtn.querySelector('.theme-icon') : null;

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('apple_resume_theme', theme);
      if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
      }
    }

    const savedTheme = localStorage.getItem('apple_resume_theme') || 'dark';
    applyTheme(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }

    const openAddBtn = document.getElementById('openAddModalBtn');
    if (openAddBtn) {
      openAddBtn.onclick = function(e) {
        if (e) e.preventDefault();
        if (window.openCreatePostModal) window.openCreatePostModal();
      };
    }

    const closeAddBtn = document.getElementById('closeModalBtn');
    if (closeAddBtn) {
      closeAddBtn.onclick = function(e) {
        if (e) e.preventDefault();
        if (window.closePostModal) window.closePostModal();
      };
    }
    
    const cancelPostBtn = document.getElementById('cancelPostBtn');
    if (cancelPostBtn) {
      cancelPostBtn.onclick = function(e) {
        if (e) e.preventDefault();
        if (window.closePostModal) window.closePostModal();
      };
    }

    const postForm = document.getElementById('postForm');
    if (postForm) {
      postForm.onsubmit = function(e) {
        if (e) e.preventDefault();
        if (window.savePostArticle) window.savePostArticle(e);
      };
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.onsubmit = function(e) {
        if (e) e.preventDefault();
        if (window.executeAdminLogin) window.executeAdminLogin(e);
      };
    }

    fetchAdminMetrics();
    fetchBlogPosts();
    setupAdminFilters();
    startSessionMonitoring();
    initRichEditor();
  } catch (err) {
    console.error('Admin Init Error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
  initAdminPanel();
}
