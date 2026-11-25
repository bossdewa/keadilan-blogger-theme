/* =========================================================
   KEADILAN.CO.ID — File JavaScript Utama (keadilan-theme.js)
   Modular, Ringan, & Aman terhadap Perubahan Gadget Tata Letak
   ========================================================= */
(function () {
  'use strict';

  function initBreakingTicker() {
    var track = document.getElementById('breakingTrack');
    var pauseBtn = document.getElementById('tickerPauseBtn');
    if (!track) return;

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        var paused = track.classList.toggle('is-paused');
        pauseBtn.textContent = paused ? 'Putar' : 'Jeda';
        pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      });
    }

    var bar = document.getElementById('breakingNewsBar');
    var enableAutoCycle =
      (bar && bar.getAttribute('data-auto-cycle') === 'true') || false;
    var intervalSec =
      Number(bar && bar.getAttribute('data-cycle-interval')) || 5;

    if (enableAutoCycle) {
      var items = track.querySelectorAll('.breaking-item');
      var uniqueCount = Math.floor(items.length / 2);
      if (uniqueCount > 1) {
        var activeIdx = 0;
        window.setInterval(function () {
          if (track.classList.contains('is-paused')) return;
          for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('is-spotlight');
          }
          activeIdx = (activeIdx + 1) % uniqueCount;
          if (items[activeIdx]) items[activeIdx].classList.add('is-spotlight');
          if (items[activeIdx + uniqueCount]) {
            items[activeIdx + uniqueCount].classList.add('is-spotlight');
          }
        }, Math.max(2, intervalSec) * 1000);
      }
    }
  }

  function initMobileDrawer() {
    var mobileBtn = document.getElementById('mobileMenuBtn');
    var mobileDrawer = document.getElementById('mobileDrawer');
    if (!mobileBtn || !mobileDrawer) return;

    // Sinkronkan link menu dari gadget Navigasi Utama bila tersedia
    var drawerNav = mobileDrawer.querySelector('.mobile-drawer-nav');
    var mainNavLinks = document.querySelectorAll('.main-nav a');
    if (drawerNav && mainNavLinks.length > 0 && drawerNav.children.length === 0) {
      for (var i = 0; i < mainNavLinks.length; i++) {
        drawerNav.appendChild(mainNavLinks[i].cloneNode(true));
      }
    }

    mobileBtn.addEventListener('click', function () {
      var open = mobileDrawer.classList.toggle('is-open');
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        mobileDrawer.classList.remove('is-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initThemeToggle() {
    var themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    function syncLabel() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    syncLabel();

    themeBtn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      try {
        localStorage.setItem('keadilan_dark_mode', next);
      } catch (e) {}
      syncLabel();
    });
  }

  function initViewModeToggle() {
    var postsWrap = document.getElementById('postsWrap');
    var viewBtns = document.querySelectorAll('[data-view-mode]');
    if (!postsWrap || !viewBtns.length) return;

    function applyViewMode(mode) {
      if (mode === 'grid') postsWrap.classList.add('is-grid');
      else postsWrap.classList.remove('is-grid');
      for (var i = 0; i < viewBtns.length; i++) {
        var btn = viewBtns[i];
        if (btn.getAttribute('data-view-mode') === mode) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
      }
    }

    try {
      var savedView = localStorage.getItem('keadilan_view_mode');
      if (savedView === 'grid' || savedView === 'list') applyViewMode(savedView);
    } catch (e) {}

    for (var j = 0; j < viewBtns.length; j++) {
      viewBtns[j].addEventListener('click', function () {
        var mode = this.getAttribute('data-view-mode') || 'list';
        applyViewMode(mode);
        try {
          localStorage.setItem('keadilan_view_mode', mode);
        } catch (e) {}
      });
    }
  }

  function initFontSizeControls() {
    var fontBtns = document.querySelectorAll('[data-font-size]');
    if (!fontBtns.length) return;

    function applyFontSize(sz) {
      document.documentElement.setAttribute('data-font-size', sz);
      for (var i = 0; i < fontBtns.length; i++) {
        if (fontBtns[i].getAttribute('data-font-size') === sz) {
          fontBtns[i].classList.add('is-active');
        } else {
          fontBtns[i].classList.remove('is-active');
        }
      }
    }

    try {
      var savedFs = localStorage.getItem('keadilan_font_size');
      if (savedFs === 'small' || savedFs === 'medium' || savedFs === 'large') {
        applyFontSize(savedFs);
      }
    } catch (e) {}

    for (var k = 0; k < fontBtns.length; k++) {
      fontBtns[k].addEventListener('click', function () {
        var sz = this.getAttribute('data-font-size') || 'medium';
        applyFontSize(sz);
        try {
          localStorage.setItem('keadilan_font_size', sz);
        } catch (e) {}
      });
    }
  }

  function initScrollUtilities() {
    var progressFill = document.getElementById('readingProgressFill');
    var backBtn = document.getElementById('backToTopBtn');

    function onScroll() {
      var top = window.scrollY || window.pageYOffset || 0;
      if (backBtn) {
        if (top > 320) backBtn.classList.add('is-visible');
        else backBtn.classList.remove('is-visible');
      }
      if (progressFill) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docH > 0 ? Math.min(1, Math.max(0, top / docH)) : 0;
        progressFill.style.transform = 'scaleX(' + pct + ')';
        if (pct >= 0.85) progressFill.classList.add('is-glow');
        else progressFill.classList.remove('is-glow');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function initArticleActions() {
    var copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var url = copyBtn.getAttribute('data-url') || window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            copyBtn.textContent = 'Tautan Tersalin';
            window.setTimeout(function () {
              copyBtn.textContent = 'Salin Tautan';
            }, 2000);
          });
        }
      });
    }

    var printBtn = document.getElementById('printArticleBtn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  function bootstrap() {
    initBreakingTicker();
    initMobileDrawer();
    initThemeToggle();
    initViewModeToggle();
    initFontSizeControls();
    initScrollUtilities();
    initArticleActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
