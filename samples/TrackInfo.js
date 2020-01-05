/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmCustom.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmPanel.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmText.js');

let panel = new HsmPanel(),
  infoText = new HsmText(panel, DOCK_FILL, {}, {
    all: panel.prop.margin.value,
  });
panel.init([infoText]);