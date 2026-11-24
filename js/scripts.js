// スマホ表示とみなす画面の幅（css/styles.css の max-width: 640px と合わせる）
var SP_MAX_WIDTH = 640;

// スライドショーの表示/非表示切り替え機能（トップページにだけある）
function toggleSlideshow() {
  var slideshow = document.querySelector('.sp-slideshow');
  if (!slideshow) return;
  slideshow.style.display = window.innerWidth <= SP_MAX_WIDTH ? 'block' : 'none';
}

// 端末で動きを減らす設定にしているか
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// テキストをクリップボードにコピーする関数（navigator.clipboard が使えないときの方法）
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

// CONTACT：メールアドレスをコピーし、できたらボタンの文字を2秒だけ「Copied」にする
function copyEmail(button, text) {
  function showResult(ok) {
    if (!ok) return;
    var label = button.getAttribute('data-label') || button.textContent;
    button.setAttribute('data-label', label);
    button.style.minWidth = button.offsetWidth + 'px'; // 文字が短くなってもボタンの幅を変えない
    button.textContent = 'Copied';
    clearTimeout(button.copyTimer);
    button.copyTimer = setTimeout(function() {
      button.textContent = label;
    }, 2000);
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function() {
      showResult(true);
    }, function() {
      showResult(copyToClipboard(text));
    });
  } else {
    showResult(copyToClipboard(text));
  }
}

// スマホのメニュー：開け閉めの状態を読み上げ用に伝え、キーボードでも使えるようにする
// （開け閉めそのものは、各ページの jQuery が .toggle を付け外しする）
document.addEventListener("DOMContentLoaded", function() {
  var burger = document.getElementById('hamburger');
  var nav = document.getElementById('sp-nav');
  if (!burger || !nav) return;

  function isOpen() {
    return nav.classList.contains('toggle');
  }
  function updateState() {
    burger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    burger.setAttribute('aria-label', isOpen() ? 'メニューを閉じる' : 'メニューを開く');
  }

  // jQuery が .toggle を付け外ししたあとに、状態を読む
  burger.addEventListener('click', function() {
    setTimeout(function() {
      updateState();
      if (isOpen()) {
        var firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    }, 0);
  });
  var closeButton = nav.querySelector('.close button');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      setTimeout(function() {
        updateState();
        burger.focus();
      }, 0);
    });
  }

  // Esc キーで閉じて、ハンバーガーにフォーカスを戻す
  document.addEventListener('keydown', function(e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) {
      nav.classList.remove('toggle');
      updateState();
      burger.focus();
    }
  });
});

// 日本時間（Asia/Tokyo）での今の年を返す
// 見ている人の端末がどの国の時間に設定されていても、日本の年に合わせる
function getJapanYear(date) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', year: 'numeric' }).format(date);
  } catch (e) {
    // Intl が使えない古いブラウザでは、UTC に9時間足して日本時間の年を出す
    return new Date(date.getTime() + 9 * 60 * 60 * 1000).getUTCFullYear();
  }
}

// フッターのコピーライトの年を、日本時間の今の年に合わせる
document.addEventListener("DOMContentLoaded", function() {
  var year = getJapanYear(new Date());
  document.querySelectorAll('.copyright-year').forEach(function(el) {
    el.textContent = year;
  });
});

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
    if (prefersReducedMotion()) return; // 動きを減らす設定のときは、1枚目だけ出して切り替えない
    setInterval(nextSlide, 3000); // 3秒ごとに次のスライドへ移動
  }

  // SP表示の場合のみスライドショーを開始
  if (window.innerWidth <= SP_MAX_WIDTH) {
    startSlideshow();
  }

  // ウィンドウがリサイズされたときにも表示を切り替える
  window.addEventListener('resize', toggleSlideshow);
});
