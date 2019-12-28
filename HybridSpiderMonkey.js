'use strict';
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');

let XmlHttp = new ActiveXObject('MSXML2.XMLHTTP');
let fileStream = new ActiveXObject('ADODB.Stream');
let fileSystemObject = new ActiveXObject('Scripting.FileSystemObject');

const TAG_IMG = '<img src=';
const TEMP_IMAGE = fileSystemObject.GetSpecialFolder(2) + '\\hsm_temp_img.png';
const FOOBAR2000_IMG = _img(fb.ComponentPath + '\\HybridSpiderMonkey\\images\\foobar2000.png');
const ALBUM_IMG = _img(fb.ComponentPath + '\\HybridSpiderMonkey\\images\\album.png');

let panel = new _panel();
let buttons = new _buttons();
let seekbar = new _seekbar(0, 0, 0, 0);

let albumImg = null;
let metaData = null;

let metas = {
    path: 3,
    list: ['Title', 'Artist', 'Album', 'Path', 'Date'],
    saycast: ['Artist', 'Title', 'Album', 'Path', 'Date'],
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    x2: 0,
    w2: 0,
    metaNameW: 7,
    lineH: 1.2
};

let button = {
    x: 0,
    y: 0,
    stopId: 1,
    playId: 3,
    pauseId: 4,
    h: 32,
    text: ['Menu', 'Stop', 'Previous', 'Play', 'Pause', 'Next', 'Random', 'Console', 'Layout editing mode'],
    img: [FOOBAR2000_IMG ? FOOBAR2000_IMG : 'M',
        '\u23F9', '\u23EE', '\u23F5', '\u23f8', '\u23ED', 'R', 'C', 'L'
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

on_selection_changed();

function getAlbum() {
    if (metaData) {
        albumImg = utils.GetAlbumArtV2(metaData, 0);

        if (!albumImg) {
            let title = fb.TitleFormat('%title%').EvalWithMetadb(metaData);
            if (title.startsWith(TAG_IMG) && title.endsWith('>')) {
                if (downloadFile(title.substr(TAG_IMG.length, title.length - TAG_IMG.length - 1)))
                    albumImg = _img(TEMP_IMAGE);
            }
            else albumImg = ALBUM_IMG;
        }
    }
    window.Repaint();
}

function isStreaming() {
    return metaData.RawPath.includes('http:') || metaData.RawPath.includes('https:');
}

function getMetaValue(meta, i) {
    if (isStreaming()) {
        // Saycast는 타이틀과 아티스트를 서로 바꿔야 한다.
        if (metaData.Path.includes('saycast.com')) meta = metas.saycast[i];
    }
    return fb.TitleFormat('%' + meta + '%').Eval();
}

function downloadFile(url) {
    if (fileSystemObject.FileExists(TEMP_IMAGE)) {
        try {
            fileSystemObject.DeleteFile(TEMP_IMAGE);
        } catch (e) {
            return false;
        }
    }
    try {
        XmlHttp.open('GET', url, false);
        XmlHttp.send();
    } catch (e) {
        return false;
    }
    if (XmlHttp.ActiveX_Get('Status') == 200) {
        fileStream.Open();
        fileStream.ActiveX_Set('Type', 1);
        fileStream.Write(XmlHttp.ActiveX_Get('ResponseBody'));
        fileStream.ActiveX_Set('Position', 0);
        fileStream.SaveToFile(TEMP_IMAGE);
        fileStream.Close();
        return true;
    }
    return false;
}

function updateButtons() {
    let x = button.x;
    for (let i = 0; i < button.text.length; i++) {
        let h = ((i == button.stopId && !fb.IsPlaying) ||
            (i == button.playId && fb.IsPlaying && !fb.IsPaused) ||
            (i == button.pauseId && (!fb.IsPlaying || fb.IsPaused))) ? 0 : button.h;

        buttons.buttons[i] = new _button(x, button.y, h, h, {
            normal: (typeof button.img[i] == 'string' ? _chrToImg(button.img[i], panel.colours.text) : button.img[i])
        }, button.func[i], button.text[i]);
        x += h;
    }
}

function on_paint(gr) {
    panel.paint(gr);
    buttons.paint(gr);

    // 앨범 커버 출력
    if (albumImg) _drawImage(gr, albumImg, 0, 0, panel.h, panel.h, image.centre);

    if (metaData) {
        // 트랙 정보 출력
        let y = 0;
        for (let i = 0; i < metas.list.length; i++) {
            // Path는 스트리밍 주소만 출력한다.
            if (i == metas.path && !isStreaming()) continue;

            const meta = metas.list[i];
            let text = fb.IsPlaying ? getMetaValue(meta, i) :
                fb.TitleFormat('%' + meta + '%').EvalWithMetadb(metaData);

            // 공백 또는 HTML태그는 출력 생략
            if (!text || text == '?' || text.startsWith('<')) continue;

            y += metas.h;
            gr.GdiDrawText(meta, panel.fonts.title, panel.colours.text, metas.x, y, metas.w, metas.h, 0);
            gr.GdiDrawText(text, panel.fonts.title, panel.colours.text, metas.x2, y, metas.w2, metas.h, 0);
        }

        // 검색 막대 진행 상황 출력
        if (fb.IsPlaying && fb.PlaybackLength > 0) {
            gr.FillSolidRect(seekbar.x, seekbar.y, seekbar.pos(), seekbar.h, panel.colours.highlight);
        }
    }
    gr.DrawRect(seekbar.x, seekbar.y, seekbar.w, seekbar.h, 1, panel.colours.text);

    // 실행 시간 출력
    playtime.y = seekbar.y - metas.h;
    playtime.h = metas.h;
    let playTimeText = fb.IsPlaying ? playtime.playing.Eval() : playtime.stop.EvalWithMetadb(metaData);
    gr.GdiDrawText(playTimeText, panel.fonts.normal, panel.colours.text,
        playtime.x, playtime.y, playtime.w, playtime.h, 2);
}

function on_size() {
    panel.size();

    // 검색 막대 위치
    let margin = panel.h / 10;
    seekbar.h = panel.fonts.normal.Height * 0.6;
    seekbar.x = panel.h + margin;
    seekbar.w = panel.w - seekbar.x - margin;
    seekbar.y = panel.h - seekbar.h - margin;

    // 트랙 정보 위치
    metas.x = seekbar.x;
    metas.w = panel.fonts.title.Size * metas.metaNameW;
    metas.y = 0;
    metas.h = panel.fonts.title.Height * metas.lineH;
    metas.w2 = panel.w - metas.x - metas.w;
    metas.x2 = metas.x + metas.w;

    // 실행 시간 위치
    playtime.x = seekbar.x;
    playtime.w = seekbar.w;

    // 버튼 위치
    button.x = seekbar.x;
    button.y = seekbar.y - button.h;

    updateButtons();
}

function on_mouse_lbtn_down(x, y) {
    seekbar.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
    if (buttons.lbtn_up(x, y)) return;
    if (seekbar.lbtn_up(x, y)) return;
    fb.RunMainMenuCommand('View/Show now playing in playlist');
}

function on_mouse_move(x, y) {
    if (buttons.move(x, y)) return;
    seekbar.move(x, y);
}

function on_mouse_wheel(s) {
    if (seekbar.wheel(s)) return;
    if (s == 1) fb.Prev();
    else fb.Next();
}

function on_selection_changed() {
    metaData = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    getAlbum();
}

function on_playback_new_track(metadb) {
    metaData = metadb;
    getAlbum();
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
    panel.font_changed();
}