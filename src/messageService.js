const chalk = require("chalk");

let accountSid = '';
let authToken = '';
let fromNumber = '';
let toNumber = '';

const setMessageConfig = messageConfig => {
    accountSid = messageConfig.accountSid;
    authToken = messageConfig.authToken;
    fromNumber = messageConfig.from;
    toNumber = messageConfig.to;
};

//will check if proper format data is provided for twilio
const checkMessageCred = (messageCred) => {
    try {
        if (messageCred === null) return false;

        const acceptedMessageCred = ['accountSid', 'authToken', 'from', 'to'];
        const messageKeys = Object.keys(messageCred);
        const unacceptedKeys = messageKeys.filter(key => {
            return !acceptedMessageCred.includes(key);
        });

        if (unacceptedKeys.length > 0) {
            throw new Error("Invalid message credientials!")
        }
        setMessageConfig(messageCred);
        return true;
    } catch (err) {
        console.log(chalk.red(err.message));
    }

}

//send message by twilio
const sendMessage = (text) => {
    try {
        const client = require('twilio')(accountSid, authToken);
        client.messages
            .create({
                body: `${text}`,
                from: `whatsapp:${fromNumber}`,
                to: `whatsapp:${toNumber}`
            })
            .then(message => console.log(chalk.blue(message.sid)))
            .catch(err => {
                console.log(chalk.red("error in twilio configuration, check credentials!"));
            })
            .done();
    } catch (err) {
        console.log(chalk.red("error in twilio configuration!"));
    }
}


module.exports = { sendMessage, checkMessageCred };