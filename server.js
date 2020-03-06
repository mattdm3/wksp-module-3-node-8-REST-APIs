'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { clients } = require('./data/clients')

const { handleId, handleGuess } = require('./data/handlers');

const PORT = process.env.PORT || 4000;

//datamuseAPI test. sends me 100 words related to keword "website"

// const request = require("request-promise");

// // let KEYWORD = "web";

// const getWords = async (keyword) => {
//     let words = await request(`https://api.datamuse.com//words?ml=${keyword}`)
//     return JSON.parse(words);
// }

// getWords("web").then(data => console.log(data));


express()
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(morgan('tiny'))
    .use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: false }))

    // endpoints


    .get("/clients", (req, res) => {
        let body = [];
        const query = req.query;
        console.log(query)

        clients.forEach(client => {
            if (query.email != "undefined" && query.email === client.email) {
                res.status(200);
                body.push(client)
            } else if (query.name != "undefined" && query.name === client.name) {
                res.status(200);
                body.push(client)
            } else if (query.gender != "undefined" && query.gender === client.gender) {
                body.push(client)
            } else if (query.company != "undefined" && query.company === client.company) {
                body.push(client)
            } else if (query.address != "undefined" && query.address === client.address) {
                body.push(client)
            }

        })
        res.send(body)




        // console.log(query);
        // res.send(query);


    })



    // HANGMAN 

    .get("/hangman/words/:topic", handleId)


    // NOTE: added /:word for api to work. 
    .get("/hangman/guess/:wordId/:letter/:word", handleGuess)



    .listen(PORT, () => console.log(`Listening on port ${PORT}`));