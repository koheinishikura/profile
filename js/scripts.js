// スマホ表示とみなす画面の幅（css/styles.css の max-width: 640px と合わせる）
var SP_MAX_WIDTH = 640;

// スライドショーの表示/非表示切り替え機能（トップページにだけある）
function toggleSlideshow() {
  var slideshow = document.querySelector('.sp-slideshow');
  if (!slideshow) return;
  slideshow.style.display = window.innerWidth <= SP_MAX_WIDTH ? 'block' : 'none';
}

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
  var slides = document.querySelectorAll(".sp-slide"); // スライド要素をすべて取得
  if (slides.length === 0) return; // スライドショーのないページでは何もしない

  toggleSlideshow();
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
  if (window.innerWidth <= SP_MAX_WIDTH) {
    startSlideshow();
  }

  // ウィンドウがリサイズされたときにも表示を切り替える
  window.addEventListener('resize', toggleSlideshow);
});
