const commentData = require('./db/data/test-data/comments');
const articleData = require('./db/data/test-data/articles');
const { renameKeys, createRef, formatArr } = require('./db/utils/utils');

const objRef = createRef(articleData, 'title')
const renamedComments = renameKeys(commentData, 'created_by', 'author');
const formattedComments = formatArr(renamedComments, objRef);

let count = 0;

for (let i = 0; i < articleData.length; i++) {
  if (articleData[i].topic === 'cooking') count++;
}

console.log(commentData.length)