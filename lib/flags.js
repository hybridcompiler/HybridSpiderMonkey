// Flags, used with GdiDrawText()
// For more information, see: http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx
const DT_TOP = 0x00000000,
  DT_LEFT = 0x00000000,
  DT_CENTER = 0x00000001,
  DT_RIGHT = 0x00000002,
  DT_VCENTER = 0x00000004,
  DT_BOTTOM = 0x00000008,
  DT_WORDBREAK = 0x00000010,
  DT_SINGLELINE = 0x00000020,
  DT_EXPANDTABS = 0x00000040,
  DT_TABSTOP = 0x00000080,
  DT_NOCLIP = 0x00000100,
  DT_EXTERNALLEADING = 0x00000200,
  DT_CALCRECT = 0x00000400,
  DT_NOPREFIX = 0x00000800, // Please use this flag, or a '&' character will become an underline '_'
  DT_INTERNAL = 0x00001000,
  DT_EDITCONTROL = 0x00002000,
  DT_PATH_ELLIPSIS = 0x00004000,
  DT_END_ELLIPSIS = 0x00008000,
  DT_RTLREADING = 0x00020000,
  DT_WORD_ELLIPSIS = 0x00040000,
  DT_NOFULLWIDTHCHARBREAK = 0x00080000,
  DT_HIDEPREFIX = 0x00100000,
  DT_PREFIXONLY = 0x00200000;


// =================================================================================================
// Keys

const VK_ESCAPE = 0x1B,
  VK_SHIFT = 0x10,
  VK_LEFT = 0x25,
  VK_UP = 0x26,
  VK_RIGHT = 0x27,
  VK_DOWN = 0x28,
  VK_CONTROL = 0x11,
  VK_PGUP = 0x21,
  VK_PGDN = 0x22;

const DLGC_WANTALLKEYS = 0x0004;

const TextRenderingHint = {
  SystemDefault: 0,
  SingleBitPerPixelGridFit: 1,
  SingleBitPerPixel: 2,
  AntiAliasGridFit: 3,
  AntiAlias: 4,
  ClearTypeGridFit: 5
};

// =================================================================================================
// Foobar2000 constants

// Used in window.GetColorCUI()
const ColorTypeCUI = {
  text: 0,
  selection_text: 1,
  inactive_selection_text: 2,
  background: 3,
  selection_background: 4,
  inactive_selection_background: 5,
  active_item_frame: 6
};
// Used in window.GetFontCUI()
const FontTypeCUI = {
  items: 0,
  labels: 1
};
// Used in window.GetColorDUI()
const ColorTypeDUI = {
  text: 0,
  background: 1,
  highlight: 2,
  selection: 3
};
// Used in window.GetFontDUI()
const FontTypeDUI = {
  defaults: 0,
  tabs: 1,
  lists: 2,
  playlists: 3,
  statusbar: 4,
  console: 5
};

// =================================================================================================
// Hsm constants

const HsmFont = {
  image: 'FontAwesome',
  toolTip: 'Arial'
}

// Used in HsmPanel.sizeControls()
const HsmDock = {
  fix: 0,
  left: 1,
  top: 2,
  right: 4,
  bottom: 8,
  square: 16,
  fill: 32
};
// Used in Hsm.drawImage()
const DrawImage = {
  keepAspect: 0
}