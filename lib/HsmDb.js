'use strict';

// metadb callback

function on_metadb_changed() {
  if (HsmDb.metadb) HsmPanel.global.sendCallback('metadb_changed', true);
}

function on_selection_changed() {
  !HsmDb.selection_changed() || on_metadb_changed();
}

function on_playback_new_track(metadb) {
  HsmDb.metadb = metadb;
  on_metadb_changed();
}

function on_playback_dynamic_info_track() {
  on_metadb_changed();
}

class HsmDb {
  static selection_changed() {
    HsmDb.metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
    if (!HsmDb.metadb || HsmDb.prevPath == HsmDb.metadb.Path) return false;
    HsmDb.prevPath = HsmDb.metadb.Path;
    return true;
  }

  static isFile() {
    return HsmDb.metadb.FileSize > 10;
  }

  static getMetaValue(meta) {
    return fb.IsPlaying ? meta.Eval() : meta.EvalWithMetadb(HsmDb.metadb);
  }

  static getTrackFormat() {
    return URL_FORMAT_MAP.get(HsmDb.metadb.Path) || TITLE_FORMATS.default;
  }
}