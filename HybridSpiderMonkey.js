'use strict';
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');

include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\Hsm.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmPanel.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmImage.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmText.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmMediaControl.js');

let metaSources = {
    default: fb.TitleFormat('[Title$tab() %Title%$crlf()]\
[Artist$tab() %Artist%$crlf()]\
[Album$tab() %Album%$crlf()]\
[Genre$tab() %Genre%$crlf()]\
[$if(%Length%,,Path$tab() %Path%$crlf())]\
[Date$tab() %Date%$crlf()]\
[$crlf()%ALBUMDESCRIPTION%$]'),

    saycast: fb.TitleFormat('$if(%playback_time%,[Title$tab() %Artist%$crlf()][Artist$tab() %Title%$crlf()])\
[Path$tab() %Path%]'),
    saycastUrl: 'saycast.com'
};

let panel = new HsmPanel(),
    metaImage = new HsmImage(panel, DOCK_LEFT | DOCK_SQUARE),
    mediaControl = new HsmMediaControl(panel, DOCK_BOTTOM, 16, {
        all: panel.prop.margin.value
    }),
    infoText = new HsmText(panel, DOCK_FILL, {}, {
        left: panel.prop.margin.value,
        top: panel.prop.margin.value,
        right: panel.prop.margin.value
    });
panel.controls = [metaImage, mediaControl, infoText];

on_selection_changed();

function getMetaValues() {
    return !panel.metadb ? null : panel.isStreaming() & panel.metadb.Path.includes(metaSources.saycastUrl) ?
        panel.getMetaValue(metaSources.saycast) : panel.getMetaValue(metaSources.default);
}

// window callback

function on_mouse_lbtn_dblclk(x, y) {
    fb.RunMainMenuCommand('View/Show now playing in playlist');
}

function on_mouse_lbtn_up(x, y) {
    mediaControl.lbtn_up(x, y);
}

function on_mouse_lbtn_down(x, y) {
    mediaControl.lbtn_down(x, y);
}

function on_mouse_move(x, y) {
    mediaControl.move(x, y) || infoText.move(x, y);
}

function on_mouse_wheel(s) {
    if (mediaControl.wheel(s)) return;
    if (infoText.wheel(s)) window.Repaint();
}

function on_key_down(vkey) {
    if (infoText.key_down(vkey)) window.Repaint();
}

function on_paint(gr) {
    panel.paint(gr);
}

function on_size() {
    panel.size();
    window.Repaint();
}

// metadb changed callback

function on_metadb_changed() {
    if (!panel.metadb) return;
    metaImage.img = utils.GetAlbumArtV2(panel.metadb, 0);
    infoText.update(getMetaValues());
    mediaControl.metadb_changed();
    window.Repaint();
}

function on_selection_changed() {
    if (panel.selection_changed()) on_metadb_changed();
}

function on_playback_new_track(metadb) {
    panel.playback_new_track(metadb);
    on_metadb_changed();
}

function on_playback_dynamic_info_track() {
    on_metadb_changed();
}

// playback callback

function on_playback_stop() {
    mediaControl.playback_stop();
}

function on_playback_starting() {
    mediaControl.playback_starting();
}

function on_playback_pause() {
    mediaControl.playback_pause();
}

function on_playback_time(time) {
    mediaControl.playback_time(time);
}

// colours & font callback

function on_colours_changed() {
    panel.colours_changed();
    mediaControl.colours_changed();
    window.Repaint();
}

function on_font_changed() {
    panel.font_changed();
    infoText.font_changed();
    window.Repaint();
}