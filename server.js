const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = mongodb.ObjectID;
const mongouri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.MONGOHOST;


// トップ画面
app.get('/', (req, res) => {
  if(req.cookies.user) {
    // console.log(req.cookies.user._id);
    res.sendFile(__dirname + '/views/success.html');
    return;
  }

  res.sendFile(__dirname + '/views/index.html');
});

// 登録画面
app.get('/signup', (req, res) => {
  if(req.cookies.user) {
    res.sendFile(__dirname + '/views/success.html');
    return;
  }

  res.sendFile(__dirname + '/views/signup.html');
});

// ログイン失敗画面
app.get('/failed', (req, res) => {
  if(req.cookies.user) {
    res.sendFile(__dirname + '/views/success.html');
    return;
  }

  res.sendFile(__dirname + '/views/failed.html');
});

app.get('/logout', (req, res) => {
  res.clearCookie('user'); // クッキーをクリア
  res.redirect('/');
});

app.post('/signup', function(req, res){
  const userName = req.body.userName;
  const password = req.body.password;
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const col = db.collection('accounts'); // 対象コレクション
    const user = {name: userName, password:password}; // 保存対象
    // ★★★本来パスワードは平文（入力されたそのままの文字列）で保存すべきではない
    // crypto モジュールでハッシュ化するなどすべき
    // ログインの際も入力されたパスワードをハッシュ化した上で
    // 保存されているハッシュ化済みのパスワードと比較する
    // 参考：https://qiita.com/kou_pg_0131/items/174aefd8f894fea4d11a
    col.insertOne(user, function(err, result) {
      res.redirect('/'); // リダイレクト
      client.close(); // DB を閉じる
    });
  });
});

app.post('/login', function(req, res){
  const userName = req.body.userName;
  const password = req.body.password;
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const col = db.collection('accounts'); // 対象コレクション

    // 登録時にパスワードをハッシュ化しているならば
    // ここで password をハッシュ化して検索する
    // ハッシュ化した値同士で比較する
    const condition = {name:{$eq:userName}, password:{$eq:password}}; // ユーザ名とパスワードで検索する
    col.findOne(condition, function(err, user){
      client.close();
      if(user) {
        res.cookie('user', user); // ヒットしたらクッキーに保存
        res.redirect('/'); // リダイレクト
      }else{
        res.redirect('/failed'); // リダイレクト
      }
    });
  });
});


// ハッシュ化用
const crypto = require('crypto');

function hashed(password) {
  let hash = crypto.createHmac('sha512', password)
  hash.update(password)
  let value = hash.digest('hex')
  return value;
}

const listener = app.listen(process.env.PORT);

// ここから書籍のやつ
app.get('/findBooks', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colBooks = db.collection('books'); // 対象コレクション

    // 検索条件（ここをユーザーidにする）
    // 条件の作り方： https://docs.mongodb.com/manual/reference/operator/query/
    // console.log(req.books.cat);
    const condition = {userid:{$eq:req.cookies.user._id}};

    colBooks.find(condition).toArray(function(err, books) {
      res.json(books); // レスポンスとしてユーザを JSON 形式で返却
      client.close(); // DB を閉じる
    });
  });
});

app.post('/saveBook', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colBooks = db.collection('books'); // 対象コレクション
      const books = JSON.parse(received); // 保存対象
      books.userid = req.cookies.user._id;
      colBooks.insertOne(books, function(err, result) {
        res.send(decodeURIComponent(result.insertedId)); // 追加したデータの ID を返す
        client.close(); // DB を閉じる
      });
    });
  });
});

app.post('/deleteBook', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colBooks = db.collection('books'); // 対象コレクション
      const target = JSON.parse(received); // 保存対象
      const oid = new ObjectID(target.id);

      colBooks.deleteOne({_id:{$eq:oid}}, function(err, result) {
        res.sendStatus(200); // ステータスコードを返す
        client.close(); // DB を閉じる
      });
    });
  });
});

// カテゴリー系
app.get('/findTasks', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colBooks = db.collection('tasks'); // 対象コレクション

    // 検索条件（ここをユーザーidにする）
    // 条件の作り方： https://docs.mongodb.com/manual/reference/operator/query/
    const condition = {userid:{$eq:req.cookies.user._id}};

    colBooks.find(condition).toArray(function(err, books) {
      res.json(books); // レスポンスとしてユーザを JSON 形式で返却
      client.close(); // DB を閉じる
    });
  });
});

app.post('/addTask', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colBooks = db.collection('tasks'); // 対象コレクション
      const tasks = JSON.parse(received); // 保存対象
      tasks.userid = req.cookies.user._id;
      colBooks.insertOne(tasks, function(err, result) {
        res.send(decodeURIComponent(result.insertedId)); // 追加したデータの ID を返す
        client.close(); // DB を閉じる
      });
    });
  });
});

app.post('/deleteTask', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colBooks = db.collection('tasks'); // 対象コレクション
      const target = JSON.parse(received); // 保存対象
      const oid = new ObjectID(target.id);

      colBooks.deleteOne({_id:{$eq:oid}}, function(err, result) {
        res.sendStatus(200); // ステータスコードを返す
        client.close(); // DB を閉じる
      });
    });
  });
});

app.get('/linkTask', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colBooks = db.collection('books'); // 対象コレクション

    // 検索条件（ここをユーザーidにする）
    // 条件の作り方： https://docs.mongodb.com/manual/reference/operator/query/
    // console.log(req.books.cat);
    console.log(req.query.catid);
    const condition = {userid:{$eq:req.cookies.user._id}, catid:{$eq:req.query.catid}};

    colBooks.find(condition).toArray(function(err, books) {
      res.json(books); // レスポンスとしてユーザを JSON 形式で返却
      client.close(); // DB を閉じる
    });
  });
});

app.get('/deleteTaskandBook', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colBooks = db.collection('books'); // 対象コレクション

    // 検索条件（ここをユーザーidにする）
    // 条件の作り方： https://docs.mongodb.com/manual/reference/operator/query/
    // console.log(req.books.cat);
    console.log(req.query.catid);
    const condition = {userid:{$eq:req.cookies.user._id}, catid:{$eq:req.query.catid}};

    colBooks.find(condition).toArray(function(err, books) {
      res.json(books); // レスポンスとしてユーザを JSON 形式で返却
      client.close(); // DB を閉じる
    });
  });
});