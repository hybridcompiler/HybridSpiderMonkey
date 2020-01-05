/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

function on_playback_time(time) {
  !HsmMediaTrackBar.global || HsmMediaTrackBar.global.playback_time();
  !HSM['playback_time'] || playback_time();
}

function on_playback_stop() {
  !HsmMediaTrackBar.global || HsmMediaTrackBar.global.playback_time();
  !HSM['playback_stop'] || playback_stop();
}

function on_playback_starting() {
  !HSM['playback_starting'] || playback_starting();
}

function on_playback_pause(state) {
  !HSM['playback_pause'] || playback_pause(state);
}

function on_volume_change(val) {
  !HsmVolume.global || HsmVolume.global.volume_change(val);
  !HSM['volume_change'] || volume_change(val);
}

class HsmTrackBar extends HsmControl {
  constructor(panel, dock = DOCK_FILL, pos = 0, thick = 6, color, backgroundColor,
    rect = {}, margin = {}) {
    super(panel, dock, rect, margin);
    this.pos = pos;
    this.s = thick;
    this.color = color || this.panel.colours.highlight;
    this.backgroundColor = backgroundColor || this.panel.colours.disabled;
  }

  paint(gr) {
    const Y = this.y + (this.h - this.s) / 2;
    gr.FillSolidRect(this.x, Y, this.w, this.s, this.backgroundColor);
    !this.pos || gr.FillSolidRect(this.x, Y, this.pos, this.s, this.color);
  }

  move() {
    if (!this.trace()) {
      this.drag = false;
      return false;
    }
    const POS = (Hsm.mx - this.x) / this.w
    return POS < 0 ? 0 : POS > this.w ? 0 : POS;
  }

  lbtn_down() {
    this.drag = true;
    return this.move();
  }

  lbtn_up() {
    this.drag = false;
  }

  leave() {
    this.drag = false;
  }
}

class HsmMediaTrackBar extends HsmControl {
  constructor(panel, dock = DOCK_FILL, thick = 6, color, backgroundColor,
    rect = {}, margin = {}) {
    super(panel, dock, rect, margin);
    if (HsmMediaTrackBar.global) throw "HsmMediaTrackBar already exists";
    HsmMediaTrackBar.global = this;

    // playback time

    this.playtime = {
      w: 120,
      font: gdi.Font('Arial', 12),
      length: '00:00:00'
    };
    this.playtime.h = this.playtime.font.Height;
    this.h = this.h || this.playtime.h;

    this.trackBar = new HsmTrackBar(panel, DOCK_FILL, 0, thick, color, backgroundColor);
  }

  pos() {
    this.trackBar.pos = fb.PlaybackLength > 0 ?
      Math.ceil(this.trackBar.w * fb.PlaybackTime / fb.PlaybackLength) : 0;
  }

  seek(trackBarFunc) {
    if (fb.PlaybackLength <= 0) return;
    const POS = trackBarFunc();
    if (!POS) return;

    Hsm.tooltipText = utils.FormatDuration(POS * fb.PlaybackLength);
    if (!this.trackBar.drag) return;
    fb.PlaybackTime = POS * fb.PlaybackLength;
    this.playback_time();
  }

  //

  paint(gr) {
    gr.GdiDrawText(Hsm.formatTime(fb.PlaybackTime) + '  /  ' + this.playtime.length,
      this.playtime.font, this.panel.colours.text,
      this.playtime.x, this.playtime.y, this.playtime.w, this.playtime.h, 0);
    this.trackBar.paint(gr);
  }

  size() {
    this.playtime.x = this.x;
    this.playtime.y = this.y + (this.h - this.playtime.h) / 2;

    this.trackBar.x = this.playtime.x + this.playtime.w;
    this.trackBar.w = this.w - this.playtime.w;
    this.trackBar.y = this.y;
    this.trackBar.h = this.h;
    this.pos();
  }

  wheel(step) {
    if (!this.trackBar.trace()) return;
    const LENGTH = fb.PlaybackLength;
    if (!fb.IsPlaying || LENGTH <= 0) return;

    fb.PlaybackTime += step * (LENGTH < 60 ? 5 : (LENGTH < 600 ? 10 : 60));
    this.playback_time();
  }

  move() {
    this.seek(() => this.trackBar.move());
  }

  lbtn_down() {
    this.seek(() => this.trackBar.lbtn_down());
  }

  lbtn_up() {
    this.trackBar.lbtn_up();
  }

  leave() {
    this.trackBar.leave();
  }

  playback_time() {
    this.pos();
    this.update();
  }

  // playback callback

  metadb_changed() {
    this.playtime.length = HsmDb.isFile() ? Hsm.formatTime(HsmDb.metadb.Length) : '00:00:00';
  }
}

class HsmVolume extends HsmControl {
  constructor(panel, dock = DOCK_FILL, thick = 6, size = 16, color, backgroundColor,
    rect = {}, margin = {}) {
    super(panel, dock, rect, margin);
    if (HsmVolume.global) throw "HsmVolume already exists";
    HsmVolume.global = this;

    this.trackBar = new HsmTrackBar(panel, DOCK_FILL, 0, thick, color, backgroundColor);

    this.volumeOnButton = new HsmButton(0, 0, size, size,
      () => fb.VolumeMute(), 'Volume-off', '\uF028');
    this.volumeOffButton = new HsmButton(0, 0, size, size,
      () => fb.VolumeMute(), 'Volume-on', '\uF6A9');
  }

  volumeChange() {
    this.button = fb.Volume > -100 ? this.volumeOnButton : this.volumeOffButton;
    this.trackBar.pos = Math.ceil(this.trackBar.w * Math.pow(2, fb.Volume / 10));
  }

  seek(trackBarFunc) {
    const POS = trackBarFunc();
    if (!POS) return;

    const VOL = Math.max(-100, 10 * Math.log(POS) / Math.LN2);
    Hsm.tooltipText = VOL.toFixed(1) + 'dB';
    if (!this.trackBar.drag) return;
    fb.Volume = VOL;
    this.volume_change();
  }

  paint(gr) {
    this.button.paint(gr);
    this.trackBar.paint(gr);
  }

  size() {
    this.volumeOnButton.x = this.x;
    this.volumeOnButton.y = this.y + (this.h - this.volumeOnButton.h) / 2;
    this.volumeOffButton.x = this.x;
    this.volumeOffButton.y = this.volumeOnButton.y;

    this.trackBar.x = this.x + this.volumeOnButton.w + 4;
    this.trackBar.w = this.w - this.volumeOnButton.w - 4;
    this.trackBar.y = this.y;
    this.trackBar.h = this.h;
    this.volumeChange();
  }

  wheel(step) {
    if (!this.trackBar.trace()) return;
    if (step == 1) {
      fb.VolumeUp();
      return;
    }
    fb.VolumeDown();
    this.volumeChange();
  }

  move() {
    this.button.move();
    this.seek(() => this.trackBar.move());
  }

  leave() {
    if (this.button.hover) {
      this.button.move();
      this.button.hover = false;
    }
    this.trackBar.leave();
  }

  lbtn_up() {
    this.button.lbtn_up();
    this.trackBar.lbtn_up();
  }

  lbtn_down() {
    this.seek(() => this.trackBar.lbtn_down());
  }

  volume_change(val) {
    this.volumeChange();
    this.update();
  }
}