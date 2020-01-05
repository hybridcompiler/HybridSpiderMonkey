/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\flags.js');

window.DlgCode = DLGC_WANTALLKEYS;

const HSM = this;

// Hsm.drawImage constants
const DI_KEEP_ASPECT = 1;

// Hsm.chrToImg constants
const CHAR_FONT_NAME = 'Font Awesome 5 Free Solid';

// HsmControl constants
const DRAG_MARGIN = 200;
const DOCK_FIX = 0,
  DOCK_LEFT = 1,
  DOCK_TOP = 2,
  DOCK_RIGHT = 4,
  DOCK_BOTTOM = 8,
  DOCK_SQUARE = 16,
  DOCK_FILL = 32;

// callbacks

function on_colours_changed() {
  window.Reload();
}

function on_font_changed() {
  window.Reload();
}

class Hsm {
  static init() {
    Hsm.mx = 0;
    Hsm.my = 0;

    Hsm.bmp = gdi.CreateImage(1, 1);
    Hsm.gr = Hsm.bmp.GetGraphics();

    Hsm.UiHack = new ActiveXObject('UIHacks');
  }

  static log() {
    let text = '';
    for (const TEXT of arguments) {
      text += TEXT + ', '
    }
    console.log(text.slice(0, text.length - 2));
  }

  static toggleMenu() {
    Hsm.UiHack.MainMenuState = 1 - Hsm.UiHack.MainMenuState;
  }

  static chrToImg(chr, colour, size) {
    if (size < 1) return null;
    if (!Hsm.charFont) Hsm.charFont = gdi.Font(CHAR_FONT_NAME, 48);

    const FONT = size == Hsm.charFont.Size ? Hsm.charFont : gdi.Font(CHAR_FONT_NAME, size);
    let tempBmp = gdi.CreateImage(size, size);
    let tempGr = tempBmp.GetGraphics();
    tempGr.SetTextRenderingHint(4);
    tempGr.DrawString(chr, FONT, colour, 0, 0, size, size, DT_VCENTER | DT_CENTER);
    tempBmp.ReleaseGraphics(tempGr);
    tempGr = null;
    return tempBmp;
  }

  // second to '00:00:00'
  static formatTime(seconds) {
    seconds = Math.round(seconds);
    return ('0' + Math.floor(seconds / 3600)).slice(-2) + ':' +
      ('0' + Math.floor((seconds % 3600) / 60)).slice(-2) + ':' +
      ('0' + (seconds % 60)).slice(-2);
  }

  static estimateLineWrap(str, font, width) {
    return Hsm.gr.EstimateLineWrap(str, font, width).filter((value, index) => !(index & 1));
  }

  static blendColours(c1, c2, ratio) {
    return (((c1 & 0xFF0000) * (1 - ratio) + (c2 & 0xFF0000) * ratio) & 0xFF0000) +
      (((c1 & 0xFF00) * (1 - ratio) + (c2 & 0xFF00) * ratio) & 0xFF00) +
      ((c1 & 0xFF) * (1 - ratio) + (c2 & 0xFF) * ratio) + 0xFF000000;
  }

  static drawImage(gr, img, x, y, w, h, mode) {
    if (!gr || !img) return;

    let dx = x;
    let dy = y;
    let dw = w;
    let dh = h;
    let sx = 0;
    let sy = 0;
    let sw = img.Width;
    let sh = img.Height;

    switch (mode) {
      case DI_KEEP_ASPECT:
        const S_RATIO = sw / sh;
        const D_RATIO = dw / dh;
        if (S_RATIO > D_RATIO) {
          dh *= D_RATIO / S_RATIO;
          dy += (h - dh) / 2;
        } else if (S_RATIO < D_RATIO) {
          dw *= S_RATIO / D_RATIO;
          dx += (w - dw) / 2;
        }
        break;
    }
    gr.DrawImage(img, dx, dy, dw, dh, sx, sy, sw, sh, 0, 255);
  }

  static showTooltip() {
    if (!Hsm.tooltip) {
      Hsm.tooltip = window.CreateTooltip('Segoe UI', 13);
      Hsm.tooltip.SetMaxWidth(1200);
    }
    if (Hsm.tooltip.Text != Hsm.tooltipText) {
      Hsm.tooltip.Text = Hsm.tooltipText;
      Hsm.tooltip.Activate();
    }
  }
}
Hsm.init();

class HsmProp {
  constructor(prop, value) {
    this.prop = 'HSM: ' + prop;
    this.v = window.GetProperty(this.prop, value);
  }

  get value() {
    return this.v;
  }

  set value(value) {
    this.v = value;
    window.SetProperty(this.prop, value);
  }

  toggle() {
    this.v = !this.v;
    window.SetProperty(this.prop, this.v);
  }
}

class HsmControl {
  constructor(panel, dock = DOCK_FILL, rect = {}, margin = {}, padding = {}) {
    this.panel = panel;
    this.dock = dock;

    this.x = rect.x || 0;
    this.y = rect.y || 0;
    this.w = rect.w || 0;
    this.h = rect.h || 0;

    this.mx = 0;
    this.my = 0;
    this.drag = false;

    this.m = {
      left: margin.all || margin.left || 0,
      top: margin.all || margin.top || 0,
      right: margin.all || margin.right || 0,
      bottom: margin.all || margin.bottom || 0,
      all: margin.all || 0
    }
    this.p = {
      right: padding.right || 0,
      bottom: padding.bottom || 0
    }
  }

  size() {}

  trace() {
    const m = this.drag ? DRAG_MARGIN : 0;
    return Hsm.mx >= this.x - m && Hsm.mx <= this.x + this.w + m &&
      Hsm.my >= this.y - m && Hsm.my <= this.y + this.h + m;
  }

  update() {
    window.RepaintRect(this.x, this.y, this.w, this.h);
  }
}

class HsmScrollBar {
  constructor(parent, size = 8) {
    this.parent = parent;
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.w = size;
    this.barH = 0;
    this.barY = 0;
    this.drag = false;

    this.offset = 0;
    this.rows = 0;
    this.rowsPage = 0;
    this.rowHeight = 0;
    this.rowsInWindow = 0;
  }

  scroll(step, flat = false) {
    if (this.rowsPage >= this.rows) return;

    const OFFSET = this.offset;
    this.offset = flat ? step : this.offset - step;
    this.offset = this.offset < 0 ? 0 :
      (this.offset > this.rows - this.rowsPage ? this.rows - this.rowsPage : this.offset);
    this.setRowsInWindow();
    OFFSET == this.offset || this.parent.update();
  }

  setRows(rows) {
    this.offset = 0;
    this.rows = rows;
    this.rowsPage = Math.floor(this.h / this.rowHeight);
    this.barH = this.h * this.rowsPage / this.rows;
    this.setRowsInWindow();
  }

  setRowsInWindow() {
    this.rowsInWindow = Math.min(this.rowsPage, this.rows - this.offset);
    this.barY = this.y + (this.h - this.barH) / (this.rows - this.rowsPage) * this.offset;
  }

  trace() {
    const m = this.drag ? DRAG_MARGIN : 5;
    return Hsm.mx >= this.x - m && Hsm.mx <= this.x + this.w + m &&
      Hsm.my >= this.y - m && Hsm.my <= this.y + this.h + m;
  }

  //

  wheel(step) {
    return this.scroll(step * 3);
  }

  key_down(vkey) {
    const STEP = new Map([
      [VK_UP, 3],
      [VK_DOWN, -3],
      [VK_PGUP, this.rowsPage],
      [VK_PGDN, -this.rowsPage]
    ]).get(vkey);
    if (!STEP) return false;

    this.scroll(STEP);
    return true;
  }

  paint(gr) {
    if (this.rows > this.rowsPage) {
      gr.FillSolidRect(this.x, this.barY, this.w, this.barH, this.parent.panel.colours.disabled);
    }
  }

  size() {
    this.x = this.parent.x + this.parent.w - this.w;
    this.y = this.parent.y;
    this.h = this.parent.h;
  }

  move() {
    if (!this.trace()) {
      this.drag = false;
      return false;
    }
    if (this.drag)
      this.scroll(Math.round((Hsm.my - this.y - this.barH / 2) *
        (this.rows - this.rowsPage) / (this.h - this.barH)), true);
    return true;
  }

  lbtn_down() {
    if (this.rowsPage >= this.rows) return;
    this.drag = true;
    this.move();
  }

  lbtn_up() {
    this.drag = false;
  }

  leave() {
    this.drag = false;
  }
}