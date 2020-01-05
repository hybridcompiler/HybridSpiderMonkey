/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmPanel.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmImage.js');

let panel = new HsmPanel(),
  albumArt = new HsmImage(panel, DOCK_LEFT | DOCK_SQUARE);
panel.init([albumArt]);