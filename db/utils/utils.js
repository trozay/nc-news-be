exports.convertTimeStamp = (arr) => {
  return arr.map(obj => {
    let newObj = {};
    newObj = Object.assign(newObj, obj);
    const date = new Date(obj.created_at);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    newObj.created_at = `${year}-${month}-${day}`;
    console.log(newObj.created_at)
    return newObj;
  })
};

exports.convertSingleTimeStamp = (timestamp) => {
  let newDate;
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  newDate = `${year}-${month}-${day}`;
  return newDate;
};

exports.createRef = (arr, key) => {
  let ref = {};
  for (let i = 0; i < arr.length; i++) {
    ref[arr[i][key]] = i + 1;
  }
  return ref;
};

exports.renameKeys = (arr, keyToChange, newKey) => {
  return arr.map(item => {
    const {
      [keyToChange]: oldKey, ...rest
    } = item;
    return {
      [newKey]: oldKey,
      ...rest
    };
  });
};

exports.formatArr = (arr, ref) => {
  return arr.map(item => {
    return {
      author: item.author,
      article_id: ref[item.article_id],
      votes: item.votes,
      created_at: item.created_at,
      body: item.body
    }
  });
};