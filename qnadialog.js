'use strict';

const request = require('request');

module.exports = (session, args, next) => {
    session.sendTyping();
    const question = session.message.text;
    const bodyText = JSON.stringify({question: question});
    const uri = `https://gestioncompartida.azurewebsites.net/qnamaker/knowledgebases/${process.env.KBID}/generateAnswer`;
    console.log(uri);


    var headers = {'Content-Type' : 'application/json'};

    request.post(uri, { body: bodyText, headers: headers}, (err, code, body) => {
        

        if(err) {
            console.log(err);
            session.endConversation('Sorry, something went wrong.');
        } else {
            const response = JSON.parse(body);
            console.log(response);
            if(response.score > 50) {
                session.endConversation(response.answer);
            } else if (response.score > 0) {
                session.send(`I'm not sure if this is right...`);
                session.endConversation(response.answer);
            } else {
                session.endConversation(`I don't have that answer.`);
            }
        }
    }).setHeader('Ocp-Apim-Subscription-Key', process.env.SUBSCRIPTION_KEY);
};

