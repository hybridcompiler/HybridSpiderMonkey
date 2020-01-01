'use strict';
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');

class HsmMediaControl extends HsmControl {
    constructor(panel, dock, height, margin) {
        super(panel, dock, {
            h: height
        }, margin);
        this.padding = height;

        this.playId = 3;
        this.texts = ['Menu', 'Stop', 'Previous', 'Play', 'Next', 'Random', 'Console', 'Layout editing mode'];
        this.buttonChars = ['\u2630', '\uF04D', '\uF049', '\uF04B', '\uF050', '\uF074', '\uF120', '\uF009'];
        this.play = {
            chars: ['\uF04B', '\uF04C'],
            texts: ['Play', 'Pause']
        };
        this.funcs = [(x, y, mask) => {
            _menu(x, y);
        }, () => {
            fb.Stop();
        }, () => {
            fb.Prev();
        }, () => {
            fb.PlayOrPause();
        }, () => {
            fb.Next();
        }, () => {
            fb.Random();
        }, () => {
            fb.RunMainMenuCommand('Console');
        }, () => {
            fb.RunMainMenuCommand(window.InstanceType ? 'Enable layout editing mode' : 'Live editing');
        }];
        this.playtime = {
            x: 0,
            y: 0,
            w: 120,
            font: gdi.Font('Arial', 12),
            length: ''
        };
        this.playtime.h = this.playtime.font.Height;

        this.seekbar = new _seekbar(0, 0, 0, 6);
        this.buttons = new _buttons();
        this.buttons.w = this.texts.length * (this.h + this.padding);
    }

    lbtn_up(x, y) {
        return this.buttons.lbtn_up(x, y) || this.seekbar.lbtn_up(x, y);
    }

    lbtn_down(x, y) {
        return this.seekbar.lbtn_down(x, y);
    }

    wheel(s) {
        return this.seekbar.wheel(s);
    }

    move(x, y) {
        return this.buttons.move(x, y) || this.seekbar.move(x, y);
    }

    paint(gr) {
        this.buttons.paint(gr);

        let playtime = fb.IsPlaying ? Hsm.formatTime(fb.PlaybackTime) : '00:00:00';
        gr.GdiDrawText(playtime + '  /  ' + this.playtime.length, this.playtime.font, this.panel.colours.text,
            this.playtime.x, this.playtime.y, this.playtime.w, this.playtime.h, 0);

        gr.FillSolidRect(this.seekbar.x, this.seekbar.y, this.seekbar.w, this.seekbar.h,
            _blendColours(this.panel.colours.text, this.panel.colours.background, 0.7));

        if (fb.IsPlaying && fb.PlaybackLength > 0) {
            gr.FillSolidRect(this.seekbar.x, this.seekbar.y, this.seekbar.pos(), this.seekbar.h,
                this.panel.colours.highlight);
        }
    }

    size() {
        this.playtime.x = this.x + this.buttons.w;
        this.playtime.y = this.y;

        this.seekbar.x = this.playtime.x + this.playtime.w;
        this.seekbar.y = this.y + (this.h - this.seekbar.h) / 2;
        this.seekbar.w = this.w - this.buttons.w - this.playtime.w;

        this.update();
    }

    colours_changed() {
        this.update();
    }

    playback_stop() {
        this.updatePlayButton();
        this.repaintPlayButton();
    }

    playback_starting() {
        this.updatePlayButton();
        this.repaintPlayButton();
    }

    playback_pause() {
        this.updatePlayButton();
        this.repaintPlayButton();
    }

    playback_time(time) {
        window.RepaintRect(this.playtime.x, this.playtime.y, this.playtime.w, this.playtime.h);
    }

    metadb_changed() {
        this.playtime.length = this.panel.isStreaming() || !this.panel.metadb ? '00:00:00' :
            Hsm.formatTime(this.panel.metadb.Length);
    }

    //

    update() {
        for (let i = 0; i < this.texts.length; i++) this.updateButton(i, this.buttonChars[i], this.texts[i]);
        this.updatePlayButton();
    }

    updateButton(i, char, text) {
        this.buttons.buttons[i] = new _button(this.x + i * (this.h + this.padding), this.y, this.h, this.h, {
            hover: Hsm.chrToImg(char, this.panel.colours.highlight),
            normal: Hsm.chrToImg(char, this.panel.colours.text)
        }, this.funcs[i], text);
    }

    updatePlayButton() {
        const STATUS_ID = fb.IsPlaying && !fb.IsPaused ? 1 : 0;
        this.updateButton(this.playId, this.play.chars[STATUS_ID], this.play.texts[STATUS_ID]);
    }

    repaintPlayButton() {
        window.RepaintRect(this.x + this.playId * (this.h + this.padding), this.y, this.h, this.h);
    }
}