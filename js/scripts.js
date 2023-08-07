window.onload = function() {
  // スクロールを禁止にする関数
  function disableScroll(event) {
    event.preventDefault();
  }

  // スクロール禁止
  document.getElementById('on').onclick = function() {
    // イベントと関数を紐付け
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.body.classList.add('overflow-hidden');
  }

  // スクロール解除
  document.getElementById('off').onclick = function() {
    // イベントと関数を紐付け
    document.removeEventListener('touchmove', disableScroll, { passive: false });
    document.body.classList.remove('overflow-hidden');
  }
  // 現在のブラウザサイズに合わせてスライドショーのサイズを調整
  function adjustSlideshowSize() {
    var slideshowContainer = document.querySelector(".sp-slideshow");
    if (slideshowContainer) {
      var width = window.innerWidth;
      // 縦横比を16:9に保つ
      var height = (width * 9) / 16;

      // ここでスライドショーのサイズを調整できます。例：
      slideshowContainer.style.width = width + 'px';
      slideshowContainer.style.height = height + 'px';
    }
  }

    // ブラウザのサイズを読み取り、スライドショーのサイズを調整
    adjustSlideshowSize();
}

// ピンチイン・ピンチアウト禁止
document.documentElement.addEventListener('touchstart', function (e) {
  if (e.touches.length >= 2) {e.preventDefault();}
}, {passive: false});

function copyToClipboard(text){
// テキストコピー用の一時要素を作成
const pre = document.createElement('pre');

// テキストを選択可能にしてテキストセット
pre.style.webkitUserSelect = 'auto';
pre.style.userSelect = 'auto';
pre.textContent = text;

// 要素を追加、選択してクリップボードにコピー
document.body.appendChild(pre);
document.getSelection().selectAllChildren(pre);
const result = document.execCommand('copy');

// 要素を削除
document.body.removeChild(pre);

return result;
}

// DOMのロード完了時に実行
document.addEventListener("DOMContentLoaded", function() {
  // スライドの要素をすべて取得
  var slides = document.querySelectorAll(".sp-slide");
  // 現在のスライドのインデックス
  var currentSlide = 0;

// 指定されたインデックスのスライドを表示
function showSlide(slideIndex) {
  // すべてのスライドを非表示に設定
  slides.forEach(function(slide) {
    slide.style.display = "none"; // 非表示に設定
    slide.style.opacity = 0; // 透明度を0に設定
  });
  // 指定されたスライドを表示
  slides[slideIndex].style.display = "block";
  // 少し遅延させてから透明度を変更することでフェードイン効果を実現
  setTimeout(function() {
    slides[slideIndex].style.opacity = 1;
  }, 10);
}

  // 次のスライドへ移動
  function nextSlide() {
    // 現在のスライドインデックスを更新
    currentSlide = (currentSlide + 1) % slides.length;
    // 指定されたインデックスのスライドを表示
    showSlide(currentSlide);
  }

  // スライドショーを開始
  function startSlideshow() {
    // 最初のスライドを表示
    showSlide(currentSlide);
    // 3秒ごとに次のスライドへ移動
    setInterval(nextSlide, 3000);
  }

  // SP表示の場合のみスライドショーを開始
  if (window.innerWidth <= 640) {
    // スライドショーのコンテナを表示
    document.querySelector(".sp-slideshow").style.display = "block";
    // スライドショーを開始
    startSlideshow();
  }
});

window.addEventListener('load', function() {
  // サイズを取得
  var width = window.innerWidth;
  var height = window.innerHeight;

  // スライドショーのコンテナの要素を取得
  var slideshowContainer = document.querySelector('.sp-slideshow');

  if (slideshowContainer) {
    // サイズに基づいてコンテナの高さと幅を設定
    slideshowContainer.style.width = width + 'px';
    slideshowContainer.style.height = height + 'px';

    // 各スライドのサイズも同様に設定
    var slides = slideshowContainer.querySelectorAll('img');
    slides.forEach(function(slide) {
      slide.style.width = width + 'px';
      slide.style.height = height + 'px';
    });
  }
});
