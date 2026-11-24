// スマホ表示とみなす画面の幅（css/styles.css の max-width: 640px と合わせる）
const SP_MAX_WIDTH = 640;

// 端末で動きを減らす設定にしているか
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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

// テキストをクリップボードにコピーする（navigator.clipboard が使えないときの方法）
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
    const label = button.getAttribute('data-label') || button.textContent;
    button.setAttribute('data-label', label);
    button.style.minWidth = button.offsetWidth + 'px'; // 文字が短くなってもボタンの幅を変えない
    button.textContent = 'Copied';
    clearTimeout(button.copyTimer);
    button.copyTimer = setTimeout(() => {
      button.textContent = label;
    }, 2000);
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showResult(true);
    }, () => {
      showResult(copyToClipboard(text));
    });
  } else {
    showResult(copyToClipboard(text));
  }
}

// スマホのメニュー：.toggle を付け外しして開け閉めし、状態を読み上げ用に伝え、キーボードでも使えるようにする
function setupMenu() {
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('sp-nav');
  if (!burger || !nav) return;

  const isOpen = () => nav.classList.contains('toggle');
  function updateState() {
    burger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    burger.setAttribute('aria-label', isOpen() ? 'メニューを閉じる' : 'メニューを開く');
  }
  function close() {
    nav.classList.remove('toggle');
    updateState();
    burger.focus();
  }

  burger.addEventListener('click', () => {
    nav.classList.toggle('toggle');
    updateState();
    if (isOpen()) {
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  // 「閉じる」の行（×の印も含む）を押したら閉じる
  const closeItem = nav.querySelector('.close');
  if (closeItem) closeItem.addEventListener('click', close);

  // Esc キーで閉じて、ハンバーガーにフォーカスを戻す
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) close();
  });
}

// フッターのコピーライトの年を、日本時間の今の年に合わせる（HTML にも年を書いてあるので、動かなくても読める）
function setupCopyrightYear() {
  const year = getJapanYear(new Date());
  document.querySelectorAll('.copyright-year').forEach((el) => {
    el.textContent = year;
  });
}

// トップ：スマホの写真を3秒ごとに切り替える
// どちらの写真を出すかは css/styles.css で決める（640px以下で .sp-slideshow を出す）。ここでは切り替えだけをする
// JavaScript が動かないときと、動きを減らす設定のときは、1枚目を出したまま
function setupSlideshow() {
  const slideshow = document.querySelector('.sp-slideshow');
  if (!slideshow || prefersReducedMotion()) return;
  const slides = slideshow.querySelectorAll('img');
  if (slides.length < 2) return;

  const spQuery = window.matchMedia('screen and (max-width: ' + SP_MAX_WIDTH + 'px)');
  let current = 0;
  slides[current].classList.add('is-current');
  slideshow.classList.add('is-playing');
  setInterval(() => {
    if (!spQuery.matches) return; // PC の幅のときは写真が見えていないので、切り替えない
    slides[current].classList.remove('is-current');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-current');
  }, 3000);
}

// ページの上に戻るボタン：600pxより下までスクロールしたら出す
// href="#top" なので、押すとページの一番上に戻る
function setupToTop() {
  const toTop = document.getElementById('toTop');
  if (!toTop) return;
  const update = () => {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// CONTACT：ボタンを押したら、data-email のメールアドレスをコピーする
function setupCopyEmail() {
  const button = document.getElementById('copy');
  if (!button || !button.dataset.email) return;
  button.addEventListener('click', () => {
    copyEmail(button, button.dataset.email);
  });
}

// WORKS：作品を、画面に入ったときに上から順にふわっと出す（PC・スマホとも）
// 一度に画面に入った作品（開いたときに見えている作品や、PCの横に並ぶ3つ）は、上から・左から順に0.12秒ずつ遅らせて出す
// 見た目の指定は css/styles.css の .reveal。JavaScript が動かないときと、動きを減らす設定のときは、最初から表示したまま
function setupReveal() {
  const cards = Array.prototype.slice.call(document.querySelectorAll('.card-list'));
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

  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting)
      .map((entry) => entry.target)
      .sort((a, b) => cards.indexOf(a) - cards.indexOf(b)) // ページの中の順（上から・左から）
      .forEach((el, i) => {
        show(el, Math.min(i, 5) * 0.12);
      });
  }, { rootMargin: '0px 0px -5% 0px' }); // 作品の上の端が、画面の下から5%のところまで来たら出す

  cards.forEach((el) => {
    el.classList.add('reveal');
    el.addEventListener('focusin', () => { show(el, 0); }); // キーボードで中のリンクに移ったときは、すぐに出す
    observer.observe(el);
  });
}

// ページを読み込んだら、上の仕組みをまとめて動かす（ないものは、それぞれの中で何もしない）
function init() {
  setupMenu();
  setupCopyrightYear();
  setupSlideshow();
  setupToTop();
  setupCopyEmail();
  setupReveal();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
