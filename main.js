class Snake
{
    constructor (x, y, pressedKey, cellSize, context)
    {
        this.x = x;
        this.y = y;
        this.pressedKey = pressedKey;
        this.cellSize = cellSize;
        this.context = context;
        this.body = [];

        document.addEventListener('keyup', this.handleKeyUp.bind(this))
    }

    handleKeyUp(event) 
    {
        if (event.code === 'ArrowRight' || event.code === 'ArrowLeft' || event.code === 'ArrowUp' || event.code === 'ArrowDown') 
        {
            this.pressedKey = event.code;
        }
    }

    updateBody()
    {
        if (this.body.length > 0)
        {
            this.body.pop();
            this.addBody();
        }
    }

    addBody()
    {
        this.body.unshift(new Body(this.x, this.y, this.cellSize));
    }

    changeDirection(newpressedKey)
    {
        this.pressedKey = newpressedKey;
    }

    move()
    {
        if (this.pressedKey === 'ArrowRight') 
        {
            this.x += 1;
        } 
        else if (this.pressedKey === 'ArrowDown') 
        {
            this.y += 1;
        } 
        else if (this.pressedKey === 'ArrowLeft') 
        {
            this.x -= 1;
        } 
        else if (this.pressedKey === 'ArrowUp') 
        {
            this.y -= 1;
        }
    }

    draw()
    {
        this.context.fillStyle = 'yellow';
        this.context.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);

        //b wie body
        this.body.forEach(b => {
            this.context.fillStyle = 'black';
            this.context.fillRect(b.x * b.cellSize, b.y * b.cellSize, b.cellSize, b.cellSize);
        });
    }

    eatApple(apple)
    {
        return apple.x === this.x && apple.y === this.y;
    }

    eatSnake()
    {
        let gameOver = false;
        this.body.forEach(b => {
            if (b.x === this.x && b.y === this.y)
            gameOver = true;
        });
        return gameOver;
    }

    eatWall()
    {
        let gameOver = false;
        this.body.forEach(b => 
        {
            if (b.x < 0)
            {
                gameOver = true;
            }
            if (b.y < 0)
            {
                gameOver = true;
            }
            if (b.x > 8)
            {
                gameOver = true;
            }
            if (b.y > 8)
            {
                gameOver = true;
            }
        });
        return gameOver;
    }

    update()
    {
        let gameOver = false;
        gameOver = this.eatSnake() || this.eatWall();
        if (!gameOver)
        {
            if (this.eatApple(apple))
            {
                this.addBody();
                apple.newPosition();
            }
            this.updateBody();
            this.move();
        }
    }
}

class Body
{
    constructor(x, y, cellSize)
    {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
    }
}

class Apple
{
    constructor(cellSize, context)
    {
        this.x = Math.floor(Math.random() * 8);
        this.y = Math.floor(Math.random() * 8);
        this.cellSize = cellSize;
        this.context = context; 
    }

    newPosition()
    {
        this.x = Math.floor(Math.random() * 8);
        this.y = Math.floor(Math.random() * 8);
    }

    draw()
    {
        this.context.fillStyle = 'red';
        this.context.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);   
    }
}

class Game
{
    constructor(canvas, extent) 
    {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.extent = extent;
        this.cellSize = this.canvas.width / this.extent;
        
        this.snake = new Snake(0, 0, 'ArrowDown', this.cellSize, this.context, this.extent);
        this.apple = new Apple(this.cellSize, this.context, this.extent)
        
        setInterval(this.loop.bind(this), 250);   
    }

    drawLine(x1, y1, x2, y2) 
    {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
    
    drawGrid() 
    {
        for(let i = 1; i < this.extent; i++) 
        {
            this.drawLine(0, i * this.cellSize, this.canvas.width, i * this.cellSize);
            this.drawLine(i * this.cellSize, 0, i * this.cellSize, this.canvas.height);
        }
    }
    
    draw() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.apple.draw();
        this.snake.draw();
    }
    
    update() 
    {
        this.snake.update();
    }
    
    loop() {
        this.update();
        this.draw();
    }
}
new Game(document.getElementById('myCanvas'), 8)