'use strict';
let libPath = fb.ComponentPath + 'HybridSpiderMonkey/lib/'
include(libPath + 'HsmPanel.js');
include(libPath + 'HsmImage.js');

let panel = new HsmPanel(),
  albumArt = new HsmImage(panel, DOCK_LEFT | DOCK_SQUARE);
panel.init([albumArt]);