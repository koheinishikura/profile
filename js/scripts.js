// スライドショーのサイズ調整機能
function adjustSlideshowSize() {
  var slideshowContainer = document.querySelector(".sp-slideshow");
  if (slideshowContainer) {
    var width = window.innerWidth;
    var height = (width * 9) / 16; // 縦横比を16:9に保つ
    slideshowContainer.style.width = width + 'px';
    slideshowContainer.style.height = height + 'px';
  }
}

// スライドショーの表示/非表示切り替え機能
function toggleSlideshow() {
  if (window.innerWidth <= 641) {
    document.querySelector('.sp-slideshow').style.display = 'block';
    document.querySelectorAll('.sp').forEach(function(el) {
      el.style.display = 'block';
    });
  } else {
    document.querySelector('.sp-slideshow').style.display = 'none';
    document.querySelectorAll('.sp').forEach(function(el) {
      el.style.display = 'none';
    });
  }
}

window.onload = function() {
  // スクロール禁止機能
  function disableScroll(event) { event.preventDefault(); }
  document.getElementById('on').onclick = function() {
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.body.classList.add('overflow-hidden');
  };
  document.getElementById('off').onclick = function() {
    document.removeEventListener('touchmove', disableScroll, { passive: false });
    document.body.classList.remove('overflow-hidden');
  };

  adjustSlideshowSize();
  window.addEventListener('resize', adjustSlideshowSize);

  toggleSlideshow(); // この関数を初期ロード時にも呼び出す
  window.addEventListener('resize', toggleSlideshow);
};

// ピンチイン・ピンチアウトを禁止する機能
document.documentElement.addEventListener('touchstart', function (e) {
  if (e.touches.length >= 2) {e.preventDefault();}
}, {passive: false});

// テキストをクリップボードにコピーする関数
function copyToClipboard(text) {
  const pre = document.createElement('pre');
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';
  pre.textContent = text;
  document.body.appendChild(pre);
  document.getSelection().selectAllChildren(pre);
  const result = document.execCommand('copy');
  document.body.removeChild(pre);
  return result;
}

// DOMのロード完了時にスライドショーを制御する機能
document.addEventListener("DOMContentLoaded", function() {
  toggleSlideshow();
  var slides = document.querySelectorAll(".sp-slide"); // スライド要素をすべて取得
  var currentSlide = 0; // 現在のスライドのインデックス

  // 指定されたインデックスのスライドを表示する関数
  function showSlide(slideIndex) {
    slides.forEach(function(slide) {
      slide.style.display = "none"; // 非表示に設定
      slide.style.opacity = 0; // 透明度を0に設定
    });
    slides[slideIndex].style.display = "block"; // 指定されたスライドを表示
    setTimeout(function() {
      slides[slideIndex].style.opacity = 1; // フェードイン効果
    }, 10);
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length; // 次のスライドへ移動
    showSlide(currentSlide);
  }

  function startSlideshow() {
    showSlide(currentSlide);
    setInterval(nextSlide, 3000); // 3秒ごとに次のスライドへ移動
  }

  // SP表示の場合のみスライドショーを開始
  if (window.innerWidth <= 640) {
    document.querySelector(".sp-slideshow").style.display = "block";
    startSlideshow();
  }
});

// ウィンドウがリサイズされたときにも関数を実行
window.addEventListener('resize', function() {
  toggleSlideshow();
});