'use strict';

const TITLE_FORMATS = {
  default: fb.TitleFormat('[Title$tab() %Title%$crlf()]\
[Artist$tab() %Artist%$crlf()]\
[Album$tab() %Album%$crlf()]\
[Genre$tab() %Genre%$crlf()]\
[$if(%Length%,,Path$tab() %Path%$crlf())]\
[Date$tab() %Date%$crlf()]\
[$crlf()%ALBUMDESCRIPTION%$]'),

  horizontal: fb.TitleFormat('[%Artist% - ][%Title%]'),

  saycast: fb.TitleFormat('[Title$tab() %Artist%$crlf()]\
[Artist$tab() %Title%$crlf()]\
[Path$tab() %Path%$crlf()]')
};

const URL_FORMAT_MAP = new Map([
  ['http://jazzfreaks.saycast.com/', TITLE_FORMATS.saycast],
  ['http://pinetree.saycast.com/', TITLE_FORMATS.saycast]
]);