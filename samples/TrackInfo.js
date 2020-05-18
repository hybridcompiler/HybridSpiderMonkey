'use strict';
let libPath = fb.ComponentPath + 'HybridSpiderMonkey/lib/'
include(libPath + 'HsmCustom.js');
include(libPath + 'HsmPanel.js');
include(libPath + 'HsmText.js');

let panel = new HsmPanel(),
  infoText = new HsmText(panel, HsmDock.fill, {}, {
    all: panel.prop.margin.value,
  });
panel.init([infoText]);