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

  - 这其中，也封装了一些数据操作到其他函数中，我们一起来看看。

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

  ​





移动端优化

- 界面自适应

- 手势触控

  - `event.touches` 

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
     
     if (deltaX > 0) {
           //move right
          } else {
            //move left
       }
       if (deltaY > 0) {
           //move down
          } else {
            //move up
       }
     
    ```

  - 遇到问题：

    ​