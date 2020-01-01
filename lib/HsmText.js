'use strict';

class HsmText extends HsmControl {
    constructor(panel, dock, pos = {}, margin = {}) {
        super(panel, dock, pos, margin);

        this.mx = 0;
        this.my = 0;

        this.barX = 0;
        this.barY = 0;
        this.barW = 8;
        this.barH = 0;

        this.offset = 0;
        this.rows = 0;
        this.rowsInWindow = 0;
        this.rowHeight = 0;
        this.text = null;
        this.texts = [];

        this.font_changed();
    }

    update(text) {
        this.texts = [];
        this.text = text;
    }

    move(x, y) {
        this.mx = x;
        this.my = y;
    }

    wheel(s) {
        if (this.trace(this.mx, this.my)) {
            if (this.rowsInWindow >= this.rows) return;
            this.offset -= s * 3;
            this.offset = this.offset < 0 ? 0 :
                (this.offset > this.rows - this.rowsInWindow ? this.rows - this.rowsInWindow : this.offset);
            return true;
        }
        return false;
    }

    key_down(vkey) {
        switch (vkey) {
            case VK_UP:
                this.wheel(1);
                return true;
            case VK_DOWN:
                this.wheel(-1);
                return true;
        }
        return false;
    }

    paint(gr) {
        if (this.text) {
            if (this.texts.length == 0) {
                this.offset = 0;
                this.texts = Hsm.EstimateLineWrap(gr, this.text, this.panel.fonts.normal, this.w);
                this.rows = this.texts.length;
                this.rowsInWindow = Math.floor(this.h / this.rowHeight);
            }
            // scroll bar
            if (this.rows > this.rowsInWindow) {
                this.barH = this.h * this.rowsInWindow / this.rows;
                this.barY = this.y + (this.h - this.barH) / (this.rows - this.rowsInWindow) * this.offset;
                gr.FillSolidRect(this.barX, this.barY, this.barW, this.barH,
                    _blendColours(this.panel.colours.text, this.panel.colours.background, 0.7));
            }
            const LENGTH = Math.min(this.rowsInWindow, this.rows - this.offset);
            for (let i = 0, y = this.y; i < LENGTH; i++, y += this.rowHeight) {
                gr.GdiDrawText(this.texts[i + this.offset], this.panel.fonts.normal,
                    this.panel.colours.text, this.x, y, this.w, this.rowHeight, DT_EXPANDTABS);
            }
        }
    }

    size() {
        this.texts = [];
        this.barX = this.x + this.w - this.barW;
    }

    font_changed() {
        this.texts = [];
        this.rowHeight = this.panel.fonts.normal.Height * this.panel.prop.lineSpacing.value;
    }
}