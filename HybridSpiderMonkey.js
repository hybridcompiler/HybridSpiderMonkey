'use strict';
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');

const DT_EXPANDTABS = 0x00000040,
    DT_WORD_ELLIPSIS = 0x00040000;

const FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
};

const IMG = {
    foobar2000: _img(fb.ComponentPath + 'HybridSpiderMonkey\\images\\foobar2000.png'),
    album: _img(fb.ComponentPath + 'HybridSpiderMonkey\\images\\album.png')
}

let panel = new _panel(),
    buttons = new _buttons(),
    seekbar = new _seekbar(0, 0, 0, 0);

let fonts = {};

let metas = {
    db: null,
    img: null,
    albumDesc: '',
    albumDescName: 'ALBUMDESCRIPTION',
    path: 3,
    splitter: '\t  ',
    list: ['Title', 'Artist', 'Album', 'Path', 'Date'],
    saycast: ['Artist', 'Title', 'Album', 'Path', 'Date'],
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    wheel: 0,
    lineCount: 0,
    linePerPage: 0
};

let button = {
    x: 0,
    y: 0,
    w: 0,
    h: 32,
    playId: 3,
    pauseId: 4,
    text: ['Menu', 'Stop', 'Previous', 'Play', 'Pause', 'Next', 'Random', 'Console', 'Layout editing mode'],
    img: [IMG.foobar2000 || 'M', '\u23F9', '\u23EE', '\u23F5', '\u23f8', '\u23ED', 'R', 'C', 'L'
    ],
    func: [(x, y, mask) => {
        _menu(x, y);
    }, () => {
        fb.Stop();
    }, () => {
        fb.Prev();
    }, () => {
        fb.PlayOrPause();
    }, () => {
        fb.PlayOrPause();
    }, () => {
        fb.Next();
    }, () => {
        fb.Random();
    }, () => {
        fb.RunMainMenuCommand('Console');
    }, () => {
        fb.RunMainMenuCommand('Enable layout editing mode');
    }]
};

let playtime = {
    playing: fb.TitleFormat('%playback_time%$if(%length%, / %length%)'),
    stop: fb.TitleFormat('$if(%length%,%length%)'),
    x: 0,
    y: 0,
    w: 0,
    h: 0
}

on_font_changed();
on_selection_changed();

function isStreaming() {
    return metas.db.RawPath.includes('http:') || metas.db.RawPath.includes('https:');
}

function getMetaValue(meta, i) {
    if (isStreaming()) {
        // at saycast url, change the title with the singer
        if (metas.db.Path.includes('saycast.com')) meta = metas.saycast[i];
    }
    return fb.TitleFormat('%' + meta + '%').Eval(true);
}

function getMetaData() {
    metas.wheel = 0;
    metas.lineCount = 0;
    metas.albumDesc = metas.db ? fb.TitleFormat('%' + metas.albumDescName + '%').Eval(true) : '';
    metas.img = metas.db ? (utils.GetAlbumArtV2(metas.db, 0) || IMG.album) : IMG.album;
}

function updateButtons() {
    let x = button.x;
    const isPlaying = fb.IsPlaying && !fb.IsPaused;
    for (let i = 0, length = button.text.length; i < length; i++) {
        let h = ((i == button.playId && isPlaying) || (i == button.pauseId && !isPlaying)) ? 0 : button.h;

        buttons.buttons[i] = new _button(x, button.y, h, h, {
            normal: (typeof button.img[i] == 'string' ?
                _chrToImg(button.img[i], panel.colours.text) : button.img[i])
        }, button.func[i], button.text[i]);
        x += h;
    }
}

function on_paint(gr) {
    panel.paint(gr);
    buttons.paint(gr);

    // album art
    if (metas.img) _drawImage(gr, metas.img, 0, 0, panel.h, panel.h, image.centre);

    if (metas.db) {
        let info = '';
        for (let i = 0, length = metas.list.length; i < length; i++) {
            // path show only streaming url
            if (i == metas.path && !isStreaming()) continue;

            const meta = metas.list[i];
            let text = fb.IsPlaying ? getMetaValue(meta, i) :
                fb.TitleFormat('%' + meta + '%').EvalWithMetadb(metas.db);
            // skip space or html tag
            if (!text || text == '?' || text.startsWith('<')) continue;
            info += meta + metas.splitter + text + '\n';
        }
        let fontInfo = fonts.title;
        if (metas.albumDesc && metas.albumDesc.length > 1) {
            info += '\n' + metas.albumDesc;
            fontInfo = fonts.desc;
            metas.lineCount = metas.lineCount || gr.MeasureString(info, fontInfo, metas.x, metas.y,
                metas.w, fonts.desc.Height * 1000, 0).Lines;

            if (metas.lineCount > metas.linePerPage) {
                gr.GdiDrawText(metas.wheel + ' / ' + metas.lineCount, fonts.desc, panel.colours.text,
                    playtime.x, playtime.y, playtime.w, playtime.h, 0);
            }
        }
        if (info) {
            let scrollText = fontInfo.Height * metas.wheel;
            gr.GdiDrawText('\n' + info, fontInfo, panel.colours.text,
                metas.x, metas.y - scrollText, metas.w, metas.h + scrollText, DT_EXPANDTABS | DT_WORDBREAK);
        }

        // play time & length
        let playTimeText = fb.IsPlaying ? playtime.playing.Eval() : playtime.stop.EvalWithMetadb(metas.db);
        gr.GdiDrawText(playTimeText, fonts.desc, panel.colours.text,
            playtime.x, playtime.y, playtime.w, playtime.h, 2);

        // seek bar progress
        if (fb.IsPlaying && fb.PlaybackLength > 0) {
            gr.FillSolidRect(seekbar.x, seekbar.y, seekbar.pos(), seekbar.h, panel.colours.highlight);
        }
    }
    // seek bar border line
    gr.DrawRect(seekbar.x, seekbar.y, seekbar.w, seekbar.h, 1, panel.colours.text);
}

function on_size() {
    panel.size();
    let margin = button.h / 2;

    // buttons position
    button.x = panel.h + margin;
    button.w = button.h * (button.text.length - 1);
    button.y = panel.h - button.h - margin / 2;

    // seek bar position
    seekbar.h = 12;
    seekbar.x = button.x + button.w;
    seekbar.w = panel.w - seekbar.x - margin;
    seekbar.y = panel.h - seekbar.h - margin;

    // play time position
    playtime.x = seekbar.x;
    playtime.w = seekbar.w;
    playtime.h = fonts.title.Height;
    playtime.y = seekbar.y - playtime.h;

    // track info position
    metas.x = button.x;
    metas.w = seekbar.w + button.w;
    metas.y = 0;
    metas.h = button.y - metas.y - margin;
    metas.linePerPage = Math.floor(metas.h / fonts.desc.Height);
    metas.h = fonts.desc.Height * metas.linePerPage;
    metas.wheel = 0;
    metas.lineCount = 0;

    updateButtons();
}

function on_mouse_lbtn_down(x, y) {
    seekbar.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
    buttons.lbtn_up(x, y) || seekbar.lbtn_up(x, y) ||
        fb.RunMainMenuCommand('View/Show now playing in playlist');
}

function on_mouse_move(x, y) {
    buttons.move(x, y) || seekbar.move(x, y);
}

function on_mouse_wheel(s) {
    if (seekbar.wheel(s)) return;
    if (s == 1 && metas.wheel > 0) {
        metas.wheel -= metas.linePerPage;
        if (metas.wheel < 0) metas.wheel = 0;
    } else if ((metas.wheel + metas.linePerPage) <= metas.lineCount) {
        metas.wheel += metas.linePerPage;
    } else return;
    window.Repaint();
}

function on_selection_changed() {
    metas.db = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    getMetaData();
    window.Repaint();
}

function on_playback_new_track(metadb) {
    metas.db = metadb;
    getMetaData();
    window.Repaint();
}

function on_playback_edited(time) {
    window.Repaint();
}

function on_playback_time(time) {
    window.Repaint();
}

function on_playback_seek(time) {
    seekbar.playback_seek();
    window.Repaint();
}

function on_playback_stop() {
    updateButtons();
    window.Repaint();
}

function on_playback_starting() {
    updateButtons();
    metas.db = fb.GetNowPlaying() || fb.GetFocusItem();
    getMetaData();
    window.Repaint();
}

function on_playback_pause() {
    updateButtons();
    window.Repaint();
}

function on_colours_changed() {
    panel.colours_changed();
}

function on_font_changed() {
    fonts.desc = window.GetFontDUI(FontTypeDUI.defaults);
    fonts.title = gdi.Font(fonts.desc.Name, fonts.desc.Size + 3);
    window.Repaint();
}