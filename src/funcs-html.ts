interface ITagKeyValue {
  key: string;
  value?: string;
}

enum EncodeTarget {
  Html = 0,
  Url = 1,
}
/**
 * 创建标签的左标签 - 改造
 * 创建一个映射关系把html标签映射成RN组件
 * eg: h1 -> text + style
 * @param tag
 * @param attrs
 * @returns
 */
function makeStartTag(
  tag: any,
  attrs: ITagKeyValue | ITagKeyValue[] | undefined = undefined
) {
  if (!tag) {
    return '';
  }

  var attrsStr = '';
  if (attrs) {
    var arrAttrs = ([] as ITagKeyValue[]).concat(attrs);
    if (arrAttrs.length > 0) {
      attrsStr = arrAttrs
        .map(function (attr: any) {
          /**将class变成style完成样式替换 */
          return (
            attr.key +
            (attr.value
              ? (attr.key === 'style' ? '={styles.' : '={') +
                convertToRNStyle(tag, attr.value) +
                '}'
              : '')
          );
        })
        .join(' ');
    } else {
      const rnStyle = convertToRNStyle(tag);
      attrsStr = rnStyle ? `style${convertToRNStyle(tag)}` : '';
    }
  }

  var closing = '>';
  if (tag === 'img' || tag === 'br') {
    closing = '/>';
  }
  function handleAdditionalTag(tag: string) {
    // if (tag === 'p') {
    //   return '<Text>'
    // }
    return '';
  }
  console.log(40, tag, attrsStr);
  return attrsStr
    ? `<${convertToRNTag(tag)} ${attrsStr}${closing}` + handleAdditionalTag(tag)
    : `<${convertToRNTag(tag)}${closing}`;
}
/**
 * 将html标签替换成rn标签
 * @param tag
 * @returns
 */
function convertToRNTag(tag: string) {
  switch (tag) {
    case 'p':
      return 'View';
    case 'iframe':
      return 'Video';
    case 'img':
      return 'Image';
    default:
      return 'Text';
  }
}
/**
 * 将富文本中的语义化标签转成rn中的样式
 * @param tag
 * @param attr
 * @returns
 */
function convertToRNStyle(tag: string, attr: string = '') {
  switch (tag) {
    case 'strong':
      return '={styles.textStrong}';
    case 'h1' || 'h2' || 'h3' || 'h4' || 'h5':
      return '={styles.textHeader}';
    default:
      return toCamelCase(attr);
  }
}
/**
 * class类名变成小驼峰
 * @param str
 * @returns
 */
function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, function (match: any, p1: string) {
    return p1.toUpperCase();
  });
}

function makeEndTag(
  tag: any = '',
  attrs: ITagKeyValue | ITagKeyValue[] | undefined = undefined
) {
  function handleAdditionalTag(tag: string) {
    // if (attrs) {
    //   if (tag === 'p') {
    //     return '</Text>'
    //   }
    // }
    return '';
  }
  return (tag && handleAdditionalTag(tag) + `</${convertToRNTag(tag)}>`) || '';
}

function decodeHtml(str: string) {
  return encodeMappings(EncodeTarget.Html).reduce(decodeMapping, str);
}

function encodeHtml(str: string, preventDoubleEncoding = true) {
  if (preventDoubleEncoding) {
    str = decodeHtml(str);
  }
  return encodeMappings(EncodeTarget.Html).reduce(encodeMapping, str);
}

function encodeLink(str: string) {
  let linkMaps = encodeMappings(EncodeTarget.Url);
  let decoded = linkMaps.reduce(decodeMapping, str);
  return linkMaps.reduce(encodeMapping, decoded);
}

function encodeMappings(mtype: EncodeTarget) {
  let maps = [
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#x27;'],
    ['\\/', '&#x2F;'],
    ['\\(', '&#40;'],
    ['\\)', '&#41;'],
  ];
  if (mtype === EncodeTarget.Html) {
    return maps.filter(
      ([v, _]) => v.indexOf('(') === -1 && v.indexOf(')') === -1
    );
  } else {
    // for url
    return maps.filter(([v, _]) => v.indexOf('/') === -1);
  }
}
function encodeMapping(str: string, mapping: string[]) {
  return str.replace(new RegExp(mapping[0], 'g'), mapping[1]);
}
function decodeMapping(str: string, mapping: string[]) {
  return str.replace(new RegExp(mapping[1], 'g'), mapping[0].replace('\\', ''));
}
export {
  makeStartTag,
  makeEndTag,
  encodeHtml,
  decodeHtml,
  encodeLink,
  ITagKeyValue,
};
