var girl = document.getElementById("girl");
var idleImageNumber = 0;

function idleAnimation(){
    idleImageNumber = idleImageNumber + 1;

    if (idleImageNumber == 10) {
        idleImageNumber = 0;
    }


    girl.src = "girl ninja/Idle__00"+idleImageNumber+".png";
}

var idleAnimationNumber = 0;

function idleAnimationStart(){
    idleAnimationNumber = setInterval(idleAnimation,200);
}

var runImageNumber = 0;
var runAnimationNumber = 0;

function runAnimation() {

    runImageNumber = runImageNumber + 1;

    if (runImageNumber == 10) {
        runImageNumber = 0;
    }

    girl.src = "girl ninja/Run__00"+runImageNumber+".png";
}

function runAnimationStart() {
    runAnimationNumber = setInterval(runAnimation,100);
    clearInterval(idleAnimationNumber)
}

function key(event) {
    if (event.which == 13) { //enter Key
        if (runAnimationNumber == 0) {
            runAnimationStart();
            rs.play();
        }
        if (moveBackgroundAnimationId == 0) {
            moveBackgroundAnimationId = setInterval(moveBackground, 5);
            sw = setInterval(updateScore,100);
            sw = 0;
        }
        if (boxAnimationId ==  0) {
            boxAnimationId = setInterval(boxAnimation, 5);
        }
        document.getElementById("guide").style.display= "none";
    }

    if (event.which == 32) { //Space Key
        if (jumpAnimationNumber == 0) {
            jumpAnimationStart();
            rs.pause();
            js.play();
        }
        if (moveBackgroundAnimationId == 0) {
            moveBackgroundAnimationId = setInterval(moveBackground,5);
            sw = setInterval(updateScore,100);
            sw = 0;
        }
        if (boxAnimationId == 0) {
            boxAnimationId = setInterval(boxAnimation,5);
        }
        document.getElementById("guide").style.display= "none";
    }
}

var rs = new Audio("resources/run.mp3");
rs.loop = true;
var js = new Audio("resources/jump.mp3");
var ds = new Audio("resources/dead.mp3")

var backgroundImagePositionX = 0;
var moveBackgroundAnimationId = 0;

function moveBackground() {

    backgroundImagePositionX = backgroundImagePositionX-2;

    document.getElementById("background").style.backgroundPositionX = backgroundImagePositionX + "px";
}

var jumpAnimationNumber = 0;
var jumpImageNumber = 0;
var girlMarginTop = 480;

function jumpAnimation() {

    jumpImageNumber = jumpImageNumber + 1;

    if (jumpImageNumber <= 5) {
        girlMarginTop = girlMarginTop - 40;
        girl.style.marginTop = girlMarginTop+"px";
    }

    if (jumpImageNumber >= 6) {
        girlMarginTop = girlMarginTop + 40;
        girl.style.marginTop = girlMarginTop+"px"
    }

    if (jumpImageNumber == 10) {
        jumpImageNumber = 0;
        clearInterval(jumpAnimationNumber);
        jumpAnimationNumber = 0;
        runAnimationNumber = 0;
        runAnimationStart();
        rs.play();
    }

    girl.src = "girl ninja/Jump__00"+jumpImageNumber+".png";
}

function jumpAnimationStart() {
    clearInterval(idleAnimationNumber);
    runImageNumber = 0;
    clearInterval(runAnimationNumber);
    jumpAnimationNumber = setInterval(jumpAnimation,100);
}

var boxMarginLeft =   1300;

function createBoxes() {

    for(var i = 0;  i< 15; i++)  {
            var box = document.createElement("div");
            box.className = "box";
            document.getElementById("background").appendChild(box);
            box.style.marginLeft = boxMarginLeft + "px";
            //boxMarginLeft = boxMarginLeft+1000;
            box.id = "box"+i;
            if(i <= 5){
                boxMarginLeft = boxMarginLeft +900;
            }

            if(i>=6){
                boxMarginLeft = boxMarginLeft + 700;
            
            }
    }
}

var boxAnimationId = 0;

function boxAnimation(){
    for(var i = 0; i<15 ; i++){
        var box = document.getElementById("box"+i);
        var currentMarginLeft = getComputedStyle(box).marginLeft;
        var newMarginLeft = parseInt(currentMarginLeft)-2;
        box.style.marginLeft = newMarginLeft + "px";

        // alert(newMarginLeft);
        if (newMarginLeft < 190 & newMarginLeft > 60 & girlMarginTop > 430 ) {
            clearInterval(jumpAnimationNumber);
            jumpAnimationNumber = -1;
            clearInterval(runAnimationNumber);
            runAnimationNumber = -1;
            clearInterval(moveBackgroundAnimationId);
            moveBackgroundAnimationId = -1;
            clearInterval(boxAnimationId);
            boxAnimationId = -1;
            clearInterval(updateScore);
            sw = -1;
            rs.pause();
            deadAnimationWorker = setInterval(DeadAnimation, 100)
            ds.play();
        }
    }

    //210 -100
    
}

var deadAnimationWorker = 0;
var deadAnimationNumber = 0;

function DeadAnimation(){
    deadAnimationNumber = deadAnimationNumber + 1;
    var deadAnimatioId = document.getElementById("girl");
    deadAnimatioId.style.marginTop = "480px";
    if (deadAnimationNumber == 10) {
        deadAnimationNumber = 9;
    }
     deadAnimatioId.src = "girl ninja/Dead__00"+deadAnimationNumber+".png";
     if (u < 1500) {
        document.getElementById("lost").style.visibility = "visible";
        document.getElementById("scoreend").innerHTML = u;
        clearInterval(jumpAnimationNumber);
        jumpAnimationNumber = -1;
        clearInterval(runAnimationNumber);
        runAnimationNumber = -1;
        clearInterval(moveBackgroundAnimationId);
        moveBackgroundAnimationId = -1;
        clearInterval(boxAnimationId);
        boxAnimationId = -1;
        rs.pause();
        clearInterval(updateScore);
        sw = -1;
        ds.play();
    }

}

function re() {
    location.reload();
}

var u = 0;
var sw = 0;

function updateScore() {
    if (sw == 0) {



        u = u + 5;

        if (u == 1500) {
            document.getElementById("end").style.visibility = "visible";
            clearInterval(jumpAnimationNumber);
            jumpAnimationNumber = -1;
            clearInterval(runAnimationNumber);
            runAnimationNumber = -1;
            clearInterval(moveBackgroundAnimationId);
            moveBackgroundAnimationId = -1;
            clearInterval(boxAnimationId);
            boxAnimationId = -1;
            rs.pause();
            clearInterval(updateScore);
            sw = -1;
            ds.play();
        }
        document.getElementById("scorecount").innerHTML = u; 
    }
}