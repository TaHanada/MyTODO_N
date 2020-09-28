window.onload = findTasks; // 画面ロード時に実行

const listArea = document.getElementById('list'); // リスト表示部

// const list2Area = document.getElementById('listmain');
// const categoryArea = document.getElementById('category');

// 全データの取得
function findTasks() {
  const url = '/findTasks'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const tasks = JSON.parse(req.response);
      for(let i in tasks) {
        const task = tasks[i];

        const cat = task.cat;
        
        const id = task._id; // _id がユニークな ID

        addToTaskList(cat, id);
        sample(id);
        numberTask(id, cat);
      }
    }
  }
  req.open('GET', url, true);
  req.send();
}

function findBooks() {
  const url = '/findBooks'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const books = JSON.parse(req.response);
      for(let i in books) {
        const book = books[i];

        const cat = book.cat;
        const price = book.price;
        const review = book.review;
        const id = book._id; // _id がユニークな ID

        addToList(cat, price, review, id);
      }
    }
  }
  req.open('GET', url, true);
  req.send();
}

// データの追加
function addTask() {
  const url = '/addTask'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  const cat = document.getElementById('cat').value;
  // const catid = cat.getAttribute('cat-id');
  // 入力が空なら戻り値０で処理を終了する
  if (cat.length === 0) {
    return;
  }
  
  // 2回目以降の入力対策
  removeAllChildren(document.getElementById('category'));
  removeAllChildren(document.getElementById('listmain'));
  // removeAllChildren(listArea);
  
  // 取得した情報をもとにオブジェクトを作る
  // const task = {cat:cat, catid:catid};
  const task = {cat:cat}

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      // console.log(req.response);
      const id = req.response; // レスポンスから得た ID
      addToTaskList(cat, id);

      // 追加が成功したらフォームを空にする
      document.getElementById('cat').value = '';
    }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(task)); // オブジェクトを文字列化して送信
}

// データの保存
function saveBook() {
  const url = '/saveBook'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  const cat = document.getElementById('category');
  const catid = cat.getAttribute('cat-id');
  const cattext = cat.innerText;
  console.log(catid);
  const price = document.getElementById('price').value;
  const review = document.getElementById('review').value;
  
  // 空なら戻り値０で処理を終了
  if (price.length === 0 || review.length === 0) {
    return;
  }
  
  // 2回目以降の入力対策
  // removeAllChildren(document.getElementById('listmain'));
  
  // 取得した情報をもとにオブジェクトを作る
  const book = {catid:catid, price:price, review:review};

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const id = req.response; // レスポンスから得た ID
      addToList(cattext, price, review, catid, id);

      // 追加が成功したらフォームを空にする
      // document.getElementById('cat').value = '';
      document.getElementById('price').value = '';
      document.getElementById('review').value = '';
      numberTask(catid, cattext);
    }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(book)); // オブジェクトを文字列化して送信
}

function deleteTask(id) {
  const url = '/deleteTask'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  const book = {id:id};

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const target = document.getElementById(id); // ID で要素を特定
      target.parentNode.removeChild(target); // 親要素に自分を削除させる
    }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(book)); // オブジェクトを文字列化して送信
}

function deleteBook(id) {
  const url = '/deleteBook'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  const book = {id:id};

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const target = document.getElementById(id); // ID で要素を特定
      target.parentNode.removeChild(target); // 親要素に自分を削除させる
    }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(book)); // オブジェクトを文字列化して送信
}

function addToList(cat, price, review, catid, id) {
  removeAllChildren(document.getElementById('category'));
  const taskDiv = document.createElement('div'); // 追加する本の div 要素
  taskDiv.id = catid; // レスポンスから得た ID を付与する
  taskDiv.style.width = '300px';
  taskDiv.style.margin = '10px 0px'; // 上下に 10 ピクセルのマージンを
  taskDiv.style.padding = '2.5px'; // 内側に余裕を
  taskDiv.style.backgroundColor = 'white'; // 背景色を
  taskDiv.style.border = '1px solid black'; // 黒い枠を付ける
  taskDiv.style.borderRadius = '5px'; // 枠の角を少し丸く
  
  const titleSpan = document.createElement('span');
  titleSpan.id = 'title';
  titleSpan.innerText = cat;
  titleSpan.style.fontSize = '20px';
  titleSpan.style.fontWeight = 'bold'; // 太字に
  titleSpan.style.display = 'inline-block';
  titleSpan.style.width = '200px';
  let categoryElement = document.getElementById('category');
  categoryElement.setAttribute("cat-id", catid);
  taskDiv.appendChild(titleSpan); // bookDiv にタイトルを追加
  categoryElement.appendChild(taskDiv);
  
  const bookDiv = document.createElement('div'); // 追加する本の div 要素
  bookDiv.id = id; // レスポンスから得た ID を付与する
  bookDiv.style.width = '300px';
  bookDiv.style.margin = '20px 0px'; // 上下に 20 ピクセルのマージンを
  bookDiv.style.padding = '5px'; // 内側に余裕を
  bookDiv.style.backgroundColor = '#FFDD00'; // 背景色を明るめのオレンジに
  bookDiv.style.border = '1px solid black'; // 黒い枠を付ける
  bookDiv.style.borderRadius = '5px'; // 枠の角を少し丸く

  const priceSpan = document.createElement('span');
  priceSpan.innerText = '期限：' + price;

  const reviewDiv = document.createElement('div');
  reviewDiv.innerText = review;
  const delButton = document.createElement('button');
  delButton.innerText = '削除';
  delButton.onclick = function() {
    deleteBook(id); // レスポンスから得た ID を利用して削除
    numberTask(catid, cat);
  }
  
  bookDiv.appendChild(priceSpan); // bookDiv に値段を追加
  bookDiv.appendChild(reviewDiv); // bookDiv に感想を追加
  bookDiv.appendChild(delButton);// bookDiv に削除ボタンを追加
  document.getElementById('listmain').appendChild(bookDiv); // リストに bookDiv を追加
}

function addToTaskList(cat, id) {
  console.log(id);
  removeAllChildren(document.getElementById('category'));
  const taskDiv = document.createElement('div'); // 追加する本の div 要素
  taskDiv.id = id; // レスポンスから得た ID を付与する
  taskDiv.style.width = '300px';
  taskDiv.style.margin = '10px 0px'; // 上下に 10 ピクセルのマージンを
  taskDiv.style.padding = '2.5px'; // 内側に余裕を
  taskDiv.style.backgroundColor = 'white'; // 背景色を
  taskDiv.style.border = '1px solid black'; // 黒い枠を付ける
  taskDiv.style.borderRadius = '5px'; // 枠の角を少し丸く

  const titleSpan = document.createElement('span');
  titleSpan.id = 'title';
  titleSpan.innerText = cat;
  titleSpan.style.fontSize = '20px';
  titleSpan.style.fontWeight = 'bold'; // 太字に
  titleSpan.style.display = 'inline-block';
  titleSpan.style.width = '200px';
  
  let categoryElement = document.getElementById('category');
  categoryElement.setAttribute("cat-id", id);
  
  taskDiv.appendChild(titleSpan); // bookDiv にタイトルを追加
  categoryElement.appendChild(taskDiv);
  
  // リストに listDiv を追加
  const listDiv = document.createElement('div'); // 追加する本の div 要素
  listDiv.id = id; // レスポンスから得た ID を付与する
  listDiv.style.width = '300px';
  listDiv.style.margin = '20px 0px'; // 上下に 10 ピクセルのマージンを
  listDiv.style.padding = '5px'; // 内側に余裕を
  listDiv.style.backgroundColor = 'yellow'; // 背景色を明るめのオレンジに
  listDiv.style.border = '1px solid black'; // 黒い枠を付ける
  listDiv.style.borderRadius = '5px'; // 枠の角を少し丸く

  const catSpan = document.createElement('span');
  catSpan.innerText = cat;
  catSpan.style.fontSize = '20px';
  catSpan.style.fontWeight = 'bold'; // 太字に
  catSpan.style.display = 'inline-block';
  catSpan.style.width = '200px';
  
  const numberSpan = document.createElement('span');
  numberSpan.innerText = "残りタスク：0";
  numberSpan.style.fontSize = '12px';
  numberSpan.style.display = 'inline-block';
  numberSpan.style.width = '120px';
  
  const delButton2 = document.createElement('button');
  delButton2.innerText = '削除';
  delButton2.onclick = function() {
    deleteTaskandBook(id);
    //twitter(cat);
  }
  
  let catElement = document.getElementById('list');
  catElement.setAttribute("cat-id", id);
  catElement.appendChild(listDiv);
  listDiv.value = cat;
  
  listDiv.onclick = function() {
    linkTask(id, cat);
  }
  
  listDiv.appendChild(catSpan); // bookDiv にタイトルを追加
  listDiv.appendChild(numberSpan);
  listDiv.appendChild(delButton2);
  document.getElementById('list').appendChild(listDiv);
}

// 何回もクリックしても子要素が増え続けないように削除する
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
    }
}

// 左側のタスク押したら右側にTODOを出力する
function linkTask(catid, cat) {
  const url = '/linkTask?catid=' + catid; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト
  
  // 2回目以降の入力対策
  // removeAllChildren(document.getElementById('category'));
  removeAllChildren(document.getElementById('listmain'));
  // removeAllChildren(listArea);
  
  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const books = JSON.parse(req.response);
      for(let i in books) {
        const book = books[i];

        const price = book.price;
        const review = book.review;
        const id = book._id; // _id がユニークな ID

        addToList(cat, price, review, catid, id);
      }
    }
  }
  req.open('GET', url, true);
  req.send();
}

// タスク数を管理したい
function numberTask(catid, cat) {
  const url = '/linkTask?catid=' + catid; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト
  
  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const books = JSON.parse(req.response);
      const number = books.length;
      console.log(number);
      changeTaskList(cat, catid, number);
    }
  }
  req.open('GET', url, true);
  req.send();
}

function changeTaskList(cat, id, number) {
  let delNode = document.getElementById(id);
  delNode.parentNode.removeChild(delNode);
  const listDiv = document.createElement('div'); // 追加する本の div 要素
  listDiv.id = id; // レスポンスから得た ID を付与する
  listDiv.style.width = '300px';
  listDiv.style.margin = '20px 0px'; // 上下に 10 ピクセルのマージンを
  listDiv.style.padding = '5px'; // 内側に余裕を
  listDiv.style.backgroundColor = 'yellow'; // 背景色を明るめのオレンジに
  listDiv.style.border = '1px solid black'; // 黒い枠を付ける
  listDiv.style.borderRadius = '5px'; // 枠の角を少し丸く

  const catSpan = document.createElement('span');
  catSpan.innerText = cat;
  catSpan.style.fontSize = '20px';
  catSpan.style.fontWeight = 'bold'; // 太字に
  catSpan.style.display = 'inline-block';
  catSpan.style.width = '200px';
  
  const numberSpan = document.createElement('span');
  numberSpan.innerText = "残りタスク：" + number;
  numberSpan.style.fontSize = '12px';
  numberSpan.style.display = 'inline-block';
  numberSpan.style.width = '120px';
  
  const delButton2 = document.createElement('button');
  delButton2.innerText = '削除';
  delButton2.onclick = function() {
    deleteTaskandBook(id); // レスポンスから得た ID を利用して削除
    //twitter(cat);
  }
  let catElement = document.getElementById('list');
  catElement.setAttribute("cat-id", id);
  catElement.appendChild(listDiv);
  listDiv.value = cat;
  
  listDiv.onclick = function() {
    linkTask(id, cat);
  }
  
  listDiv.appendChild(catSpan); // bookDiv にタイトルを追加
  listDiv.appendChild(numberSpan);
  listDiv.appendChild(delButton2);
  listArea.appendChild(listDiv);
}

// カテゴリー削除で関連するタスクも全て削除する
function deleteTaskandBook(catid) {
  const url = '/deleteTaskandBook?catid=' + catid; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト
  
  deleteTask(catid);
  // 2回目以降の入力対策
  // removeAllChildren(document.getElementById('listmain'));
  // removeAllChildren(listArea);
  
  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const books = JSON.parse(req.response);
      for(let i in books) {
        const book = books[i];
        const id = book._id; // _id がユニークな ID
        sample(catid);
        deleteBook(id);
        console.log(document.getElementById('title').innerText);
        // addToList(cat, price, review, catid, id);
      }
    }
  }
  req.open('GET', url, true);
  req.send();
}

function sample(id) {
  removeAllChildren(document.getElementById('category'));
  const taskDiv = document.createElement('div'); // 追加する本の div 要素
  taskDiv.id = id; // レスポンスから得た ID を付与する
  taskDiv.style.width = '300px';
  taskDiv.style.margin = '10px 0px'; // 上下に 10 ピクセルのマージンを
  taskDiv.style.padding = '2.5px'; // 内側に余裕を
  taskDiv.style.backgroundColor = 'white'; // 背景色を
  taskDiv.style.border = '1px solid black'; // 黒い枠を付ける
  taskDiv.style.borderRadius = '5px'; // 枠の角を少し丸く

  const titleSpan = document.createElement('span');
  titleSpan.id = 'title';
  titleSpan.innerText = ' ';
  titleSpan.style.fontSize = '20px';
  titleSpan.style.fontWeight = 'bold'; // 太字に
  titleSpan.style.display = 'inline-block';
  titleSpan.style.width = '200px';
  
  let categoryElement = document.getElementById('category');
  categoryElement.setAttribute("cat-id", id);
  
  taskDiv.appendChild(titleSpan); // bookDiv にタイトルを追加
  categoryElement.appendChild(taskDiv);
}

// Twitter連携
function twitter(result) {
  const tweetDivided = document.getElementById('tweet-area');
  removeAllChildren(tweetDivided);
  const anchor = document.createElement('a');
  const hrefValue = "https://twitter.com/intent/tweet?button_hashtag=進捗報告&ref_src=twsrc%5Etfw";
  anchor.setAttribute('href', hrefValue);
  anchor.setAttribute('class', "twitter-hashtag-button");
  anchor.setAttribute('data-text', result+"内のTODOを全て完了！偉い");
  anchor.setAttribute('data-show-count', false);
  // anchor.className = 'twitter-hashtag-button';
  anchor.innerText = 'Tweet #進捗報告';
  tweetDivided.appendChild(anchor);

  //twttr.widgets.load(tweetDivided);
}