// ============================================
// 主题切换功能
// ============================================

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // 切换主题
  html.setAttribute('data-theme', newTheme);

  // 保存到本地存储
  localStorage.setItem('theme', newTheme);

  // 更新按钮文本
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const button = document.querySelector('.theme-toggle');
  if (button) {
    button.textContent = theme === 'dark' ? '🌞 浅色' : '🌙 深色';
  }
}

function initTheme() {
  // 从本地存储读取主题偏好
  const savedTheme = localStorage.getItem('theme');

  // 如果有保存的主题，应用它
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
  } else {
    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', defaultTheme);
    updateThemeButton(defaultTheme);
  }

  // 绑定主题切换按钮事件
  const themeButton = document.querySelector('.theme-toggle');
  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }
}

// ============================================
// 移动端菜单功能
// ============================================

function toggleMobileMenu() {
  const nav = document.querySelector('.site-nav');
  if (nav) {
    nav.classList.toggle('active');

    // 阻止页面滚动
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  }
}

function initMobileMenu() {
  const menuButton = document.querySelector('.mobile-menu-button');
  if (menuButton) {
    menuButton.addEventListener('click', toggleMobileMenu);
  }

  // 点击导航链接后关闭移动端菜单
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.querySelector('.site-nav');
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

// ============================================
// 返回顶部功能
// ============================================

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    backToTopButton.addEventListener('click', scrollToTop);

    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'inline-block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    // 初始隐藏
    backToTopButton.style.display = 'none';
  }
}

// ============================================
// 搜索功能（基础实现）
// ============================================

function initSearch() {
  const searchInput = document.querySelector('.search-box input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          // 跳转到Hugo的搜索页面（如果有的话）
          const searchUrl = new URL(window.location.href);
          searchUrl.searchParams.set('s', query);
          window.location.href = searchUrl.toString();
        }
      }
    });
  }
}

// ============================================
// TOC（目录导航）高亮
// ============================================

function initTOCHighlight() {
  const toc = document.querySelector('.toc');
  if (!toc) return;

  const tocLinks = toc.querySelectorAll('a');
  const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');

  if (tocLinks.length === 0 || headings.length === 0) return;

  function highlightCurrentTOC() {
    const scrollPosition = window.scrollY + 100;

    headings.forEach((heading, index) => {
      const top = heading.offsetTop;
      const bottom = top + heading.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        // 移除所有活动状态
        tocLinks.forEach(link => link.classList.remove('active'));
        // 添加当前活动状态
        tocLinks[index].classList.add('active');
      }
    });
  }

  // 节流函数
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // 监听滚动事件
  window.addEventListener('scroll', throttle(highlightCurrentTOC, 100));
}

// ============================================
// 代码复制功能
// ============================================

function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('.post-content pre');

  codeBlocks.forEach(block => {
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-button';
    copyButton.textContent = '复制';
    copyButton.style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.75rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.3s ease;
    `;

    // 设置相对定位以支持绝对定位
    block.style.position = 'relative';

    // 添加复制按钮
    block.appendChild(copyButton);

    // 复制功能
    copyButton.addEventListener('click', async () => {
      const code = block.querySelector('code');
      if (code) {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copyButton.textContent = '已复制!';
          copyButton.style.backgroundColor = 'var(--secondary-color)';

          setTimeout(() => {
            copyButton.textContent = '复制';
            copyButton.style.backgroundColor = 'var(--primary-color)';
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
          copyButton.textContent = '失败';
          copyButton.style.backgroundColor = 'var(--accent-color)';
        }
      }
    });

    // 悬停效果
    copyButton.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });

    copyButton.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0.8';
    });
  });
}

// ============================================
// 图片懒加载
// ============================================

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ============================================
// 页面加载动画
// ============================================

function initPageAnimations() {
  // 为文章卡片添加淡入动画
  const posts = document.querySelectorAll('.post');
  posts.forEach((post, index) => {
    post.style.opacity = '0';
    post.style.animationDelay = `${index * 0.1}s`;

    setTimeout(() => {
      post.classList.add('fade-in');
      post.style.opacity = '1';
    }, 100);
  });

  // 为内容区域添加动画
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.classList.add('fade-in');
  }
}

// ============================================
// 外部链接处理
// ============================================

function initExternalLinks() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('title', '在新窗口打开');
    }
  });
}

// ============================================
// 表单验证（如果有的话）
// ============================================

function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('请填写所有必填字段');
      }
    });
  });
}

// ============================================
// 键盘快捷键
// ============================================

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-box input');
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Esc 关闭移动端菜单
    if (e.key === 'Escape') {
      const nav = document.querySelector('.site-nav');
      if (nav && nav.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });
}

// ============================================
// 页面访问统计（可选）
// ============================================

function trackPageView() {
  // 如果使用分析服务，在这里添加
  // 例如：Google Analytics, 百度统计等
  console.log('Page viewed:', window.location.pathname);
}

// ============================================
// 初始化所有功能
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题
  initTheme();

  // 初始化移动端菜单
  initMobileMenu();

  // 初始化返回顶部
  initBackToTop();

  // 初始化搜索
  initSearch();

  // 初始化TOC高亮
  initTOCHighlight();

  // 初始化代码复制
  initCodeCopy();

  // 初始化图片懒加载
  initLazyLoading();

  // 初始化页面动画
  initPageAnimations();

  // 初始化外部链接
  initExternalLinks();

  // 初始化表单验证
  initFormValidation();

  // 初始化键盘快捷键
  initKeyboardShortcuts();

  // 页面访问统计
  trackPageView();

  console.log('AI Portal initialized successfully!');
});

// ============================================
// 页面卸载时清理
// ============================================

window.addEventListener('beforeunload', function() {
  // 保存滚动位置
  localStorage.setItem('scrollPosition', window.scrollY);
});

// ============================================
// 页面加载时恢复滚动位置
// ============================================

window.addEventListener('load', function() {
  const scrollPosition = localStorage.getItem('scrollPosition');
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
    localStorage.removeItem('scrollPosition');
  }
});
