# 2048 小游戏

> 如果你不懂这个游戏规则，请[试玩该游戏](http://gabrielecirulli.github.io/2048/)

![](http://p7mnxf7o4.bkt.clouddn.com/Selection_099.png)



## 开发流程

- 界面初始化
- 基本逻辑实现 【难点】
- 动画实现
- 游戏得分
- 移动端适配和优化



## 具体过程

### 界面初始化

- 主要为 4*4 的16个方格，我们使用 `div` 来实现。

```html
    <div id="grid-container">
        <div class="grid-cell" id="grid-cell-0-0"></div>
        <div class="grid-cell" id="grid-cell-0-1"></div>
        <div class="grid-cell" id="grid-cell-0-2"></div>
        <div class="grid-cell" id="grid-cell-0-3"></div>

        <div class="grid-cell" id="grid-cell-1-0"></div>
        <div class="grid-cell" id="grid-cell-1-1"></div>
        <div class="grid-cell" id="grid-cell-1-2"></div>
        <div class="grid-cell" id="grid-cell-1-3"></div>

        <div class="grid-cell" id="grid-cell-2-0"></div>
        <div class="grid-cell" id="grid-cell-2-1"></div>
        <div class="grid-cell" id="grid-cell-2-2"></div>
        <div class="grid-cell" id="grid-cell-2-3"></div>

        <div class="grid-cell" id="grid-cell-3-0"></div>
        <div class="grid-cell" id="grid-cell-3-1"></div>
        <div class="grid-cell" id="grid-cell-3-2"></div>
        <div class="grid-cell" id="grid-cell-3-3"></div>
    </div>
```

- 基础的 `CSS` 样式

```css
#grid-container{
	width:460px;
	height: 460px;
	padding: 20px;
	margin: 10px auto;
	background-color: #bbada0;
	border-radius:10px;
	position: relative;
}
.grid-cell{
	width: 100px;
	height: 100px;
	border-radius: 6px;
	background-color: #ccc0b3;
	position: absolute;
}

```

- 动态样式变化

(1) 盘格边距：

即每个盘格的上下左右边距，我们使用 `jQuery` 来实现

```js
 for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css({
                'top': getPosTop(i, j),
                'left': getPosLeft(i, j)
            });
        }
    }
```

（2）盘格内的  `number-cell` 

同样，因为每次开始游戏都是不同的盘格有动态数字的变化，同时还有一点动画的效果，此时使用 `jQuery`  动态插入 `HTML` 的方式来实现。

```js
 // ...核心代码如下
 
 for (var j = 0; j < 4; j++) {
       var id = "number-cell-" + i + "-" + j;
       $("#grid-container").append("<div class='number-cell' id=" + id + "></div>");
       var theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] === 0) {
                theNumberCell.css({
                    "width": "0",
                    "height": "0",
                    "top": getPosTop(i, j) + cellSideLength / 2,
                    "left": getPosLeft(i, j) + cellSideLength / 2
                });
            }else{
        //  ...此处省略部分代码         
            }
       }
```



###   基本逻辑实现

- 核心逻辑

  因为这个游戏比较简单，涉及的数据比较少，因此没有使用到数据库。

  而这个游戏的整个核心，也就是数据变化的核心，要使用到**二维数组**，和初始化界面一一对应

  (1)  `board` :  记录每个数据的位置和初始值

  (2) `hasConflicted`  : 记录**每个位置的数字是否只进行了一次叠加**，例如其中一行的数字为`2,2,4,8`，按下左键以后的数字为`4,4,8`；如果不是进行一次叠加，最后的结果为16，这是不符合游戏规则的

![](http://p7mnxf7o4.bkt.clouddn.com/Selection_100.png)

​	(3) 在游戏中，实际上我们的操作流程是：使用按键（或者手势），操作数组内数据的变化，然后根据新的数据重新渲染页面实现更新视图

![](http://p7mnxf7o4.bkt.clouddn.com/Selection_101.png)

- 具体流程

  > 我们选择一个方向的操作来举例，因为其他方向的操作逻辑也是相似

  （1） 首先，对具体的按键进行监听，比如，按下**上键** ，他会涉及到以下操作：

  - 判断每个空格上面的位置是否为空？或者是上下两个盘格是否相等，其中，需要注意的一点是，第一行的每个盘格不需要检查上一个盘格的信息，因为其上面灭有盘格。

    ```js
    function canMoveUp(board) {
        for (var i = 1; i < 4; i++) { //第一行不能上移，不用判断
            for (var j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                        return true;
                    }
                }

            }
        }
        return false;
    }
    ```

  - 其次，进行对数组内的信息进行操作，操作过称为

    （1）空位上移：
    纵向数据比较，判断中间是否有空的数据 `noBlockVertical()` ，以及最上面的盘格数字是否为空，如果都没有的话，最上面的数字被下面的盘格内的数字所替换

      (2) 数据累加和位置上移：
    纵向数据比较，判断上下两个盘格的数字是否相等，中间是否有空的数据，以及该盘格之前是否有过一次叠加操作

    如果没有，上面的盘格为数据叠加之和，下面的盘格内数据为0不显示，同时设置叠加状态为`false` ，避免重复叠加。

    同时，设置 `score` 的分数为`score与`叠加之后的盘格的数之和

    ​

    ```js
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {

                if (board[i][j] !== 0) {
                    for (var k = 0; k < i; k++) {
                        if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            break;

                        } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateScore(score);
                            hasConflicted[k][j] = true;
                            break;
                        }
                    }
                }

            }
        }
    ```

(2) 游戏结束逻辑

当盘格内没有空盘格且不能移动时，游戏结束

```js
function isGameOver() {
    if (nospace(board) && nomove(board)) {
        showGameOver();
    }
}
```

```js
// 不能继续移动
function nomove(board) {
  if(canMoveLeft(board)||canMoveRight(board)||canMoveUp(board)||canMoveDown(board)){
      return false;
    }
    return true;
}
```

````js
// 没有空余盘格
function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}
````

  - 除了上述操作以外，也封装了一些数据操作到其他函数中，我们一起来看看。

    数据变化后动画的呈现

  ```js
  function showMoveAnimation(fromx,fromy,tox,toy) {
      var  numberCell=$("#number-cell-"+fromx+"-"+fromy);
      numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
      },100);
  }
  ```

  判断纵向盘格的上面是否都为空盘格

  ```js
  function noBlockVertical(i, k, j, board) {
      for (k = k + 1; k < j; k++) {
          if (board[k][i] !== 0) {
              return false;
          }
      }
      return true;
  }
  ```

  设置每个盘格在每次操作时只能被叠加一次，是否可叠加状态存入数组中

  ```js
  //初始化盘格数据
      for (var i = 0; i < 4; i++) {
          board[i] = new Array();
          hasConflicted[i] = new Array();
          for (var j = 0; j < 4; j++) {
              board[i][j] = 0;
              hasConflicted[i][j] = false;
          }
      }

  ```

  - 动画效果，使用到的是 `jQuery.animate` 这个API

    具体[使用](http://www.runoob.com/jquery/eff-animate.html) : `(selector).animate({styles},speed,easing,callback)`

  过渡动画一：数字变化动画

  ```js
  function showNumberWithAnimation(i,j,randNum){
  	var numberCell=$("#number-cell-"+i+"-"+j);
  	numberCell.css({
  		"background-color":getNumberBackgroundColor(randNum),
  		"color":getNumberColor(randNum),
  	});
  	numberCell.text(randNum);
  	numberCell.animate({
  		width: cellSideLength,
  		height: cellSideLength,
  		'line-height': cellSideLength,
  		left: getPosLeft(i,j),
  		top: getPosTop(i,j)
  	},50);
  }
  ```

  过渡动画二： 位置移动变化动画

  ```js
  function showMoveAnimation(fromx,fromy,tox,toy) {
      var  numberCell=$("#number-cell-"+fromx+"-"+fromy);
      numberCell.animate({
        top: getPosTop(tox,toy),
        left: getPosLeft(tox,toy)
      },100);
  }
  ```

  过渡动画三：得分数字变化

  ```js
  function updateScore(score){
  	$("#score").text(score);
  	$("#score").animate({
  		'font-size': '1.2em',
  	},50,()=>{
  		$("#score").animate({
  			'font-size': '1em',
  		},50)
  	})
  }

  ```

 

移动端优化

- 界面自适应

（1）要支持移动端，第一步： 添加 `meta:vp` 在 `index` 页面中，避免用户对网页进行缩放

`    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">`

(2) 其次，要使得我们的页面和不同像素的手机相匹配，能够正常浏览和使用，此时，沃恩的布局就不能够使用固定值布局，而是使用 百分比布局。

```js
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92*documentWidth;
cellSideLength = 0.18*documentWidth;
cellSpace = 0.04*documentWidth;

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    var $gridContainer = $("#grid-container");
    var $gridCell = $(".grid-cell");
    $gridContainer.css({
        "width": gridContainerWidth - 2 * cellSpace,
        "height": gridContainerWidth - 2 * cellSpace,
        "padding": cellSpace,
        "border-radius": 0.02 * gridContainerWidth
    });
    $gridCell.css({
        "width": cellSideLength,
        "height": cellSideLength,
        "line-height": gridContainerWidth - 2 * cellSpace,
        "border-radius": 0.02 * gridContainerWidth
    });

}
```

（3）动态增加的 `number-cell` 位置和边距设置

```js

function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var id = "number-cell-" + i + "-" + j;
            $("#grid-container").append("<div class='number-cell' id=" + id + "></div>");
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] === 0) {
                theNumberCell.css({
                    "width": "0",
                    "height": "0",
                    "top": getPosTop(i, j) + cellSideLength / 2,
                    "left": getPosLeft(i, j) + cellSideLength / 2
                });

            } else {
                theNumberCell.css({
                    "width": cellSideLength,
                    "height": cellSideLength,
                    "top": getPosTop(i, j),
                    "left": getPosLeft(i, j),
                    "backgroundColor": getNumberBackgroundColor(board[i][j]),
                    "color": getNumberColor(board[i][j])
                });

                if (board[i][j] > 1000) {
                    theNumberCell.css({
                        "line-height": cellSideLength + "px",
                        "height": cellSideLength + "px",
                        "font-size": 0.4 * cellSideLength + "px"
                    });
                } else {
                    theNumberCell.css({
                        "line-height": cellSideLength + "px",
                        "height": cellSideLength + "px",
                        "font-size": 0.6 * cellSideLength + "px"
                    });
                }
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
}
```



- 手势触控

  - `event.touches` 获得多点触控的信息，项目中我们使用到的只是单点触控，因此使用`event.touches[0]` 

    使用到其中的2个 API ，分别为 `event.touches[0].pageX` 和 `event.touches[0].pageY`

    ```js
     //手势开始坐标
     startx = event.touches[0].pageX;
     starty = event.touches[0].pageY;
     //手势结束坐标
     endx = event.changedTouches[0].pageX;
     endy = event.changedTouches[0].pageY;
     //判断手势移动方向
     var deltaX = endx - startx;
     var deltaY = endy - starty;
     
    // 比较绝对值，判断用户的手势是在哪个方向上滑动
     if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            if (deltaX > 0) {
                //move right
            } else {
                //move left
            }
        } else {
            if (deltaY > 0) {
                //move down
            } else {
                //move up
            }
        }
     
    ```

  - 一些其他细节

  （1）在随机生成找到空位和填充随机数时，需要注意一个问题


```js
function generateOneNumber() {

    if (nospace(board)) {
        return false;
    }
    //随机找到一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (true) {
        if (board[randx][randy] === 0) {
            break;
        }
        randx = Math.floor(Math.random() * 4);
        randy = Math.floor(Math.random() * 4);
        times++;
    }

    var randNumber = Math.random() > 0.5 ? 2 : 4;
    //在随机位置显示随机字符
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;

}
```

这其中，使用到了一个 `while(true){code...}` 的循环来不断查找是否有空的的位置，在这里使用 `while(true)` 是不太可取的，因为这个一直查找到过程中，一方面会比较消耗性能，一方面可能会等待很久的时间，因此，我们把它改写成

```js
function generateOneNumber() {

    if (nospace(board)) {
        return false;
    }
    //随机找到一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) { // 最多只允许查找50次
        if (board[randx][randy] === 0) {
            break;
        }
        randx = Math.floor(Math.random() * 4);
        randy = Math.floor(Math.random() * 4);
        times++;
    }
    //随机查找空位失败后手动查找
    if (times === 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    randx = i;
                    randy = j;
                    j = 4;
                    i = 4;
                }
            }
        }
    }
    //随机一个数字
    var randNumber = Math.random() > 0.5 ? 2 : 4;
    //在随机位置显示随机字符
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;

}
```

设置最多只允许它查找50次，如果过了就手动设置这个随机位置

（2）在移动端使用的时候，可能会遇到一个小问题，即不小心触发 `touchmove` 事件，因此，我们需要对它进行处理

```js
document.addEventListener("touchmove", function(event) {
    event.preventDefault();
});
```



参考资料：

- [touches-js](https://segmentfault.com/q/1010000002870710)
- [Animate-jQuery](http://www.w3school.com.cn/jquery/effect_animate.asp)
- [2048小游戏-慕课网](https://www.imooc.com/learn/76)