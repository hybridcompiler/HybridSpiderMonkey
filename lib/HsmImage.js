'use strict';

class HsmImage extends HsmControl {
    constructor(panel, dock, img, pos = {}, margin = {}) {
        super(panel, dock, pos, margin);
        this.img = img;
    }

    paint(gr) {
        _drawImage(gr, this.img, this.x, this.y, this.w, this.h, image.centre);
    }
}