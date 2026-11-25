(function () {
  const codes = { left: 'ArrowLeft', right: 'ArrowRight', third: 'Space' };
  const labels = { left: 'White', right: 'Yellow', third: 'Red' };
  const dock = document.createElement('div');
  dock.id = 'web-controls';
  dock.setAttribute('aria-label', 'Interactive controls');
  dock.innerHTML = '<span class="web-controls-label">Click a button to choose</span>' +
    Object.keys(codes).map(id => `<button type="button" data-choice="${id}" aria-label="${labels[id]}">${labels[id]}</button>`).join('') +
    '<button type="button" id="web-reset" title="Start over">Restart</button>';
  document.body.appendChild(dock);

  function send(code) {
    window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true, cancelable: true }));
  }
  dock.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.id === 'web-reset') send('Digit1');
    else if (!button.disabled) send(codes[button.dataset.choice]);
  });

  function update() {
    const status = window.gameStatus?.();
    const idle = status?.phase === 'P0';
    const enabled = new Set([...document.querySelectorAll('#keys .key.is-breathe, #keys .key.is-active')]
      .map(el => el.dataset.key));
    for (const button of dock.querySelectorAll('[data-choice]')) {
      button.disabled = !idle && !enabled.has(button.dataset.choice);
    }
    dock.classList.toggle('is-idle', !!idle);
  }
  new MutationObserver(update).observe(document.querySelector('#keys'), { childList: true, subtree: true });
  setInterval(update, 300);
  update();
})();
