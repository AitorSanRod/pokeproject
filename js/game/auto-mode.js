// ─────────────────────────────────────────────────────────────────────────────
// AUTO MODE — resuelve automáticamente las elecciones que pide el juego.
//
// Se activa con el checkbox "Auto" de los paneles de ajustes y se persiste en
// localStorage (pkmn_auto_mode), así que afecta a todos los modos de juego.
// Cada pantalla de elección consulta AutoMode.isOn() y, si está activo, llama a
// AutoMode.run() con la acción por defecto. Decisiones actuales:
//   - Captura tras combate salvaje → CONTINUAR (no captura)
//   - Premios (fin de ruta / Battle Frontier) → CONTINUAR (salta el premio)
//   - Llegada a ciudad / gimnasio → CONTINUAR
//   - Selección de camino en ruta → uno al azar entre los disponibles
//   - Pantalla informativa con camino opcional → CONTINUAR (no entra al opcional)
// ─────────────────────────────────────────────────────────────────────────────

var AutoMode = {

  // Pausa antes de ejecutar la acción automática para que se vea la pantalla
  DELAY_MS: 600,

  isOn() {
    return Storage.getAutoMode();
  },

  set(on) {
    Storage.setAutoMode(on);
    console.log(`[AUTO] ${on ? 'Activado' : 'Desactivado'}`);
  },

  // Ejecuta `action` tras DELAY_MS si el modo sigue activo y, opcionalmente,
  // si el elemento `guardId` sigue en el DOM (la pantalla no ha cambiado) y no
  // hay un panel de ajustes abierto encima.
  run(action, guardId = null) {
    if (!this.isOn()) return;
    setTimeout(() => {
      if (!this.isOn()) return;
      if (guardId && !document.getElementById(guardId)) return;
      if (document.querySelector('.cv2-settings-overlay')) return;
      action();
    }, this.DELAY_MS);
  },

  // HTML del checkbox para los paneles de ajustes
  settingsHtml() {
    return `
      <label class="cv2-settings-option cv2-settings-check">
        <input type="checkbox" class="auto-mode-toggle" ${this.isOn() ? 'checked' : ''}>
        <span>Continuar automáticamente</span>
      </label>`;
  },

  // Conecta el checkbox dentro de `panel`
  bindSettings(panel) {
    panel.querySelector('.auto-mode-toggle')
      ?.addEventListener('change', e => this.set(e.target.checked));
  },
};
