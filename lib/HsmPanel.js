'use strict';
window.DlgCode = DLGC_WANTALLKEYS;

const UNUSED = -1;

class HsmPanel extends HsmControl {
    constructor(panel, dock = DOCK_FILL, pos = {}, margin = {}) {
        super(panel, dock, pos, margin);

        this.px = 0;
        this.py = 0;
        this.pw = 0;
        this.ph = 0;

        this.metadb = fb.GetFocusItem();
        this.prevPath = '';

        this.fonts = {};
        this.colours = {};
        this.controls = [];

        this.prop = {
            fonts: {
                normal: new _p('HSM.FONTS.SIZE', UNUSED),
                title: new _p('HSM.FONTS.TITLESIZE', UNUSED),
            },
            colours: {
                background: new _p('HSM.COLOURS.BACKGROUND', UNUSED),
                text: new _p('HSM.COLOURS.TEXT', UNUSED),
                highlight: new _p('HSM.COLOURS.HIGHLIGHT', UNUSED),
                title: new _p('HSM.COLOURS.TITLE', UNUSED)
            },
            margin: new _p('HSM.MARGIN', 8),
            lineSpacing: new _p('HSM.LINESPACING', 1.2)
        };

        this.colours_changed();
        this.font_changed();
    }

    // callback

    selection_changed() {
        this.metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
        if (!this.metadb || this.prevPath == this.metadb.Path) return false;
        this.prevPath = this.metadb.Path;
        return true;
    }

    playback_new_track(metadb) {
        this.metadb = metadb;
    }

    colours_changed() {
        this.colours.background = this.getColor(this.prop.colours.background, 1, 3);
        this.colours.text = this.getColor(this.prop.colours.text, 0, 0);
        this.colours.highlight = this.getColor(this.prop.colours.highlight, 2, 0);
        this.colours.title = this.getColor(this.prop.colours.title, 0, 0);
    }

    font_changed() {
        const FONT = window.InstanceType ? window.GetFontDUI(0) : window.GetFontCUI(0);
        const NAME = FONT ? FONT.Name : 'Segoe UI';
        const SIZE = this.prop.fonts.normal.value != UNUSED ? _scale(this.prop.fonts.normal.value) : FONT.Size;
        this.fonts.normal = gdi.Font(NAME, SIZE);
        this.fonts.title = gdi.Font(NAME,
            this.prop.fonts.title.value != UNUSED ? _scale(this.prop.fonts.title.value) : SIZE + 2, 1);
    };

    paint(gr) {
        gr.FillSolidRect(0, 0, this.w, this.h, this.colours.background);
        _.invokeMap(this.controls, 'paint', gr);
    }

    size() {
        this.px = 0;
        this.py = 0;
        this.pw = window.Width;
        this.ph = window.Height;
        this.x = this.px;
        this.y = this.py;
        this.w = this.pw;
        this.h = this.ph;
        this.sizeControls();
    }

    //

    sizeControls() {
        for (let i = 0; i < this.controls.length; i++) {
            const CONTROL = this.controls[i];
            const DOCK = CONTROL.dock;
            if (DOCK == DOCK_FIX) continue;
            if (DOCK == DOCK_FILL) {
                CONTROL.x = this.px + CONTROL.m.left;
                CONTROL.y = this.py + CONTROL.m.top;
                CONTROL.w = this.pw - CONTROL.m.left - CONTROL.m.right;
                CONTROL.h = this.ph - CONTROL.m.top - CONTROL.m.bottom;
            } else if (DOCK & (DOCK_LEFT + DOCK_RIGHT)) {
                CONTROL.y = this.py + CONTROL.m.top;
                CONTROL.h = this.ph - CONTROL.m.top - CONTROL.m.bottom;
                if (DOCK & DOCK_SQUARE) CONTROL.w = CONTROL.h;

                const CONTROL_W = CONTROL.w + CONTROL.m.left + CONTROL.m.right;
                this.pw -= CONTROL_W;
                if (DOCK & DOCK_LEFT) {
                    CONTROL.x = this.px + CONTROL.m.left;
                    this.px += CONTROL_W;
                } else {
                    CONTROL.x = this.px + this.pw + CONTROL.m.right;
                }
            } else if (DOCK & (DOCK_TOP + DOCK_BOTTOM)) {
                CONTROL.x = this.px + CONTROL.m.left;
                CONTROL.w = this.pw - CONTROL.m.left - CONTROL.m.right;
                if (DOCK & DOCK_SQUARE) CONTROL.h = CONTROL.w;

                const CONTROL_H = CONTROL.h + CONTROL.m.top + CONTROL.m.bottom;
                this.ph -= CONTROL_H;
                if (DOCK & DOCK_TOP) {
                    CONTROL.y = this.py + CONTROL.m.top;
                    this.py += CONTROL_H;
                } else {
                    CONTROL.y = this.py + this.ph + CONTROL.m.bottom;
                }
            }
            CONTROL.size();
        }
    }

    getColor(colorProp, colorDUI, colorCUI) {
        return colorProp.value != UNUSED ? colorProp.value :
            (window.InstanceType ? window.GetColourDUI(colorDUI) : window.GetColourCUI(colorCUI));
    }

    isStreaming() {
        return this.metadb.FileSize < 1;
    }

    getMetaValue(meta) {
        return fb.IsPlaying ? meta.Eval() : meta.EvalWithMetadb(this.metadb);
    }
}