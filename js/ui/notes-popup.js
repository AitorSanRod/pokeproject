// ─────────────────────────────────────────────────────────────────────────────
// NOTES POPUP — carga docs/notes.json y muestra un popup flotante
// ─────────────────────────────────────────────────────────────────────────────

const NotesPopup = {

  _overlay: null,

  open() {
    if (NotesPopup._overlay) return;

    const data = (typeof NOTES_DATA !== 'undefined')
      ? NOTES_DATA
      : { title: 'Sin datos', lines: ['docs/notes.js no está cargado.'] };

    const overlay = document.createElement('div');
    overlay.id = 'notes-overlay';
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:rgba(0,0,0,.55)',
      'z-index:99999',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:24px',
    ].join(';');

    overlay.innerHTML = `
      <div style="background:#1a1814;border:1px solid rgba(255,255,255,.18);border-radius:10px;
        max-width:360px;width:100%;max-height:82vh;display:flex;flex-direction:column;overflow:hidden;
        box-shadow:0 8px 32px rgba(0,0,0,.6)">

        <!-- Cabecera -->
        <div style="display:flex;align-items:center;justify-content:space-between;
          padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.12);flex-shrink:0">
          <span style="font-family:'Press Start 2P',monospace;font-size:11px;
            color:rgba(255,255,255,.9);letter-spacing:2px">NOTAS</span>
          <button id="notes-close" style="font-size:15px;color:rgba(255,255,255,.5);
            background:none;border:none;cursor:pointer;padding:2px 8px;line-height:1;
            border-radius:4px">✕</button>
        </div>

        <!-- Contenido scrollable -->
        <div style="overflow-y:auto;flex:1;min-height:0;padding:18px 18px">
          <div style="font-family:'Press Start 2P',monospace;font-size:8px;line-height:2;
            color:rgba(255,255,255,.55);margin-bottom:18px;letter-spacing:1px">
            ${typeof GAME_VERSION !== 'undefined' ? `${GAME_VERSION} — ` : ''}${data.title}
          </div>
          <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px">
            ${data.lines.map(line => `
              <li style="display:flex;align-items:flex-start;gap:12px">
                <span style="color:rgba(255,255,255,.4);flex-shrink:0;font-size:12px;line-height:2.2">•</span>
                <span style="font-family:'Press Start 2P',monospace;font-size:8px;
                  color:rgba(255,255,255,.8);line-height:2.2">${line}</span>
              </li>`).join('')}
          </ul>
        </div>
      </div>`;

    overlay.addEventListener('click', e => {
      if (e.target === overlay) NotesPopup.close();
    });
    overlay.querySelector('#notes-close').addEventListener('click', () => NotesPopup.close());

    document.body.appendChild(overlay);
    NotesPopup._overlay = overlay;
  },

  close() {
    NotesPopup._overlay?.remove();
    NotesPopup._overlay = null;
  },
};
