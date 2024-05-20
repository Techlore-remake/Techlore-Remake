
var boyMoveNumber = 0

var bs = new Audio('resources/audio1.mp3');
bs.loop = true;

function boyMovement(){

    boyMoveNumber= boyMoveNumber + 1;

    if (boyMoveNumber == 10) {
        boyMoveNumber = 1;
    }

    document.getElementById("boy").src= "boy ninja/Attack__00"+boyMoveNumber+".png";
}

function boyMovementStart() {
    setInterval(boyMovement,100);
}

var girlMoveNumber = 0

function girlMovement(){

    girlMoveNumber= girlMoveNumber + 1;

    if (girlMoveNumber == 10) {
        girlMoveNumber = 1;
    }

    document.getElementById("girl").src= "girl ninja/Attack__00"+girlMoveNumber+".png";
}

function soundoff(){
    if (bsplayer == 0) {
        bsplayer = 1;
    }

    if (bsplayer == 0) {
        bs.play();
    } 

    else{
        bs.pause();
        bsplayer = 0;
    }
}

bsplayer = 0;

function MovementStart(){
    if (bsplayer == 0) {
        bs.play();
    } 
    setInterval(girlMovement,100);
    setInterval(boyMovement,100);
}

