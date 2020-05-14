/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

class HsmText extends HsmControl {
  constructor(panel, dock, rect = {}, margin = {}) {
    super(panel, dock, rect, margin);

    this.text = '';
    this.texts = [];
    this.scrollBar = new HsmScrollBar(this);

    this.font_changed();
  }

  setText(text) {
    this.text = text || this.text;
    if (!this.text || this.h <= 0) return;

    this.texts = Hsm.estimateLineWrap(this.text, this.panel.fonts.normal, this.w);
    this.scrollBar.setRows(this.texts.length);
  }

  //

  metadb_changed() {
    this.setText(HsmDb.getMetaValue(this.panel.prop.trackInfoType.value == "Vertical" ?
      HsmDb.getTrackFormat() : TITLE_FORMATS.horizontal));
  }

  wheel(step) {
    this.scrollBar.wheel(step);
  }

  key_down(vkey) {
    return this.scrollBar.key_down(vkey);
  }

  move() {
    this.scrollBar.move();
  }

  lbtn_down() {
    this.scrollBar.lbtn_down();
  }

  lbtn_up() {
    this.scrollBar.lbtn_up();
  }

  leave() {
    this.scrollBar.leave();
  }

  paint(gr) {
    if (!this.text) return;
    this.scrollBar.paint(gr);

    const SB = this.scrollBar;
    for (let i = 0, y = this.y; i < SB.rowsInWindow; i++, y += SB.rowHeight)
      gr.GdiDrawText(this.texts[i + SB.offset], this.panel.fonts.normal,
        this.panel.colours.text, this.x, y, this.w, SB.rowHeight, DT_EXPANDTABS | DT_NOPREFIX);
  }

  size() {
    this.scrollBar.size();
    this.setText();
  }

  font_changed() {
    this.scrollBar.rowHeight = this.panel.fonts.normal.Height * this.panel.prop.lineSpacing.value;
    this.setText();
  }
}