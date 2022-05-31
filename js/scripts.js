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
}

// ピンチイン・ピンチアウト禁止
document.documentElement.addEventListener('touchstart', function (e) {
  if (e.touches.length >= 2) {e.preventDefault();}
}, {passive: false});