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

// スマホのメニュー：.toggle を付け外しして開け閉めし、状態を読み上げ用に伝え、キーボードでも使えるようにする
// （2026-11-24に jQuery をやめ、開け閉めもここでするようにした）
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

  burger.addEventListener('click', function() {
    nav.classList.toggle('toggle');
    updateState();
    if (isOpen()) {
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  // 「閉じる」の行（×の印も含む）を押したら閉じる
  var closeItem = nav.querySelector('.close');
  if (closeItem) {
    closeItem.addEventListener('click', function() {
      nav.classList.remove('toggle');
      updateState();
      burger.focus();
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

// ページの上に戻るボタン：600pxより下までスクロールしたら出す（2026-11-24）
// href="#top" なので、押すとページの一番上に戻る
document.addEventListener("DOMContentLoaded", function() {
  var toTop = document.getElementById('toTop');
  if (!toTop) return;
  function updateToTop() {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateToTop, { passive: true });
  updateToTop();
});

// WORKS：作品を、画面に入ったときに上から順にふわっと出す（2026-11-24。PC・スマホとも）
// 一度に画面に入った作品（開いたときに見えている作品や、PCの横に並ぶ3つ）は、上から・左から順に0.12秒ずつ遅らせて出す
// 見た目の指定は css/styles.css の .reveal。JavaScript が動かないときと、動きを減らす設定のときは、最初から表示したまま
(function() {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card-list'));
  if (!cards.length || !('IntersectionObserver' in window) || prefersReducedMotion()) return;

  function show(el, delay) {
    if (!el.classList.contains('reveal') || el.classList.contains('is-revealed')) return;
    observer.unobserve(el);
    if (delay) el.style.transitionDelay = delay + 's';
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.removeEventListener('transitionend', done);
      el.classList.remove('reveal', 'is-revealed'); // 出し終えたら、動きのための指定を外す（ほかの指定のじゃまをしないように）
      el.style.removeProperty('transition-delay');
    });
    el.classList.add('is-revealed');
  }

  var observer = new IntersectionObserver(function(entries) {
    var shown = entries.filter(function(entry) { return entry.isIntersecting; })
      .map(function(entry) { return entry.target; })
      .sort(function(a, b) { return cards.indexOf(a) - cards.indexOf(b); }); // ページの中の順（上から・左から）
    shown.forEach(function(el, i) {
      show(el, Math.min(i, 5) * 0.12);
    });
  }, { rootMargin: '0px 0px -5% 0px' }); // 作品の上の端が、画面の下から5%のところまで来たら出す

  cards.forEach(function(el) {
    el.classList.add('reveal');
    el.addEventListener('focusin', function() { show(el, 0); }); // キーボードで中のリンクに移ったときは、すぐに出す
    observer.observe(el);
  });
})();
