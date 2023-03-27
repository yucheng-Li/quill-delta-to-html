var QuillDeltaToHtmlConverter = require('./src/QuillDeltaToHtmlConverter')
  .QuillDeltaToHtmlConverter;

var ops = [
  {
    insert: 'kdlsajdk',
  },
  { insert: 'Hello' },
  { insert: '\n', attributes: { align: 'center' } },
  { insert: 'World' },
  { insert: '\n', attributes: { align: 'right' } },
  {
    insert: {
      mention: {
        index: '0',
        denotationChar: '@',
        id: '1',
        value: 'John Doe',
      },
    },
  },
  {
    insert: ' ',
  },
  {
    insert: {
      mention: {
        index: '0',
        denotationChar: '#',
        id: '3',
        value: 'Fredrik Sundqvist 2',
      },
    },
  },
  {
    insert: ' \n',
  },
  {
    attributes: {
      bold: true,
    },
    insert: 'lasjdkljaslkdjaskldjslak',
  },
  {
    insert: '\n',
  },
  {
    attributes: {
      bold: true,
    },
    insert: 'jdalskjdklasjdlksa',
  },
  {
    attributes: {
      header: 1,
    },
    insert: '\n',
  },
  {
    insert: {
      video:
        'https://xps02.xiaopeng.com/cms/material/video/2023/01-06/video_20230106135720_85074.mp4',
    },
  },
  {
    attributes: {
      header: 1,
    },
    insert: '\n',
  },
  {
    insert: {
      image:
        'https://xps01.xiaopeng.com/cms/material/pic/2023/03-09/pic_20230309200933_68299.jpg',
    },
  },
  {
    insert: '\n',
  },
  {
    insert: 'djkalsjdlkasjldkjasl\n',
  },
];

var converter = new QuillDeltaToHtmlConverter(ops);

converter.renderCustomWith((op: any) => {
  const type = op.insert.type;
  const data = op.insert.value;
  function handleMentionUserStyle(uid: string, userName: string) {
    return `<Text onPress={() => onClickUser(${uid})} style={styles.mentionUser}>@${userName}</Text>`;
  }
  function handleMentionTopicStyle(tid: string, topicName: string) {
    return `<Text onPress={() => onClickTopic(${tid})} style={styles.mentionTopic}>@${topicName}</Text>`;
  }
  if (type === 'mention') {
    const mentionType = data.denotationChar;
    switch (mentionType) {
      case '@':
        return handleMentionUserStyle(data.id, data.value);
      case '#':
        return handleMentionTopicStyle(data.id, data.value);

      default:
        return data.value;
    }
  } else {
    return data;
  }
});
var html = converter.convert();

console.log(html);
