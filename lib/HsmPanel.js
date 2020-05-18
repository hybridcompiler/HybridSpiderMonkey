'use strict';
include('Hsm.js');
include('HsmDb.js');

// move callback

function on_mouse_move(x, y) {
  Hsm.mx = x;
  Hsm.my = y;
  Hsm.drag = false;

  Hsm.tooltipText = '';
  HsmPanel.global.sendMoveCallback();
  Hsm.showTooltip();
}

// mouse callback

function on_mouse_lbtn_dblclk(x, y) {
  HsmPanel.global.sendMouseCallback('lbtn_dblclk');
}

function on_mouse_lbtn_up(x, y) {
  HsmPanel.global.sendMouseCallback('lbtn_up');
}

function on_mouse_lbtn_down(x, y) {
  HsmPanel.global.sendMouseCallback('lbtn_down');
}

function on_mouse_wheel(step) {
  HsmPanel.global.wheel(step) || HsmPanel.global.sendMouseCallback('wheel', step);
}

// key callback

function on_key_down(vkey) {
  HsmPanel.global.sendKeyCallback('key_down', vkey);
}

// GUI callback

function on_paint(gr) {
  HsmPanel.global.paint(gr);
  HsmPanel.global.sendCallback('paint', false, gr);
}

function on_size(width, height) {
  HsmPanel.global.size(width, height);
}

class HsmPanel extends HsmControl {
  constructor(margin = {}) {
    super(null, HsmDock.fill, {}, margin);
    if (HsmPanel.global) throw "HsmPanel already exists";
    HsmPanel.global = this;

    this.fonts = {};
    this.colours = {};
    this.controls = [];

    this.prop = {
      fonts: {
        extraSize: new HsmProp('FONTS.EXTRASIZE', 0),
        titleSize: new HsmProp('FONTS.TITLESIZE', 3),
        maxSize: 20
      },
      colours: {
        background: new HsmProp('COLOURS.BACKGROUND'),
        text: new HsmProp('COLOURS.TEXT'),
        highlight: new HsmProp('COLOURS.HIGHLIGHT')
      },
      margin: new HsmProp('MARGIN', 8),
      //lineSpacing: new HsmProp('LINESPACING', 1.2),
      trackInfoType: new HsmProp('TRACKINFO', 'Vertical')
    };

    this.colours_changed();
    this.font_changed();
  }

  // callback

  colours_changed() {
    this.colours.background = getColor(this.prop.colours.background, 1, 3);
    this.colours.text = getColor(this.prop.colours.text, 0, 0);
    this.colours.highlight = getColor(this.prop.colours.highlight, 2, 0);
    this.colours.disabled = Hsm.blendColours(this.colours.text, this.colours.background, 0.7);

    function getColor(colorProp, colorDUI, colorCUI) {
      return colorProp.value > 0 ? colorProp.value :
        (window.InstanceType ? window.GetColourDUI(colorDUI) : window.GetColourCUI(colorCUI));
    }
  }

  font_changed() {
    const FONT = window.InstanceType ? window.GetFontDUI(0) : window.GetFontCUI(0);
    const NAME = FONT ? FONT.Name : 'Segoe UI';
    const SIZE = FONT.Size + (typeof this.prop.fonts.extraSize.value == 'number' ?
      this.prop.fonts.extraSize.value : 0);
    this.fonts.normal = gdi.Font(NAME, SIZE);
    this.fonts.title = gdi.Font(NAME, SIZE + (typeof this.prop.fonts.titleSize.value == 'number' ?
      this.prop.fonts.titleSize.value : 3), 1);
  };

  wheel(step) {
    if (!utils.IsKeyPressed(VK_CONTROL)) return false;
    const SIZE = (typeof this.prop.fonts.extraSize.value == 'number' ?
      this.prop.fonts.extraSize.value : 0) + step;
    if (SIZE < 0 || SIZE > this.prop.fonts.maxSize) return true;

    this.prop.fonts.extraSize.value = SIZE;
    on_font_changed();
    return true;
  }

  paint(gr) {
    gr.FillSolidRect(0, 0, this.w, this.h, this.colours.background);
  }

  size(width, height) {
    this.w = width;
    this.h = height;

    this.px = this.x;
    this.py = this.y;
    this.pw = this.w;
    this.ph = this.h;

    this.sizeControls();
  }

  //

  init(controls) {
    this.controls = controls;
    !HSM['on_selection_changed'] || on_selection_changed();
  }

  sizeControls() {
    for (const CONTROL of this.controls) {
      const DOCK = CONTROL.dock;
      if (DOCK == HsmDock.fix) continue;

      if (DOCK == HsmDock.fill) {
        CONTROL.x = this.px + CONTROL.m.left;
        CONTROL.y = this.py + CONTROL.m.top;
        CONTROL.w = this.pw - CONTROL.m.left - CONTROL.m.right - CONTROL.p.right;
        CONTROL.h = this.ph - CONTROL.m.top - CONTROL.m.bottom - CONTROL.p.bottom;
        if (CONTROL.p.right) {
          this.px += this.pw - CONTROL.p.right;
          this.pw = CONTROL.p.right;
        } else if (CONTROL.p.bottom) {
          this.py += this.ph - CONTROL.p.bottom;
          this.ph = CONTROL.p.bottom;
        }
      } else if (DOCK & (HsmDock.left + HsmDock.right)) {
        CONTROL.y = this.py + CONTROL.m.top;
        CONTROL.h = this.ph - CONTROL.m.top - CONTROL.m.bottom;
        if (DOCK & HsmDock.square) CONTROL.w = CONTROL.h;

        const CONTROL_W = CONTROL.w + CONTROL.m.left + CONTROL.m.right;
        this.pw -= CONTROL_W;
        if (DOCK & HsmDock.left) {
          CONTROL.x = this.px + CONTROL.m.left;
          this.px += CONTROL_W;
        } else {
          CONTROL.x = this.px + this.pw + CONTROL.m.right;
        }
      } else if (DOCK & (HsmDock.top + HsmDock.bottom)) {
        CONTROL.x = this.px + CONTROL.m.left;
        CONTROL.w = this.pw - CONTROL.m.left - CONTROL.m.right;
        if (DOCK & HsmDock.square) CONTROL.h = CONTROL.w;

        const CONTROL_H = CONTROL.h + CONTROL.m.top + CONTROL.m.bottom;
        this.ph -= CONTROL_H;
        if (DOCK & HsmDock.top) {
          CONTROL.y = this.py + CONTROL.m.top;
          this.py += CONTROL_H;
        } else {
          CONTROL.y = this.py + this.ph + CONTROL.m.bottom;
        }
      }
      CONTROL.size();
    }
  }

  sendCallback(message, repaint = false, gr) {
    for (const CONTROL of this.controls) !CONTROL[message] || CONTROL[message](gr);
    !HSM[message] || HSM[message](gr);
    !repaint || window.Repaint();
  }

  sendMoveCallback() {
    let moveFinished = false;
    for (const CONTROL of this.controls) {
      if (!moveFinished && CONTROL.trace()) {
        moveFinished = true;
        !CONTROL['move'] || CONTROL['move']();
        continue;
      }!CONTROL['leave'] || CONTROL['leave']();
    }!HSM['move'] || HSM['move']();
  }

  sendMouseCallback(message, x, y) {
    for (const CONTROL of this.controls) {
      if (CONTROL.trace()) {
        !CONTROL[message] || CONTROL[message](x, y);
        return;
      }
    }!HSM[message] || HSM[message](x, y);
  }

  sendKeyCallback(message, x, y) {
    for (const CONTROL of this.controls) {
      if (CONTROL[message] && CONTROL[message](x, y)) return;
    }!HSM[message] || HSM[message](x, y);
  }
}