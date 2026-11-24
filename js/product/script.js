// 弹窗图集（淡入淡出 + 懒加载 + spinning loader + 16:9 统一容器）
// WebP 优先：支持的浏览器自动换用同名 .webp（体积约为 PNG 的 1/10），老浏览器回落原图
const WEBP_OK = (function(){try{return document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;}catch(e){return false;}})();
function webpOf(u){ return WEBP_OK ? String(u).replace(/\.(png|jpe?g)$/i, '.webp') : u; }
// 卡片缩略图：image/thumbs/**/*.webp（720px，卡片只需这么宽）
function thumbOf(u){ return WEBP_OK ? String(u).replace(/^image\//, 'image/thumbs/').replace(/\.(png|jpe?g)$/i, '.webp') : null; }
const modal = document.getElementById('productModal');
const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeModal');
const prevBtn = document.querySelector('.prev-arrow');
const nextBtn = document.querySelector('.next-arrow');

// 全屏预览图集
const previewOverlay = document.getElementById("imagePreviewOverlay");
const previewTrack = document.getElementById("previewTrack");
const previewDots = document.getElementById("previewDots");
const previewClose = document.getElementById("previewClose");
const previewPrev = document.querySelector(".preview-prev");
const previewNext = document.querySelector(".preview-next");

let galleryList = [];
let currentIndex = 0;
let autoPlayTimer = null;
const AUTO_PLAY_DELAY = 3500;
let isAutoPlay = true;
let autoplayToggleBtn = null;

// ========== 懒加载观察器 ==========
const lazyObserver = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const imgWrap = entry.target;
const img = imgWrap.querySelector('.lazy-img');
const loader = imgWrap.querySelector('.img-loader');
const fullSrc = webpOf(img.dataset.lazy);
if (!fullSrc) return;
const thumbSrc = thumbOf(img.dataset.lazy);

function show(src){
img.src = src;
img.classList.add('loaded');
loader.classList.add('hidden');
}
function load(src, ok, fail){
if (!src) return fail();
const t = new Image();
t.onload = ok;
t.onerror = fail;
t.src = src;
}
// 三级回退：缩略 webp -> 全尺寸 webp -> 原始 png/jpg
load(thumbSrc, () => show(thumbSrc),
() => load(fullSrc, () => show(fullSrc), () => show(img.dataset.lazy)));
observer.unobserve(imgWrap);
}
});
}, {
rootMargin: "150px 0px",
threshold: 0.01
});

function initLazyImages() {
document.querySelectorAll('.product-img-box').forEach(box => {
if (!box.querySelector('.img-wrap')) {
const oldImg = box.querySelector('.lazy-img');
const wrap = document.createElement('div');
wrap.className = 'img-wrap';
const loader = document.createElement('div');
loader.className = 'img-loader';
wrap.appendChild(loader);
wrap.appendChild(oldImg);
box.appendChild(wrap);
}
lazyObserver.observe(box.querySelector('.img-wrap'));
});
}

// 渲染弹窗内滑块
function renderSlider(images){
galleryList = images;
currentIndex = 0;
sliderTrack.innerHTML = '';
sliderDots.innerHTML = '';

if(autoplayToggleBtn) autoplayToggleBtn.remove();

images.forEach((src, idx)=>{
const slide = document.createElement('div');
slide.className = 'slide-item' + (idx === 0 ? ' active' : '');

const wrap = document.createElement('div');
wrap.className = 'img-wrap';
const loader = document.createElement('div');
loader.className = 'img-loader';
wrap.appendChild(loader);

const img = document.createElement('img');
img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
img.dataset.lazy = src;
img.alt = "gallery";
img.classList.add('lazy-img');

img.addEventListener('click',()=>{
renderPreviewGallery(galleryList, idx);
previewOverlay.classList.add("active");
})
wrap.appendChild(img);
slide.appendChild(wrap);
sliderTrack.appendChild(slide);
lazyObserver.observe(wrap);

const dot = document.createElement('span');
dot.className = 'dot' + (idx === 0 ? ' active' : '');
dot.dataset.idx = idx;
dot.addEventListener('click',()=>{
goToSlide(idx);
resetAutoPlay();
})
sliderDots.appendChild(dot);
})

if(images.length <=1){
prevBtn.classList.add('hidden');
nextBtn.classList.add('hidden');
sliderDots.style.display = "none";
stopAutoPlay();
}else{
prevBtn.classList.remove('hidden');
nextBtn.classList.remove('hidden');
sliderDots.style.display = "flex";

autoplayToggleBtn = document.createElement('button');
autoplayToggleBtn.className = 'autoplay-toggle';
autoplayToggleBtn.innerHTML = isAutoPlay ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
autoplayToggleBtn.title = isAutoPlay ? "Pause autoplay" : "Start autoplay";
autoplayToggleBtn.addEventListener('click', ()=>{
isAutoPlay = !isAutoPlay;
autoplayToggleBtn.innerHTML = isAutoPlay ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
autoplayToggleBtn.title = isAutoPlay ? "Pause autoplay" : "Start autoplay";
if(isAutoPlay) startAutoPlay();
else stopAutoPlay();
})
document.querySelector('.modal-img-wrap').appendChild(autoplayToggleBtn);

startAutoPlay();
}
updateActiveSlide();
}

function updateActiveSlide(){
const slides = sliderTrack.querySelectorAll('.slide-item');
const dots = sliderDots.querySelectorAll('.dot');
slides.forEach((s,i)=>{
s.classList.toggle('active', i === currentIndex);
})
dots.forEach((d,i)=>{
d.classList.toggle('active', i === currentIndex);
})
}
function goToSlide(idx){
if(idx <0) idx = galleryList.length -1;
if(idx >= galleryList.length) idx = 0;
currentIndex = idx;
updateActiveSlide();
}

// 自动轮播
function startAutoPlay(){
stopAutoPlay();
if(!isAutoPlay || galleryList.length <=1) return;
autoPlayTimer = setInterval(()=>{
goToSlide(currentIndex + 1);
}, AUTO_PLAY_DELAY);
}
function stopAutoPlay(){
clearInterval(autoPlayTimer);
autoPlayTimer = null;
}
function resetAutoPlay(){
stopAutoPlay();
if(isAutoPlay) startAutoPlay();
}

prevBtn.addEventListener('click', ()=> {
goToSlide(currentIndex -1);
resetAutoPlay();
});
nextBtn.addEventListener('click', ()=> {
goToSlide(currentIndex +1);
resetAutoPlay();
});

// 触摸手势
let touchStartX = 0;
let touchEndX = 0;
sliderTrack.addEventListener('touchstart', e=>{
touchStartX = e.changedTouches[0].screenX;
stopAutoPlay();
})
sliderTrack.addEventListener('touchend', e=>{
touchEndX = e.changedTouches[0].screenX;
const diff = touchStartX - touchEndX;
if(Math.abs(diff) > 40){
if(diff>0) goToSlide(currentIndex+1);
else goToSlide(currentIndex-1);
}
resetAutoPlay();
})

// hover暂停
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', stopAutoPlay);
sliderContainer.addEventListener('mouseleave', resetAutoPlay);

// 打开弹窗
document.querySelectorAll('.product-img-box').forEach(box => {
box.addEventListener('click', function(){
const card = this.closest('.product-card');
const raw = card.dataset.gallery || '';
const imgs = raw.split(',').map(s=>s.trim()).filter(s=>s);
modalTitle.textContent = card.dataset.title;
modalDesc.textContent = card.dataset.desc;
// 机型有独立详情页时，在弹窗里给出技术参数入口
let specBtn = document.getElementById("modalSpecBtn");
if (!specBtn) {
specBtn = document.createElement("a");
specBtn.id = "modalSpecBtn";
specBtn.className = "modal-spec-btn";
specBtn.innerHTML = 'Full specifications <i class="fas fa-arrow-right"></i>';
const quoteAnchor = document.getElementById("modalQuoteBtn");
quoteAnchor.parentNode.insertBefore(specBtn, quoteAnchor);
}
if (card.dataset.detail) {
specBtn.href = card.dataset.detail;
specBtn.style.display = "inline-flex";
} else {
specBtn.removeAttribute("href");
specBtn.style.display = "none";
}
const quoteBtn = document.getElementById("modalQuoteBtn");
if (quoteBtn) {
// 多产线总览页：优先取卡片所在区块的 data-line，单产线页回落 body
const sectionLine = card.closest('.product-section') ? (card.closest('.product-section').dataset.line || "") : "";
const pageLine = sectionLine || document.body.dataset.line || "";
quoteBtn.href = "index.html?machine=" + encodeURIComponent(card.dataset.title || "")
+ (pageLine ? "&line=" + encodeURIComponent(pageLine) : "") + "#contact-form";
}
renderSlider(imgs);
modal.classList.add('active');
document.body.style.overflow = 'hidden';
})
})
function closeModalFunc(){
modal.classList.remove('active');
document.body.style.overflow = '';
stopAutoPlay();
}
closeBtn.addEventListener('click', closeModalFunc);
modal.addEventListener('click', function(e){
if(e.target === modal){
closeModalFunc();
}
})

// ========== 全屏预览图集逻辑 ==========
let previewGallery = [];
let previewIndex = 0;
let previewTouchStartX = 0;
let previewTouchEndX = 0;

function renderPreviewGallery(list, startIdx=0){
previewGallery = list;
previewIndex = startIdx;
previewTrack.innerHTML = '';
previewDots.innerHTML = '';

previewGallery.forEach((src, idx)=>{
const previewSlide = document.createElement('div');
previewSlide.className = 'preview-slide' + (idx === previewIndex ? ' active' : '');

const wrap = document.createElement('div');
wrap.className = 'img-wrap preview-img-wrap';
const loader = document.createElement('div');
loader.className = 'img-loader';
wrap.appendChild(loader);

const img = document.createElement('img');
img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
img.dataset.lazy = src;
img.alt = "preview";
img.classList.add('lazy-img');
wrap.appendChild(img);
previewSlide.appendChild(wrap);
previewTrack.appendChild(previewSlide);
lazyObserver.observe(wrap);

const dot = document.createElement('span');
dot.className = 'preview-dot' + (idx === previewIndex ? ' active' : '');
dot.dataset.idx = idx;
dot.addEventListener('click', ()=>{
goPreviewSlide(idx);
})
previewDots.appendChild(dot);
})
togglePreviewArrow();
updatePreviewSlide();
}
function updatePreviewSlide(){
const slides = previewTrack.querySelectorAll('.preview-slide');
const dots = previewDots.querySelectorAll('.preview-dot');
slides.forEach((s,i)=> s.classList.toggle('active', i === previewIndex));
dots.forEach((d,i)=> d.classList.toggle('active', i === previewIndex));
}
function goPreviewSlide(idx){
if(idx <0) idx = previewGallery.length -1;
if(idx >= previewGallery.length) idx = 0;
previewIndex = idx;
updatePreviewSlide();
}
function togglePreviewArrow(){
if(previewGallery.length <=1){
previewPrev.style.display="none";
previewNext.style.display="none";
previewDots.style.display="none";
}else{
previewPrev.style.display="flex";
previewNext.style.display="flex";
previewDots.style.display="flex";
}
}
previewPrev.addEventListener('click', ()=> goPreviewSlide(previewIndex -1));
previewNext.addEventListener('click', ()=> goPreviewSlide(previewIndex +1));

previewTrack.addEventListener('touchstart', e=>{
previewTouchStartX = e.changedTouches[0].screenX;
})
previewTrack.addEventListener('touchend', e=>{
previewTouchEndX = e.changedTouches[0].screenX;
const diff = previewTouchStartX - previewTouchEndX;
if(Math.abs(diff)>40){
if(diff>0) goPreviewSlide(previewIndex+1);
else goPreviewSlide(previewIndex-1);
}
})

previewClose.addEventListener("click", ()=>{
previewOverlay.classList.remove("active");
});
previewOverlay.addEventListener("click", function(e){
if(e.target === previewOverlay){
previewOverlay.classList.remove("active");
}
});

// 页面内锚点滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
const href = this.getAttribute('href');
if(href !== '#'){
const target = document.querySelector(href);
if(target) {
e.preventDefault();
const navHeight = document.querySelector('.navbar').offsetHeight || 80;
window.scrollTo({
top: target.getBoundingClientRect().top + window.scrollY - navHeight - 12,
behavior: 'smooth'
});
}
}
})
})

// ========== 下拉菜单（PC hover / 移动端点击｜支持二级、三级）==========
const DROPDOWN_BREAKPOINT = 768;
const dropdownWrap = document.querySelector('.nav-item-dropdown');
const dropdownTrigger = dropdownWrap ? dropdownWrap.querySelector('.dropdown-trigger') : null;
const dropdownCaret = dropdownWrap ? dropdownWrap.querySelector('.dropdown-caret') : null;
const subTriggers = dropdownWrap ? dropdownWrap.querySelectorAll('.submenu-trigger') : [];

function closeAllPanels() {
	if (!dropdownWrap) return;
	dropdownWrap.classList.remove('open');
	dropdownWrap.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
	if (typeof syncCaretState === 'function') syncCaretState();
}

// 只有右侧小箭头负责展开/收起，PRODUCTS 文字是正常链接（跳 All Products 页）
function onCaretClick(e) {
	e.preventDefault();
	e.stopPropagation();
	const opened = dropdownWrap.classList.toggle('open');
	if (!opened) closeAllPanels();
	syncCaretState();
}

function syncCaretState() {
	if (dropdownCaret) dropdownCaret.setAttribute('aria-expanded', dropdownWrap.classList.contains('open') ? 'true' : 'false');
}

function onSubTriggerClick(e) {
	e.preventDefault();
	e.stopPropagation();
	if (window.innerWidth > DROPDOWN_BREAKPOINT) return; // PC 端交给 CSS hover
	const li = e.currentTarget.parentElement;
	const opened = li.classList.toggle('open');
	// 同级分组只保留一个展开
	Array.from(li.parentElement.children).forEach(sib => {
		if (sib !== li && sib.classList) sib.classList.remove('open');
	});
	if (!opened) li.classList.remove('open');
}

if (dropdownTrigger) {
	if (dropdownCaret) dropdownCaret.addEventListener('click', onCaretClick);
	subTriggers.forEach(t => t.addEventListener('click', onSubTriggerClick));
	document.addEventListener('click', function (e) {
		if (!e.target.closest('.nav-item-dropdown')) closeAllPanels();
	});
	window.addEventListener('resize', function () {
		if (window.innerWidth > DROPDOWN_BREAKPOINT) closeAllPanels();
	});
}

window.addEventListener('DOMContentLoaded', initLazyImages);
