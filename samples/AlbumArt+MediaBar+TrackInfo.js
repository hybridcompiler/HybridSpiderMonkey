'use strict';
let libPath = fb.ComponentPath + 'HybridSpiderMonkey/lib/'
include(libPath + 'HsmCustom.js');
include(libPath + 'HsmPanel.js');
include(libPath + 'HsmImage.js');
include(libPath + 'HsmText.js');
include(libPath + 'HsmToolBar.js');
include(libPath + 'HsmTrackBar.js');

const BUTTON_SIZE = 16;

let panel = new HsmPanel(),
  albumArt = new HsmImage(panel, HsmDock.left | HsmDock.square),
  trackInfo = new HsmText(panel, HsmDock.fill),
  toolbar = new HsmToolbar(panel, HsmDock.left, BUTTON_SIZE, 0, 0, [
    //[0, (x, y, mask) => Hsm.toggleMenu(), 'Show/Hide Menu', '\u2630'],
    [0, () => fb.Stop(), 'Stop', '\uF04D'],
    [0, () => fb.Prev(), 'Previous', '\uF049'],
    [0, () => fb.PlayOrPause(), 'Play', '\uF04B'],
    [0, () => fb.Next(), 'Next', '\uF050'],
    [0, () => fb.Random(), 'Random', '\uF074'],
    [0, () => fb.RunMainMenuCommand('Console'), 'Console', '\uF120'],
    [0, () => fb.RunMainMenuCommand(window.InstanceType ?
      'Enable layout editing mode' : 'Live editing'), 'Layout Editing Mode', '\uF009'],
  ]),
  trackbar = new HsmMediaTrackBar(panel, HsmDock.fill),
  volumebar = new HsmVolume(panel, HsmDock.fill);

const PLAY_BUTTON_ID = 2;
const PLAY_BUTTON = toolbar.buttons[PLAY_BUTTON_ID];
const PAUSE_BUTTON = new HsmButton(0, 0, BUTTON_SIZE, BUTTON_SIZE,
  () => fb.PlayOrPause(), 'Pause', '\uF04C');

const MARGIN = panel.prop.margin.value;

albumArt.m.right = MARGIN;

trackInfo.m.top = MARGIN;
trackInfo.m.right = MARGIN;
trackInfo.m.bottom = MARGIN;
trackInfo.p.bottom = BUTTON_SIZE + MARGIN;

toolbar.m.bottom = MARGIN;

trackbar.m.right = MARGIN;
trackbar.m.bottom = MARGIN;
trackbar.p.right = 100;

volumebar.m.right = MARGIN;
volumebar.m.bottom = MARGIN;

panel.init([albumArt, trackInfo, toolbar, trackbar, volumebar]);

// playback callback

// function playback_time(time) {
// }

function playback_stop() {
  toolbar.setButton(PLAY_BUTTON_ID, PLAY_BUTTON);
}

function playback_starting() {
  toolbar.setButton(PLAY_BUTTON_ID, PAUSE_BUTTON);
}

function playback_pause(state) {
  toolbar.setButton(PLAY_BUTTON_ID, state ? PLAY_BUTTON : PAUSE_BUTTON);
}

// HsmPanel callback

// function lbtn_up(x, y) {
// }

// function lbtn_down(x, y) {
// }

// function move(x, y) {
// }

// function wheel(step) {
// }

// function key_down(vkey) {
// }

// function paint(gr) {
// }