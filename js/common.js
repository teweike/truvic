// 全站通用脚本：页脚年份 + 顶部 PRODUCTS 下拉（PC hover / 移动端点击，支持二级、三级）
// 供机型详情页与 about/contact/support/terms/faq/privacy/thank-you 等信息页使用
document.querySelectorAll('#footerYear').forEach(function (e) {
  e.textContent = new Date().getFullYear();
});

(function () {
  var wrap = document.querySelector('.nav-item-dropdown');
  if (!wrap) return;
  var DROPDOWN_BREAKPOINT = 768;
  var caret = wrap.querySelector('.dropdown-caret');
  var trigger = wrap.querySelector('.dropdown-trigger');
  var subs = wrap.querySelectorAll('.submenu-trigger');

  function closeAll() {
    wrap.classList.remove('open');
    wrap.querySelectorAll('li.open').forEach(function (li) { li.classList.remove('open'); });
    if (caret) caret.setAttribute('aria-expanded', 'false');
  }

  if (caret) {
    caret.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.toggle('open');
      caret.setAttribute('aria-expanded', wrap.classList.contains('open') ? 'true' : 'false');
    });
  }

  subs.forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth > DROPDOWN_BREAKPOINT) return;
      var li = t.parentElement;
      var opened = li.classList.toggle('open');
      Array.prototype.forEach.call(li.parentElement.children, function (sb) {
        if (sb !== li && sb.classList) sb.classList.remove('open');
      });
      if (!opened) li.classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item-dropdown')) closeAll();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > DROPDOWN_BREAKPOINT) closeAll();
  });

  if (trigger) {
    // 桌面端 hover 由 CSS 负责，这里仅保证移动端点击不会意外触发跳转
    trigger.addEventListener('click', function () {});
  }
})();
