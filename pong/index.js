const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let gameOn = false;

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball {
    constructor(x, y, radius, color, velocity, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.angle = angle;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill()
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const playerWidth = 20;
const playerHeight = 100;
const playerMargin = 10;
const playerMoveSpeed = 20;

const ballSpeed = 5;
const ballRadius = 10;

const player1 = new Player(playerMargin, (canvas.height / 2) - playerHeight / 2, playerWidth, playerHeight, "blue");
const player2 = new Player((innerWidth - playerWidth) - playerMargin, (canvas.height / 2) - playerHeight / 2, playerWidth, playerHeight, "red");
player1.draw();
player2.draw();

const balls = []

// TESTING
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}
addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})
// TESTING

function animate() {
    requestAnimationFrame(animate)
    ctx.fillStyle = "rgba(0, 0, 0, .1";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    player1.draw();
    player2.draw();
    // balls[0].draw(); // test
    // balls[0].x = mouse.x; // test
    // balls[0].y = mouse.y; // test
    balls.forEach(ball => {
        ball.update();

        // Y axis

        if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {

            console.log("BOTTOM", ball.angle);

            const velocity = {
                x: ball.velocity.x,
                y: -ball.velocity.y
            }
            ball.velocity = velocity;
            // ball.velocity
        }

        // X axis
        if (ball.x + ball.radius >= player2.x + ballRadius &&
            ball.x - ball.radius <= player2.x + player2.width) {
            console.log("player 1 win")

        } else if (ball.x + ball.radius >= player1.x &&
            ball.x - ball.radius <= player1.x + player1.width - ballRadius) {
            console.log("player 2 win")

        } else if (ball.x + ball.radius >= player1.x &&
            ball.x - ball.radius <= player1.x + player1.width &&
            ball.y + ball.radius >= player1.y &&
            ball.y - ball.radius <= player1.y + player1.height) {
            // console.log("player 1 hit")

            let degrees = (ball.y - player1.y) / player1.height * 90 - 45;
            degrees = Math.abs(degrees) > 10 ? degrees : ~degrees + 1;
            const radians = degrees * Math.PI / 180;


            const angle = radians;
            const velocity = {
                x: Math.cos(angle) * ballSpeed,
                y: Math.sin(angle) * ballSpeed
            }
            ball.angle = angle;
            ball.velocity = velocity;

        } else if (ball.x + ball.radius >= player2.x &&
            ball.x - ball.radius <= player2.x + player2.width &&
            ball.y + ball.radius >= player2.y &&
            ball.y - ball.radius <= player2.y + player2.height) {
            // console.log("player 2 hit")

            let degrees = (ball.y - player2.y) / player2.height * 90 - 45;
            // degrees = Math.abs(degrees) > 10 ? degrees : 0;
            const radians = degrees * Math.PI / 180;

            const angle = radians;
            const velocity = {
                x: -Math.cos(angle) * ballSpeed,
                y: Math.sin(angle) * ballSpeed
            }
            ball.angle = angle;
            ball.velocity = velocity;

        }
    })
}

addEventListener("keydown", (event) => {
    if (!(event.key !== " " && gameOn === false)) {

        const angle = 0;

        const velocity = {
            x: -Math.cos(angle) * ballSpeed,
            y: -Math.sin(angle) * ballSpeed
        }

        if (event.key === " " && gameOn === false) {
            gameOn = true;
            balls.push(new Ball(canvas.width / 2, canvas.height / 2, ballRadius, "white", velocity, angle))
            animate();
        }

        if (event.key === "ArrowUp") {
            console.log("player 2 up")
            player2.y = player2.y - playerMoveSpeed;
            player2.draw();
        } else if (event.key === "ArrowDown") {
            console.log("player 2 down")
            player2.y = player2.y + playerMoveSpeed;
            player2.draw();

        } else if (event.key === "w") {
            console.log("player 1 up")
            player1.y = player1.y - playerMoveSpeed;
            player1.draw();

        } else if (event.key === "s") {
            console.log("player 1 down")
            player1.y = player1.y + playerMoveSpeed;
            player1.draw();

        }
    }
})