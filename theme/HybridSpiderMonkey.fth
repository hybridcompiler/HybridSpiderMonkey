�����6J�A_s��!   -�p6�,bG��$@��Q�k   �Aĝ�h~ɕ�"�q�       _   %codec% | %bitrate% kbps | %samplerate% Hz | %channels% | %playback_time%[ / %length%] | %path%F��OմLH��.�� JI$   scb� ��+;iω�       �t�o�@����LQ�9<          QiDUN�Y���C�0  ��)6ڿ�����$�   ��rh�J�#�$�N���/  ���.hx�L�w��H�3�nlj�6�O�7d{�]�&�nlj�6�O�7d{�]�&�  �  �  .�|_�e�B��` ��sD;����VG������L�  �  �  ��0ſ1B�(Ϯ�I�Q   ��^�i�B��$}���=   ��0ſ1B�(Ϯ�I�   ��C��A���1��:    +VD�J��A��J�MP�    �����=M�������-  ��{U�J���o���\  !#��\��@��*B]p�  :����;0@�B`��P�n�  {�=Y��C��H ���   W���1{�G�������l    ���`�M���\�S��     fl-"��SM��23�K�  8��{J��E���;��no  �uN�d� N��cBq�,�[  S;���^�L�1^�D��      Р[�>Q�M��ѿZ��   OX)��_�F���f�\   ^5����-M�������H   3�;	Q��B�#��*��
      ����u�N��-���#   �����Z{���H���+}`f   5   P���&��C�Dc�]&��      �?�|�GM�0'�Y��    �L^�r<J��	aP^��   FS��՞O�Ls�:���    �D{��I�[�Ag.�                       �C�?��NN���׏[O|�   Р[�>Q�M��ѿZ��   OX)��_�F���f�\   ^5����-M�������H   3�;	Q��B�#��*��
       ����u�N��-���#   ��  �Z{���H���+}`f   �   P���&��C�Dc�]&��       �?�|�GM�0'�Y��    �L^�r<J��	aP^��                       Ӌ��pr}H��������    �>4GM�J�Y=ci�1�       ��2ZV�KF��h�=i;�                       Uq�O���I��JC,��   O��,�C�a�νg��   �e�� N�����g�Y   	j5�ZCL��'܇�>���;�
#�D�."����H   -��!DB�w���ucp4   F�S]�G�F�I���   @   ^�z�l�C��Tʧ��           �F�Ԑ<�M��~yV��   �����G4u�N��vC�jC   No��	��K��g�>�D^�OK�^<D�B
�j6�   ZcB�- �G��b�3�lq
��)w~E�p����]   ��sk��B��G�nM��I   z�Å�Q@�F�+�B��            팝송�'a��K��L�w�b         팝송���m��N��?z��o8)   �
�,v@?J��*��t��   k}U9��N�D�qw\�    �
$���M�"P�����>   E �̓��G�
�	6���*   ��O�C�@�Ϯ�km�S    �^��wJ���Hm��M    fl-"��SM��23�KN  8��{J��E���;��n�  �uN�d� N��cBq�,��  S;���^�L�1^�D�       �D{��I�[�Ag.�                       �C�?��NN���׏[O|                       Ӌ��pr}H��������    �>4GM�J�Y=ci�1�-     Р[�>Q�M��ѿZ�  OX)��_�F���f�\   ^5����-M�������H   3�;	Q��B�#��*��
       ����u�N��-���#   ��  �Z{���H���+}`f   �  P���&��C�Dc�]&��       �?�|�GM�0'�Y��    �L^�r<J��	aP^��d  �iޒ��I��|rO�P  5��uk�H��eN��    �`����B��3���u�  �  // 장르가 게임이면 앨범 출력
$if($strstr(%genre%,Game),%album%,

// 앨범 아티스트가 Various Artists이면 앨범명 출력
$if($strstr(%album artist%,Various Artists),%album%,

// 음악 오디오이면 앨범 아티스트 출력
$if($strstr(%codec%,MP3),$if3(%album artist%,%artist%,%title),
$if($strstr(%codec%,FLAC),$if3(%album artist%,%artist%,%title),
$if($strstr(%codec%,ALAC),$if3(%album artist%,%artist%,%title),

$if3(%album%,%artist%,%title)
)))))�mt���O�,=M|�      Album artist���;;B�bN����       ��2ZV�KF��h�=i;�                       Uq�O���I��JC,��   O��,�C�a�νg��   �e�� N�����g�Y   	j5�ZCL��'܇�>���;�
#�D�."����H   -��!DB�w���ucp4   F�S]�G�F�I���   l   ^�z�l�C��Tʧ��           �F�Ԑ<�M��~yV��   �����G4u�N��vC�jC   No��	��K��g�>�D^�OK�^<D�B
�j6�   [��ݸ�I�}�4:�q
��)w~E�p�����   ��sk��B��G�nM���   z�Å�Q@�F�+�B��.         "   Michael Jackson (마이클 잭슨)�'a��K��L�w�b+      "   Michael Jackson (마이클 잭슨)���m��N��?z��o8)   �
�,v@?J��*��t��   k}U9��N�D�qw\�    �
$���M�"P�����>   E �̓��G�
�	6���*   ��O�C�@�Ϯ�km�S    �^��wJ���Hm��M    �P��l�O���B�I   _�'x5�
I��ɾ��[�5   �y��ZA�--^W�Y�    �)�,���L�_�SL�IL        {�  �����y F�xW���>   {�u'�'�E�O�<K��*   :�uc�K�c��S�R   [�e8���J��Pt�(    �����O���pJު�  �>h�HR�O��R���k�  �z�QAH�_WA���V   �MU�Z��H����&�#B   A{�ʽ|F�RTvon	#    ��*IGcM�/R_�E5       �U���}I�v�m� �    ��i��-�B�Z�,   ]����O�,��v9q�   	d�$z�I�Jv�
u�       ��D���@��9����}  �a�<�dkB���~�l  '޾Oi�N�q�J>�ݚ    4.��"@����!(��     �/�L��N�Ď�7=~~   OT���A�w��uf��    5T��gH����Cr�S       �8���H����e   H   ��r��L���T��*~    �4
XL�@���7���8   ��S�gC(L�O��&���/�L��N�Ď�7=~~   OT���A�w��uf��    5T��gH����Cr�S      �8���H����e   <   ��r��L���T��*~    �4
XL�@���7���8   y���qK�8�4�rڢ/�L��N�Ď�7=~~   OT���A�w��uf��   5T��gH����Cr�S      �8���H����e      ��r��L���T��*~    �4
XL�@���7���8   �Z��,O��$`P_À�/�L��N�Ď�7=~~   OT���A�w��uf��    5T��gH����Cr�S      �8���H����e   �   ��r��L���T��*~    �4
XL�@���7���8   �A:��_C��9f��+��/�L��N�Ď�7=~~   OT���A�w��uf��   5T��gH����Cr�S      �8���H����e      ��r��L���T��*~    �4
XL�@���7���8   #�!�zK����U·����}�D�ٟ:����.	                       "   _DISPLAY: Show Artist in Track Row      _DISPLAY: Show Cover Art ��   _DISPLAY: Show Group Headers ��    _DISPLAY: Show Mood in Track Row ��"   _DISPLAY: Show Rating in Track Row      _DISPLAY: Show Scrollbar ��   _DISPLAY: Show Top Bar      _DISPLAY: Show Wallpaper      _DISPLAY: Wallpaper Blurred   (   _PROPERTY.PlaylistManager.ShowTotalItems ��   _PROPERTY: Autocollapse groups   /   _PROPERTY: Cover art masks (used for the cache) "   *front*.*;*cover*.*;*folder*.*;*.*   _PROPERTY: Custom Colors   !   _PROPERTY: Default Wallpaper Path H   .\user-components\foo_jscript_panel\samples\js-smooth\images\default.png   _PROPERTY: Double Row Text Info ��   _PROPERTY: Enable Filter Box ��/   _PROPERTY: Enable Playlist Filterbox in Top Bar ��+   _PROPERTY: Number minimum of Rows per Group         )   _PROPERTY: Number of Extra Rows per Group         *   _PROPERTY: Number of Rows for Group Header        @   _PROPERTY: Row Height      �A@   _PROPERTY: tf_groupkey d  $if3(%album%,%album artist%,$if(%length%,%title%,$if($strstr(%path%,saycast),saycast.com,%path%))) ^^ $if3(%album artist%,%artist%,$if(%length%,$if2(%album%,%title%),$if($strstr(%path%,saycast.com),saycast.com,%path%))) ^^ $if2(%discnumber%,1) ## [%artist%] ^^ $if($strchr(%title%,<),%path%,%title%) ^^ $if($strstr([%genre%],ALSong),,[%genre%]) ^^ [%date%]   _PROPERTY: Touch control ��   _SYSTEM: Extra font size value            _SYSTEM: Wallpaper Mode       �?   CUSTOM COLOR BACKGROUND NORMAL    025-025-035    CUSTOM COLOR BACKGROUND SELECTED    015-177-255   CUSTOM COLOR HIGHLIGHT    255-175-050   CUSTOM COLOR TEXT NORMAL    180-180-180   CUSTOM COLOR TEXT SELECTED    000-000-000     ��_lM�vw�3�vwЊY�vw               Chakra�  // ==PREPROCESSOR==
// @name "JS Smooth Playlist"
// @version "2018-mod"
// @author "Br3tt aka Falstaff"
// @import "%fb2k_component_path%samples\js-smooth\js\JScommon.js"
// @import "%fb2k_component_path%samples\js-smooth\js\JSinputbox.js"
// @import "%fb2k_component_path%samples\js-smooth\js\jssp.js"
// ==/PREPROCESSOR==

/*
[Features]
 * Groups (collpase or expand, add extra lines, ...)
 * True Smooth Scrolling
 * Screen Touch support
 * "in track" rating system
 * Playlist Header at Top (can be hidden with CTRL+T)
 * Vertical Scrollbar (can be hidden with CTRL+B)
 * Custom or Cover art Wallpaper as background supported (including a blur effect)
 * Collapsable playlists panel to easily drag'n drop tracks to a another playlist
 * Windows scaling compliant (you can adjust zoom size in real time with CTRL+mousewheel)
 * Custom Panel Colors (in Properties window)
 * ... and more!

[Tips]
 * Hold SHIFT key + right click to display Configure script and panel Properties entries
 * Change colors and fonts in foobar2000 Preferences > DefaultUI or ColumsUI
 * Some minor settings can be changed in window Properties (SHIFT + right click > Properties), use it carefully
 * Use Keyboard for "jumping" to an artist in the playlist (incremental search feature like in ELPlaylist) or to navigate in playlist
 * Right Click on items for contextual menu for the selection
 * CTRL+T to toggle the columns toolbar
 * CTRL+B to toggle the scrollbar
 * Hold CTRL + Mouse Wheel to scale elements (useful for 'retina' screens)
 * Hold SHIFT + Mouse Wheel to scale group header and so the cover art size
 * F3 key to show now playing track
 * F5 key to refresh covers
 * ... etc
*/
 `   ��������    �`�NZ�O�ZcKu@���nlj�6�O�7d{�]�&�  }  �      ˙�B�U'�0!��       HSM.COLOURS.BACKGROUND   ����   HSM.FONTS.TITLESIZE   ����   HSM.FONTS.SIZE   ����   HSM.COLOURS.TEXT   ����   HSM.COLOURS.HIGHLIGHT   ����   HSM.COLOURS.TITLE   ����
   HSM.MARGIN         HSM.LINESPACING   333333�? ,          ����������������f   �    5  �  'use strict';
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');

include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\Hsm.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmPanel.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmImage.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmText.js');
include(fb.ComponentPath + 'HybridSpiderMonkey\\lib\\HsmMediaControl.js');

let metaSources = {
    default: fb.TitleFormat('[Title$tab() %Title%$crlf()]\
[Artist$tab() %Artist%$crlf()]\
[Album$tab() %Album%$crlf()]\
[Genre$tab() %Genre%$crlf()]\
[$if(%Length%,,Path$tab() %Path%$crlf())]\
[Date$tab() %Date%$crlf()]\
[$crlf()%ALBUMDESCRIPTION%$]'),

    saycast: fb.TitleFormat('$if(%playback_time%,[Title$tab() %Artist%$crlf()][Artist$tab() %Title%$crlf()])\
[Path$tab() %Path%]'),
    saycastUrl: 'saycast.com'
};

let panel = new HsmPanel(),
    metaImage = new HsmImage(panel, DOCK_LEFT | DOCK_SQUARE),
    mediaControl = new HsmMediaControl(panel, DOCK_BOTTOM, 16, {
        all: panel.prop.margin.value
    }),
    infoText = new HsmText(panel, DOCK_FILL, {}, {
        left: panel.prop.margin.value,
        top: panel.prop.margin.value,
        right: panel.prop.margin.value
    });
panel.controls = [metaImage, mediaControl, infoText];

on_selection_changed();

function getMetaValues() {
    return !panel.metadb ? null : panel.isStreaming() & panel.metadb.Path.includes(metaSources.saycastUrl) ?
        panel.getMetaValue(metaSources.saycast) : panel.getMetaValue(metaSources.default);
}

// window callback

function on_mouse_lbtn_dblclk(x, y) {
    fb.RunMainMenuCommand('View/Show now playing in playlist');
}

function on_mouse_lbtn_up(x, y) {
    mediaControl.lbtn_up(x, y);
}

function on_mouse_lbtn_down(x, y) {
    mediaControl.lbtn_down(x, y);
}

function on_mouse_move(x, y) {
    mediaControl.move(x, y) || infoText.move(x, y);
}

function on_mouse_wheel(s) {
    if (mediaControl.wheel(s)) return;
    if (infoText.wheel(s)) window.Repaint();
}

function on_key_down(vkey) {
    if (infoText.key_down(vkey)) window.Repaint();
}

function on_paint(gr) {
    panel.paint(gr);
}

function on_size() {
    panel.size();
    window.Repaint();
}

// metadb changed callback

function on_metadb_changed() {
    if (!panel.metadb) return;
    metaImage.img = utils.GetAlbumArtV2(panel.metadb, 0);
    infoText.update(getMetaValues());
    mediaControl.metadb_changed();
    window.Repaint();
}

function on_selection_changed() {
    if (panel.selection_changed()) on_metadb_changed();
}

function on_playback_new_track(metadb) {
    panel.playback_new_track(metadb);
    on_metadb_changed();
}

function on_playback_dynamic_info_track() {
    on_metadb_changed();
}

// playback callback

function on_playback_stop() {
    mediaControl.playback_stop();
}

function on_playback_starting() {
    mediaControl.playback_starting();
}

function on_playback_pause() {
    mediaControl.playback_pause();
}

function on_playback_time(time) {
    mediaControl.playback_time(time);
}

// colours & font callback

function on_colours_changed() {
    panel.colours_changed();
    mediaControl.colours_changed();
    window.Repaint();
}

function on_font_changed() {
    panel.font_changed();
    infoText.font_changed();
    window.Repaint();
} m�S�@���뉡=��kn�9�D��3�y�=     �  `   
                   ��     ��� ����            �      "S e g o e   U I                                                    Lyric Show Panel 3����            �     �    G u l i m   l l   D l g                                                                 �@       ) y�΄ǐ��q[������@��      P   `   ��������    `   ��������    `   ��������    ����B��%gq��     �kn�9�D��3�y�   Spectrum.�|_�e�B��` ��sD   Facets���.hx�L�w��H�3   Splitter (top/bottom)�nlj�6�O�7d{�]�&   Splitter (left/right)m�S�@���뉡=�   Lyrics Show Panel v3;����VG������L   Playlist Tabs����}�D�ٟ:����   JScript Panel�`�NZ�O�ZcKu@��   Spider Monkey PanelW��w/�@�MR}at*P   �K9�0���Ə�r
�I   �,��O��9���A   �       Segoe UI[U���tO��UR��qK   �  �    Segoe UI��Y���H���[�b-T   ��Bￏ��Y�>��D   ��]��oA�-��1���    �@���C�;�2n5��� B���j>:B�fe��u�  � k���
~�F����@� @� 