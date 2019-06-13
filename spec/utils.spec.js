const {
  expect
} = require('chai')
const {
  convertTimeStamp,
  createRef,
  renameKeys,
  formatArr
} = require('../db/utils/utils');
const articleData = require('../db/data/test-data/articles');
const commentData = require('../db/data/test-data/comments');

describe('convertTimeStamp', () => {
  it('converts a timestamp to a valid date', () => {
    expect(convertTimeStamp([{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }])).to.eql([{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: "2018-11-15",
      votes: 100,
    }]);
  });
});

describe('createRef', () => {
  it('should return an array when passed an array with one object', () => {
    expect(createRef([{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }], 'title')).to.eql({
      'Living in the shadow of a great man': 1
    })
  });
  it('should return an array when passed a large array', () => {
    expect(createRef(articleData, 'title')).to.eql({
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
      'Eight pug gifs that remind me of mitch': 3,
      'Student SUES Mitch!': 4,
      'UNCOVERED: catspiracy to bring down democracy': 5,
      'A': 6,
      'Z': 7,
      'Does Mitch predate civilisation?': 8,
      "They're not exactly dogs, are they?": 9,
      'Seven inspirational thought leaders from Manchester UK': 10,
      'Am I a cat?': 11,
      'Moustache': 12
    })
  });
});

describe('renameKeys', () => {
  it('should return an empty array when passed an empty array', () => {
    expect(renameKeys([])).to.eql([]);
  });
  it('returns an array with with the keys passed changed', () => {
    expect(renameKeys([{
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }], 'created_by', 'author')).to.eql([{
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      author: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }]);
    it('returns an array with with the keys passed changed', () => {
      expect(renameKeys([{
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      }], 'belongs_to', 'article_id')).to.eql([{
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: "They're not exactly dogs, are they?",
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      }]);
    });
  });
});

describe('formatArr', () => {
  it('should return an array with formatted according to the arguments passed', () => {
    expect(formatArr([{
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: "They're not exactly dogs, are they?",
      author: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    }], {
        'Living in the shadow of a great man': 1,
        'Sony Vaio; or, The Laptop': 2,
        'Eight pug gifs that remind me of mitch': 3,
        'Student SUES Mitch!': 4,
        'UNCOVERED: catspiracy to bring down democracy': 5,
        'A': 6,
        'Z': 7,
        'Does Mitch predate civilisation?': 8,
        "They're not exactly dogs, are they?": 9,
        'Seven inspirational thought leaders from Manchester UK': 10,
        'Am I a cat?': 11,
        'Moustache': 12
      })).to.eql([{
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      }])



    const objRef = createRef(articleData, 'title')
    const renamedComments = renameKeys(commentData, 'created_by', 'author');
    const newComments = renameKeys(renamedComments, 'belongs_to', 'article_id')
    onlyThreeComments = newComments.slice(0, 3)
    expect(formatArr(onlyThreeComments, objRef)).to.eql([{
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      article_id: 1,
      author: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    },
    {
      body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
      article_id: 1,
      author: 'icellusedkars',
      votes: 100,
      created_at: 1448282163389,
    }
    ])
  });
});