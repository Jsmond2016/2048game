var board = new Array()
var score =0

$(document).ready(function(){
    newgame()
})

function newgame(){
    //初始化棋盘
    init()
}

function init(){
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css({
                'top': getPosTop(i, j),
                'left': getPosLeft(i, j)
            });
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
}