let { words } = require("./words")
const request = require("request-promise");

// This sends the object with id and letter count. 
const handleId = (req, res) => {

    // ADD params FOR TOPIC. 
    let topic = req.params.topic;




    let randomWordId = {};
    let randomNum = Math.floor((Math.random() * 20) + 1);

    // TEST (for getting random word api )
    // let KEYWORD = "web";

    const getWords = async (keyword) => {
        let words = await request(`https://api.datamuse.com//words?rel_trg=${keyword}`);
        return JSON.parse(words);

    }

    // getWords("web").then(data => console.log(data));
    //calling above! 

    getWords(topic).then(data => {

        randomWordId.word = data[randomNum].word.replace(/ /g, '');
        randomWordId.id = randomNum;
        randomWordId.length = data[randomNum].word.length;
        // console.log(randomWordId)
        let jsonId = JSON.stringify(randomWordId);

        res.send(jsonId);

    })




    // END OF TEST


    // ORIGINAL 

    // let randomWordObj = words[randomNum];

    // randomWordId.id = randomWordObj.id;
    // randomWordId.length = randomWordObj.letterCount;

    // let jsonID = JSON.stringify(randomWordId);


    // res.send(jsonID);
}

// this is for testing purposes for now. 
let tries = 15;


const handleGuess = (req, res) => {

    // OLD PARAMS
    // const { wordId, letter } = req.params;

    // NEW PARAMS 
    const { wordId, letter, word } = req.params;


    //create the word object based on id. 
    //create object for selected word on guess
    const wordObject = {};

    // NEW CODE

    wordObject.id = wordId;
    wordObject.letterCount = word.length;
    wordObject.word = word


    // OLD CODE(Switching to API)

    // words.forEach(word => {
    //     if (wordId === word.id) {
    //         wordObject.id = word.id;
    //         wordObject.letterCount = word.letterCount;
    //         wordObject.word = word.word
    //     }
    // });

    //check to see if the guessed letter is in the word. 

    if (wordObject.word.indexOf(letter) != -1) {


        // console.log("word is " + wordObject.word + " and type is " + typeof wordObject.word);

        // console.log("letter guessed id" + letter)

        // Check position(s) THIS WORKS! But unnecessary... 
        // positionOccurances = 0;
        // for (i = 0; i < wordObject.word.length; i++) {
        //     if (wordObject.word.charAt(i) === letter) {
        //         positionOccurances += 1;
        //     }
        // }


        //check position of letter and say it... make array ***NEW **** 

        // to make things easier: 
        let chosenWord = wordObject.word;

        let letterPosArray = [];

        // letterPos should hold array of positions like [1, 5]

        let chosenWordArray = chosenWord.split("");

        chosenWordArray.forEach((chosenWordLetter, id) => {
            if (chosenWordLetter === letter) {
                letterPosArray.push(id);
            }
        })

        // old way
        // letterPos.push(wordObject.word.indexOf(letter) + 1);


        // Create a respo nse object with letter and position 
        let responseObject = {};

        responseObject.positions = letterPosArray;
        responseObject.letter = letter;
        responseObject.message = "GOOD GUESS";
        let jsonRespObj = JSON.stringify(responseObject);

        res.send(jsonRespObj);
        // Wrong guess... let count go up... and send how many tries left. 





    } else {
        // if it's a wrong guess, it will send a different object with the message below. 
        tries -= 1;
        let wrongGuessMsg = {};
        wrongGuessMsg.message = `bad guess!, try again. Number of tries remaining: ${tries}`;
        wrongGuessMsg.letter = letter;


        jsonMsg = JSON.stringify(wrongGuessMsg);
        res.send(jsonMsg);
    }




}



module.exports = { handleId, handleGuess }