// ... crickets...

const title = document.getElementById("title");
const newGameBtn = document.getElementById("newGame");
const wordBlanks = document.getElementById("word-blanks");
const letterGuess = document.getElementById("letterGuess");
const submitButton = document.querySelector(".submit-button");
const wrongLetters = document.getElementById("wrong-letter");
const wrongLetterDiv = document.querySelector(".wrong-letter");
const triesText = document.getElementById("tries");

const contentClass = document.querySelector(".content");
const gameOverAppear = document.querySelector('.game-over-appear');
const form = document.querySelector("#guess-form");

const gameOverHeading = document.getElementById("game-over-heading");
const gameOverLoseHeading = document.querySelector(".game-over");

const hangmanImage = document.getElementById("hangman-image");

const topicField = document.getElementById("topic");

let wordObj;


const startGameButton = () => {
    if (event.key === "Enter") {
        newGame();
    }
}
// prints the guessfield
const newGame = () => {


    if (topicField.value === "" || topicField.value.length <= 2) {

        topicField.style.animation = "shake .4s";

        setTimeout(function () {
            topicField.style.animation = "";
        }, 500)

    } else {

        window.removeEventListener("keypress", startGameButton);


        const topic = topicField.value;

        topicField.style.display = "none";

        form.style.visibility = "visible";
        wrongLetters.style.visibility = "visible";
        wrongLetterDiv.style.visibility = "visible";
        submitButton.style.visibility = "visible";
        wordBlanks.style.visibility = "visible";
        triesText.style.visibility = "visible";

        newGameBtn.style.visibility = "hidden";
        newGameBtn.style.display = "none";



        fetch(`/hangman/words/${topic}`)
            .then(res => res.json())
            .then(body => {
                wordObj = body;
                // console.log(body);
                createGuessField();

            });
    }

}

let magicWord = [];


const createGuessField = (letterObj) => {

    // if there is no paramater do this
    if (!letterObj) {


        // fill the array with booleans depending on wordOBj.length; 
        for (i = 1; i < wordObj.length + 1; i++) {
            magicWord.push("_");
        }
        // NEW METHOD - isntead of false, turn to _ and to string. 
        wordBlanks.innerText = magicWord.join(" ");
    }
    else if (letterObj) {

        // if paramater coming from guess is passed... 
        const { letter, positions } = letterObj;
        for (i = 0; i < positions.length; i++) {
            magicWord[positions[i]] = letter;
        }


        // magicWord[position - 1] = letter;
        wordBlanks.innerText = magicWord.join(" ");
        //check magicWord array has no more underscores and end game
        let checkEnd = magicWord.includes("_");
        if (checkEnd === false) {
            youWin();
        }

    }

}

const youWin = () => {


    gameOverHeading.innerText = "YOU WIN";
    gameOverHeading.style.fontSize = "140px";
    gameOverHeading.style.letterSpacing = "10px";
    hangmanImage.src = "../img/hangman-gif.gif";
    hangmanImage.style.height = "300px";


    submitButton.style.visibility = "hidden";
    letterGuess.style.visibility = "hidden";
    // this works. 
    document.body.style.animation = "blue-bg .6s linear";
    document.body.style.animationFillMode = "forwards";

    // Also doesn't work... 
    // contentClass.classList.add("add-to-content");

    // this method works!
    contentClass.style.animation = "game-over .6s linear";
    contentClass.style.animationFillMode = "forwards";

    // make the image of a dead hangman appear... screen goes black maybe? trigger a transition? 
    gameOverAppear.style.display = "flex";
    gameOverAppear.style.animation = "game-over-appear .8s linear";
    gameOverAppear.style.animationFillMode = "forwards";



}

const gameOver = (word) => {


    let wordDisplay = document.createElement("h1");
    wordDisplay.style.color = "white";
    wordDisplay.innerText = "the word was " + word;
    gameOverAppear.appendChild(wordDisplay);



    submitButton.style.visibility = "hidden";
    letterGuess.style.visibility = "hidden";
    document.body.style.animation = "black-bg .6s linear";
    document.body.style.animationFillMode = "forwards";
    contentClass.style.animation = "game-over .6s linear";
    contentClass.style.animationFillMode = "forwards";
    gameOverAppear.style.display = "flex";
    gameOverAppear.style.animation = "game-over-appear .8s linear";
    gameOverAppear.style.animationFillMode = "forwards";
    gameOverLoseHeading.style.color = "white";

}

window.addEventListener("keypress", startGameButton);



let TRIES = 15;

// HANDLE THE GUESS

var handleGuess = (event) => {
    event.preventDefault();
    // submitButton.disabled = true;
    let letter = letterGuess.value.toLowerCase();
    //check if the input is a letter. 
    if (!isNaN(letter)) {
        alert("must be a letter")
    }
    else {
        // this is going to make the request to make handle the guess for the letter selected. 
        fetch(`/hangman/guess/${wordObj.id}/${letter}/${wordObj.word}`)
            // OLD VERSION: 
            // fetch(`/hangman/guess/${wordObj.id}/${letterGuess.value}`)
            .then(res => res.json())
            .then(body => {

                // this if statement checks if there is a position key value pair in the object recieved. 


                if (body.positions != null) {
                    // LETTER GUESS IS CORRECT, call guess field func

                    createGuessField(body);

                } else {


                    //guess is wrong and we show the wrong letter. 

                    TRIES -= 1;
                    if (TRIES > 0) {
                        triesText.innerText = `Tries remaining: ${TRIES}`;
                        wrongLetters.innerText += body.letter;
                    } else if (TRIES === 0) {

                        triesText.innerText = `Tries remaining: ${TRIES}`;
                        wrongLetters.innerText += body.letter;
                        gameOver(wordObj.word);

                    }
                }

            });
        letterGuess.value = "";
    };
}

// const oneWordOnly = () => {
//     console.log(topicField.value);
//     if (topicField.value != typeof "string") {
//         alert("ONE WORD ONLY")
//     }
// }



// function init() {
//     createGuessField();
// }

// window.onload = init;