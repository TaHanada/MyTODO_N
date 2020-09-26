(function(){
    'use strict';
    var header = document.getElementById('header');
    var deg = 0;
    function rotateHeader() {
        deg = deg + 6;
        deg = deg % 360;
        // 表裏で色を変えるために表面と裏面のclassNameを変更する
        // classNameはcssを見たら分かる
        if ((0 <= deg && deg < 90) || (270 <= deg && deg < 360)) {
            header.className = 'face';
        } else {
            header.className = 'back';
        }
        // x軸にdeg度回転
        header.style.transform = 'rotateX(' + deg + 'deg)';
    }
    // 20msごとに呼び出し
    setInterval(rotateHeader, 20);
})();