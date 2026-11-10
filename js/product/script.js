// 弹窗图集（淡入淡出 + 懒加载 + spinning loader + 16:9 统一容器）
const modal = document.getElementById('productModal');
const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeModal');
const prevBtn = document.querySelector('.prev-arrow');
const nextBtn = document.querySelector('.next-arrow');

// 全屏预览
const previewOverlay = document.getElementById("imagePreviewOverlay");
const previewImg = document.getElementById("previewImg");
const previewClose = document.getElementById("previewClose");

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
      const realSrc = img.dataset.lazy;
      if (!realSrc) return;

      const tempImg = new Image();
      tempImg.src = realSrc;
      tempImg.onload = () => {
        img.src = realSrc;
        img.classList.add('loaded');
        loader.classList.add('hidden');
      };
      tempImg.onerror = () => {
        img.src = realSrc;
        img.classList.add('loaded');
        loader.classList.add('hidden');
      };
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

// 渲染图集
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
            previewImg.src = src;
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

// 大图预览关闭
previewImg.addEventListener("click", function(){
previewOverlay.classList.remove("active");
});
previewClose.addEventListener("click", function(){
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

// 下拉菜单
const DROPDOWN_BREAKPOINT = 769;
const trigger = document.querySelector('.dropdown-trigger');
const menu = document.querySelector('.dropdown-menu');
let isMobileMode = window.innerWidth < DROPDOWN_BREAKPOINT;

function toggleDropdown() {
menu.classList.toggle('open');
}
function closeDropdown() {
menu.classList.remove('open');
}

trigger.addEventListener('click', function(e){
e.preventDefault();
toggleDropdown();
});

document.addEventListener('click', function(e){
if(!e.target.closest('.nav-item-dropdown')){
closeDropdown();
    }
});

window.addEventListener('resize', function(){
const newMobile = window.innerWidth < DROPDOWN_BREAKPOINT;
if(newMobile !== isMobileMode){
isMobileMode = newMobile;
closeDropdown();
    }
});

window.addEventListener('DOMContentLoaded', initLazyImages);
