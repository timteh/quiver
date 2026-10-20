/* Copy-to-clipboard for the contract address. Vanilla, no deps.
   Uses the async Clipboard API when available, else a selection + execCommand fallback (file://, old browsers). */
(function () {
  var btns = document.querySelectorAll('.copy-btn[data-copy-target]');
  if (!btns.length) return;

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  }

  function wire(btn) {
  var target = document.getElementById(btn.getAttribute('data-copy-target'));
  var label = btn.querySelector('.copy-label');
  var status = document.getElementById(btn.getAttribute('data-copy-status') || 'copy-status');
  var timer;
  function show(ok) {
    clearTimeout(timer);
    btn.classList.toggle('is-copied', ok);
    btn.setAttribute('data-state', ok ? 'copied' : 'error');
    label.textContent = ok ? 'Copied' : 'Copy failed';
    status.textContent = ok ? 'Contract address copied to clipboard.' : 'Could not copy. Select the address and copy it manually.';
    timer = setTimeout(function () {
      btn.classList.remove('is-copied');
      btn.removeAttribute('data-state');
      label.textContent = 'Copy';
      status.textContent = '';
    }, 2000);
  }

  btn.addEventListener('click', function () {
    var text = (target.textContent || '').trim();
    var p = (navigator.clipboard && window.isSecureContext)
      ? navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); })
      : fallbackCopy(text);
    p.then(function () { show(true); }, function () { show(false); });
  });
  }
  for (var i = 0; i < btns.length; i++) wire(btns[i]);
})();
