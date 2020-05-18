'use strict';

class HsmImage extends HsmControl {
    constructor(panel, dock, img, isMetaImage = true, rect = {}, margin = {}) {
        super(panel, dock, rect, margin);
        this.img = img;
        this.isMetaImage = isMetaImage;
    }

    paint(gr) {
        Hsm.drawImage(gr, this.img, this.x, this.y, this.w, this.h, DrawImage.keepAspect);
    }

    metadb_changed() {
        if (this.isMetaImage) this.img = utils.GetAlbumArtV2(HsmDb.metadb, 0);
    }
}