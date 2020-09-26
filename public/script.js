window.onload = findBooks; // 画面ロード時に実行

const listArea = document.getElementById('list'); // リスト表示部

// 全データの取得
function findBooks() {
  const url = '/findBooks'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const books = JSON.parse(req.response);
      for(let i in books) {
        const book = books[i];

        const title = book.title;
        const price = book.price;
        const review = book.review;
        const id = book._id; // _id がユニークな ID

        addToList(title, price, review, id);
      }
    }
  }
  req.open('GET', url, true);
  req.send();
}

// データの追加
function addBook() {
  const url = '/addBook'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  // const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const review = document.getElementById('review').value;

  // 取得した情報をもとにオブジェクトを作る
  const book = {price:price, review:review};

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const id = req.response; // レスポンスから得た ID
      addToList(price, review, id);

      // 追加が成功したらフォームを空にする
      document.getElementById('price').value = '';
      document.getElementById('review').value = '';
    }
  }
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(book)); // オブジェクトを文字列化して送信
}

// データの保存
function saveBook() {
  const url = '/saveBook'; // 通信先
  const req = new XMLHttpRequest(); // 通信用オブジェクト

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const review = document.getElementById('review').value;

  // 取得した情報をもとにオブジェクトを作る
  const book = {title:title, price:price, review:review};

  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200) {
      const id = req.response; // レスポンスから得た ID
      addToList(title, price, review, id);

      // 追加が成功したらフォームを空にする
      document.getElementById('title').value = '';
      document.getElementById('price').value = '';
      document.getElementById('review').value = '';
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

function addToList(title, price, review, id) {
  const bookDiv = document.createElement('div'); // 追加する本の div 要素
  bookDiv.id = id; // レスポンスから得た ID を付与する
  bookDiv.style.width = '300px';
  bookDiv.style.margin = '20px 0px'; // 上下に 20 ピクセルのマージンを
  bookDiv.style.padding = '5px'; // 内側に余裕を
  bookDiv.style.backgroundColor = '#FFDD00'; // 背景色を明るめのオレンジに
  bookDiv.style.border = '1px solid black'; // 黒い枠を付ける
  bookDiv.style.borderRadius = '5px'; // 枠の角を少し丸く

  const titleSpan = document.createElement('span');
  titleSpan.innerText = title;
  titleSpan.style.fontSize = '20px';
  titleSpan.style.fontWeight = 'bold'; // 太字に
  titleSpan.style.display = 'inline-block';
  titleSpan.style.width = '200px';

  const priceSpan = document.createElement('span');
  priceSpan.innerText = '期限：' + price;

  const reviewDiv = document.createElement('div');
  reviewDiv.innerText = review;
  const delButton = document.createElement('button');
  delButton.innerText = '削除';
  delButton.onclick = function() {
    deleteBook(id); // レスポンスから得た ID を利用して削除
  }

  bookDiv.appendChild(titleSpan); // bookDiv にタイトルを追加
  bookDiv.appendChild(priceSpan); // bookDiv に値段を追加
  bookDiv.appendChild(reviewDiv); // bookDiv に感想を追加
  bookDiv.appendChild(delButton);// bookDiv に削除ボタンを追加
  listArea.appendChild(bookDiv); // リストに bookDiv を追加
}
