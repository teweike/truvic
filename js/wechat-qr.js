// 页脚微信图标：点击弹出二维码浮层（无脚本时退化为直接打开二维码图片）
(function () {
  var IMG = '/image/brand/wechat-qr.webp';
  var modal = null;

  function build() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'wx-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'WeChat QR code');
    modal.innerHTML = '' +
      '<div class="wx-modal__backdrop" data-wx-close></div>' +
      '<div class="wx-modal__card">' +
      '  <button class="wx-modal__close" type="button" aria-label="Close" data-wx-close>&times;</button>' +
      '  <div class="wx-modal__head">' +
      '    <p class="wx-modal__title">Chat with us on WeChat</p>' +
      '    <p class="wx-modal__sub">Scan the QR code to add TEWEIKE Machinery</p>' +
      '  </div>' +
      '  <img class="wx-modal__qr" src="' + IMG + '" alt="TEWEIKE Machinery WeChat QR code" width="745" height="1000">' +
      '  <p class="wx-modal__hint">Open WeChat &rsaquo; Discover &rsaquo; Scan QR Code<br>or long-press the code on mobile to save it</p>' +
      '</div>';
    modal.addEventListener('click', function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-wx-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function open() {
    build().classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  var css = '' +
    '.wx-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;}' +
    '.wx-modal.is-open{display:flex;}' +
    '.wx-modal__backdrop{position:absolute;inset:0;background:rgba(15,26,21,.72);backdrop-filter:blur(2px);}' +
    '.wx-modal__card{position:relative;max-width:360px;width:100%;background:#fff;border-radius:18px;padding:22px 22px 18px;box-shadow:0 24px 60px rgba(0,0,0,.28);text-align:center;max-height:92vh;overflow:auto;}' +
    '.wx-modal__close{position:absolute;top:8px;right:12px;border:0;background:none;font-size:28px;line-height:1;color:#8a9a91;cursor:pointer;padding:4px;}' +
    '.wx-modal__close:hover{color:#17362E;}' +
    '.wx-modal__head{text-align:left;margin-bottom:14px;padding-right:22px;}' +
    '.wx-modal__logo{border-radius:8px;flex:0 0 auto;}' +
    '.wx-modal__title{margin:0;font-size:1.05rem;font-weight:700;color:#17362E;}' +
    '.wx-modal__sub{margin:2px 0 0;font-size:.82rem;color:#6b7c73;}' +
    '.wx-modal__qr{width:100%;height:auto;max-width:300px;display:block;margin:0 auto;border-radius:10px;border:1px solid #e6ece8;}' +
    '.wx-modal__hint{margin:14px 0 0;font-size:.8rem;line-height:1.5;color:#7c8b83;}' +
    '@media(max-width:480px){.wx-modal__pad{padding:16px}.wx-modal__card{padding:18px 16px 14px}.wx-modal__qr{max-width:240px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.social-wx');
    if (!a) return;
    e.preventDefault();
    open();
  });
})();
