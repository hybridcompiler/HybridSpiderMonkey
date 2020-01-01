'use strict';

const DT_EXPANDTABS = 0x00000040;

const DOCK_FIX = 0,
    DOCK_LEFT = 1,
    DOCK_TOP = 2,
    DOCK_RIGHT = 4,
    DOCK_BOTTOM = 8,
    DOCK_SQUARE = 16,
    DOCK_FILL = DOCK_LEFT + DOCK_TOP;

const ICON_FONT_NAME = 'Font Awesome 5 Free Solid';
const ICON_FONT = gdi.Font(ICON_FONT_NAME, 48);

tooltip = window.CreateTooltip('Segoe UI', _scale(10));
tooltip.SetMaxWidth(1200);

class HsmControl {
    constructor(panel, dock = DOCK_FILL, pos = {}, margin = {}) {
        this.panel = panel;
        this.dock = dock;

        this.x = pos.x || 0;
        this.y = pos.y || 0;
        this.w = pos.w || 0;
        this.h = pos.h || 0;

        this.m = {
            left: margin.all || margin.left || 0,
            top: margin.all || margin.top || 0,
            right: margin.all || margin.right || 0,
            bottom: margin.all || margin.bottom || 0,
            all: margin.all || 0
        }
    }

    size() {}

    trace(x, y) {
        return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }
}

class Hsm {
    static chrToImg(chr, colour, size = ICON_FONT.Size) {
        if (size < 1) return;
        const FONT = size == ICON_FONT.Size ? ICON_FONT : gdi.Font(ICON_FONT_NAME, size);
        let tempBmp = gdi.CreateImage(size, size);
        let tempGr = tempBmp.GetGraphics();

        tempGr.SetTextRenderingHint(4);
        tempGr.DrawString(chr, FONT, colour, 0, 0, size, size, SF_CENTRE);
        tempBmp.ReleaseGraphics(tempGr);
        tempGr = null;
        return tempBmp;
    }

    // second to '00:00:00'
    static formatTime(seconds) {
        seconds = Math.round(seconds);
        const H = Math.floor(seconds / 3600);
        const M = Math.floor((seconds % 3600) / 60);
        return ('0'+H).slice(-2) + ':' + ('0'+M).slice(-2) + ':' + ('0'+(seconds % 60)).slice(-2);
    }

    static EstimateLineWrap(gr, str, font, width) {
        return gr.EstimateLineWrap(str, font, width).filter((value, index) => {
            return !(index & 1);
        });
    }
}