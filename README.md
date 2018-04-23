# 2048 小游戏

> 如果你不懂这个游戏规则，请[试玩该游戏](http://gabrielecirulli.github.io/2048/)

![](http://p7mnxf7o4.bkt.clouddn.com/Selection_099.png)



## 开发流程

- 界面初始化
- 基本逻辑实现
- 动画实现
- 游戏得分



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

  (2) `hasConflicted`  : 记录每个位置的数字是否显示

![](http://p7mnxf7o4.bkt.clouddn.com/Selection_100.png)

![](http://p7mnxf7o4.bkt.clouddn.com/Selection_101.png)