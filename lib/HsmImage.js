/// <reference path="./../../docs/js/foo_spider_monkey_panel.js" />
'use strict';

class HsmImage extends HsmControl {
    constructor(panel, dock, img, isMetaImage = true, rect = {}, margin = {}) {
        super(panel, dock, rect, margin);
        this.img = img;
        this.isMetaImage = isMetaImage;
    }

    paint(gr) {
        Hsm.drawImage(gr, this.img, this.x, this.y, this.w, this.h, DI_KEEP_ASPECT);
    }

    metadb_changed() {
        if (this.isMetaImage) this.img = utils.GetAlbumArtV2(HsmDb.metadb, 0);
    }
}