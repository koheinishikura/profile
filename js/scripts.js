// ページのロード完了時に実行
window.onload = function() {
  // スクロールを禁止にする関数
  function disableScroll(event) {
    event.preventDefault(); // デフォルトのタッチイベントを無効にする
  }

  // スクロール禁止機能
  document.getElementById('on').onclick = function() {
    // タッチ移動イベントとスクロール禁止関数を紐付け
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.body.classList.add('overflow-hidden'); // オーバーフローを隠すCSSクラスを追加
  }

  // スクロール解除機能
  document.getElementById('off').onclick = function() {
    // タッチ移動イベントとスクロール禁止関数の紐付けを解除
    document.removeEventListener('touchmove', disableScroll, { passive: false });
    document.body.classList.remove('overflow-hidden'); // オーバーフローを隠すCSSクラスを削除
  }

  // スライドショーのサイズを調整する関数
  function adjustSlideshowSize() {
    var slideshowContainer = document.querySelector(".sp-slideshow");
    if (slideshowContainer) {
      var width = window.innerWidth;
      var height = (width * 9) / 16; // 縦横比を16:9に保つ
      slideshowContainer.style.width = width + 'px';
      slideshowContainer.style.height = height + 'px';
    }
  }

  // ブラウザのサイズを読み取り、スライドショーのサイズを調整
  adjustSlideshowSize();

  // ブラウザリサイズ時にスライドショーのサイズを調整
  window.addEventListener('resize', adjustSlideshowSize);

  // スライドショーの表示/非表示を切り替える関数
  function handleSlideshowVisibility() {
    var slideshowContainer = document.querySelector('.sp-slideshow');
    if (slideshowContainer) {
      if (window.innerWidth <= 640) {
        slideshowContainer.style.display = 'block';
      } else {
        slideshowContainer.style.display = 'none';
      }
    }
  }

  // 初期ロード時に関数を実行
  handleSlideshowVisibility();

  // ブラウザリサイズ時にスライドショーのサイズを調整
  window.addEventListener('resize', function() {
    adjustSlideshowSize();
    handleSlideshowVisibility(); // リサイズ時に表示を切り替え
  });
}

// ピンチイン・ピンチアウトを禁止する機能
document.documentElement.addEventListener('touchstart', function (e) {
  if (e.touches.length >= 2) {e.preventDefault();}
}, {passive: false});

// テキストをクリップボードにコピーする関数
function copyToClipboard(text){
  const pre = document.createElement('pre');
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';
  pre.textContent = text;
  document.body.appendChild(pre);
  document.getSelection().selectAllChildren(pre);
  const result = document.execCommand('copy');
  document.body.removeChild(pre); // 一時要素を削除
  return result;
}

// DOMのロード完了時にスライドショーを制御する機能
document.addEventListener("DOMContentLoaded", function() {
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

window.addEventListener('load', function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var slideshowContainer = document.querySelector('.sp-slideshow');

  if (slideshowContainer) {
    slideshowContainer.style.width = width + 'px';
    slideshowContainer.style.height = height + 'px';
    var slides = slideshowContainer.querySelectorAll('img');
    slides.forEach(function(slide) {
      slide.style.width = width + 'px';
      slide.style.height = height + 'px'; // 各スライドのサイズを設定
    });
  }
});

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

// ウィンドウがリサイズされたときにも関数を実行
window.addEventListener('resize', toggleSlideshow);