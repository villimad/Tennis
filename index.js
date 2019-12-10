const getStyle = function (e, styleName) {
    let styleValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle) {
        styleValue = document.defaultView.getComputedStyle(e, "").getPropertyValue(styleName);
    }
    else if(e.currentStyle) {
        styleName = styleName.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        styleValue = e.currentStyle[styleName];
    }
    return styleValue;
};

let leftDesc = document.getElementsByClassName(' leftDesc')[0];
let rightDesc = document.getElementsByClassName('rightDesc')[0];
let place = document.getElementsByClassName('place')[0];
let placeHeight = parseInt(getStyle(place, 'height'));
let placeWidth = parseInt(getStyle(place, 'width'));
let descHeight = parseInt(getStyle(rightDesc, 'height'));
let descWidth = parseInt(getStyle(rightDesc, 'width'));

let speed = 10;

let pressed = new Set();

//move desc
document.addEventListener('keydown', function (e) {
    pressed.add(e.key);
});

document.addEventListener('keyup', function (e) {
    pressed.delete(e.key);
});

function moveDesc(e) {
    //right player
    switch (e) {
        case "ArrowDown": {
            let styleValue = parseInt(getStyle(rightDesc, 'margin-top'));
            if (styleValue === placeHeight - descHeight){
                break
            }
            styleValue = styleValue + speed + 'px';
            rightDesc.style.marginTop = styleValue;
            break;
        }
        case "ArrowUp": {
            let styleValue = parseInt(getStyle(rightDesc, 'margin-top'));
            if (styleValue === 0) {
                break;
            }
            styleValue = styleValue - speed + 'px';
            rightDesc.style.marginTop = styleValue;
            break;
        }
    }

    //left player
    switch (e) {
        case "s" || "ы": {
            let styleValue = parseInt(getStyle(leftDesc, 'margin-top'));
            if (styleValue === placeHeight - descHeight){
                break
            }
            styleValue = styleValue + speed + 'px';
            leftDesc.style.marginTop = styleValue;
            break;
        }
        case "w" || "ц": {
            let styleValue = parseInt(getStyle(leftDesc, 'margin-top'));
            if (styleValue === 0) {
                break;
            }
            styleValue = styleValue - speed + 'px';
            leftDesc.style.marginTop = styleValue;
            break;
        }
    }
}

setInterval(function () {
    for (let item of pressed){
        moveDesc(item)
    }
}, 20);


//move ball


/*
vector fly ball
4 - 10 position

Переворот вектора после удара мяча о ребро доски

Поворот вектора о край поля
 */

let ball = document.getElementsByClassName('ball')[0];
let ballHeight = parseInt(getStyle(ball, "height"));
let vectorBall = {
    X: -10,
    Y: 0,
};

let diffSpeed = {
    X: 10,
    Y: 5
};

const getDescCords = function (e) {
    return {
        Y: parseInt(getStyle(e, 'margin-top')) + descHeight / 2,
        Y1: parseInt(getStyle(e, 'margin-top')),
        Y2: parseInt(getStyle(e, 'margin-top')) + descHeight,
    }
};

const getBallCords = function () {
    let cordsY = parseInt(getStyle(ball, 'margin-top')) + ballHeight / 2;
    let cordsX = parseInt(getStyle(ball, 'margin-left')) + ballHeight / 2;
    return {
        X: cordsX,
        Y: cordsY
    }
};

const hit = function () {
    let cordsBall = getBallCords();

    function diffMoveDesc(cordsDesc) {
        vectorBall.X = - vectorBall.X;
        if (
            (cordsBall.Y <= cordsDesc.Y1 + descHeight/3)
        ) {
            vectorBall.Y -= diffSpeed.Y
        }else if (
            (cordsBall.Y > cordsDesc.Y1 + descHeight/3) &&
            (cordsBall.Y < cordsDesc.Y1 + descHeight * 2 / 3)
        ){

        }else if (
            (cordsBall.Y > cordsDesc.Y1 + descHeight * 2 / 3)
        ){
            vectorBall.Y += diffSpeed.Y
        }
        console.log('Удар');
    }


    //left desc
    if (vectorBall.X < 0) {
        let cordsDesc = getDescCords(leftDesc);
        if (
            (cordsBall.X === descWidth + ballHeight / 2) &&
            ((cordsBall.Y >= cordsDesc.Y1) && (cordsBall.Y <= cordsDesc.Y2))
        ) {
            diffMoveDesc(cordsDesc);
        }

        if (
            (cordsBall.Y === ballHeight / 2) ||
            (cordsBall.Y === placeHeight - ballHeight / 2)
        ){
            vectorBall.Y = -vectorBall.Y
        }

        if (cordsBall.X <= 0){
            document.getElementsByClassName('playerR')[0].innerHTML =
                parseInt(document.getElementsByClassName('playerR')[0].innerHTML) + 1;
            ball.style.marginLeft = placeWidth/2 + 'px';
            ball.style.marginTop = placeHeight/2 + 'px';
            vectorBall.X  = -vectorBall.X;
            vectorBall.Y = 0;
            return false;
        }

    }

    //right desc
    if (vectorBall.X > 0) {
        let cordsDesc = getDescCords(rightDesc);
        if (
            (cordsBall.X === placeWidth - descWidth - ballHeight / 2) &&
            ((cordsBall.Y >= cordsDesc.Y1) && (cordsBall.Y <= cordsDesc.Y2))
        ) {
            diffMoveDesc(cordsDesc);
        }
        if (
            (cordsBall.Y === ballHeight / 2) ||
            (cordsBall.Y === placeHeight - ballHeight / 2)
        ){
            vectorBall.Y = -vectorBall.Y
        }

        if (cordsBall.X > placeWidth){
            document.getElementsByClassName('playerL')[0].innerHTML =
                parseInt(document.getElementsByClassName('playerL')[0].innerHTML) + 1;
            ball.style.marginLeft = placeWidth/2 + 'px';
            ball.style.marginTop = placeHeight/2 + 'px';
            vectorBall.X  = -vectorBall.X;
            vectorBall.Y = 0;
            return false;
        }

    }
};

//function move ball

setInterval(function () {

    if (hit() === false) {
        return;
    }
    let styleValueWidth = parseInt(getStyle(ball, 'margin-left')) + vectorBall.X;
    let styleValueHeight = parseInt(getStyle(ball, 'margin-top')) + vectorBall.Y;
    if (styleValueHeight < 0) {
        styleValueHeight = 0
    }
    if (styleValueHeight > placeHeight - ballHeight) {
        styleValueHeight = placeHeight - ballHeight
    }
    ball.style.marginLeft = styleValueWidth + 'px';
    ball.style.marginTop = styleValueHeight + 'px';

}, 30);
