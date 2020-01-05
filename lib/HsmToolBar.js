/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

class HsmButton {
  constructor(x, y, w, h, fn, text, img, color, imgHover, colorHover) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fn = fn;
    this.text = text;
    this.hover = false;

    if (typeof img == 'string') {
      color = color || HsmPanel.global.colours.text;
      colorHover = colorHover || HsmPanel.global.colours.highlight;
      this.imgNormal = Hsm.chrToImg(img, color, h);
      this.imgHover = !imgHover ? Hsm.chrToImg(img, colorHover, h) :
        typeof imgHover == 'string' ? Hsm.chrToImg(imgHover, colorHover, h) : imgHover;
    } else {
      this.imgNormal = img;
      this.imgHover = imgHover || img;
    }
    this.img = this.imgNormal;
  }

  size() {}

  paint(gr) {
    !this.img || Hsm.drawImage(gr, this.img, this.x, this.y, this.w, this.h);
  }

  trace() {
    return Hsm.mx >= this.x && Hsm.mx <= this.x + this.w && Hsm.my >= this.y && Hsm.my <= this.y + this.h;
  }

  move() {
    const HOVER = this.trace();
    if (HOVER) Hsm.tooltipText = this.text;
    if (this.hover == HOVER) return HOVER;

    this.hover = HOVER;
    this.img = HOVER ? this.imgHover : this.imgNormal;
    window.RepaintRect(this.x, this.y, this.w, this.h);
    return HOVER;
  }

  lbtn_up() {
    if (this.trace() && this.fn) {
      this.fn(Hsm.mx, Hsm.my);
      return true;
    }
    return false;
  }
}

// size, color, colorHover :  w, fn, text, img, imgHover

class HsmToolbar extends HsmControl {
  constructor(panel, dock = DOCK_FILL, size = 16, color, colorHover, buttons = [],
    rect = {}, margin = {}) {
    super(panel, dock, rect, margin);
    this.s = size;
    this.h = this.h || size;

    this.w = 0;
    this.hoverButton = null;
    this.buttons = [];
    for (let i = 0, len = buttons.length; i < len; i++) {
      const BUTTON = buttons[i];
      this.buttons[i] = new HsmButton(0, 0, BUTTON[0] || size, size,
        BUTTON[1], BUTTON[2], BUTTON[3], color, BUTTON[4], colorHover);
      this.w += this.buttons[i].w + this.s;
    }
  }

  setButton(buttonId, button) {
    this.buttons[buttonId] = button;
    this.size();
    this.update();
  }

  size() {
    const Y = this.y + (this.h - this.s) / 2;
    let x = this.x;
    for (const BUTTON of this.buttons) {
      BUTTON.x = x;
      BUTTON.y = Y;
      x += BUTTON.w + this.s;
    }
  }

  paint(gr) {
    for (const BUTTON of this.buttons) BUTTON.paint(gr);
  }

  move() {
    this.hoverButton = null;
    for (const BUTTON of this.buttons) {
      if (BUTTON.move()) this.hoverButton = BUTTON;
    }
  }

  leave() {
    if (this.hoverButton) {
      this.hoverButton.move();
      this.hoverButton = null;
    }
  }

  lbtn_up() {
    for (const BUTTON of this.buttons) {
      if (BUTTON.lbtn_up()) return;
    }
  }
}