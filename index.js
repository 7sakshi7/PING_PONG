const canvas = document.getElementById('mycanvas');
const context = canvas.getContext("2d");

const width = 600;
const height = 400;

// rectangle 
canvas.width = 600;
canvas.height = 400;

// objects

// Ball Object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
};

// Paddle Object
const user1 = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
};

const user2 = {
    x: (canvas.width - 10),
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
};

// Net Object
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
};


// creating components

// creating rectangle
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// creating circle
function drawArc(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

}

// scores
function drawText(text, x, y) {
    context.fillStyle = "#FFF";
    context.font = "25px fantasy";
    context.fillText(text, x, y);
}

// creating net
function drawNet() {
    for (let i = 0; i <= height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(e){
    let rect = canvas.getBoundingClientRect();
    
    user1.y = e.clientY - rect.top - user1.height/2;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function update() {
    if( ball.x - ball.radius < 0 ){
        user2.score++;
        resetBall();
    }
    else if( ball.x + ball.radius > canvas.width){
        user1.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    user2.y += ((ball.y - (user2.y + user2.height/2)))*0.1;


    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    let player = (ball.x + ball.radius < canvas.width / 2) ? user1 : user2;

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;

    }

}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;    
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // draw text for left player
    drawText(user1.score, canvas.width / 4, canvas.height / 5);
    // drwa text for right player
    drawText(user2.score, canvas.width / 1.5, canvas.height / 5);

    drawNet();

    drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);

    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);


}
function game() {
    update();
    render();
}
// number of frames per second
let framePerSecond = 50;
// game();
//call the game function 50 times every 1 Sec
let loop = setInterval(game, 1000 / framePerSecond);