const moment = require("moment");
const validator = require("validator");
const chalk = require("chalk");
const { sendMessage, checkMessageCred } = require('./messageService');
const { getDistrictSlotsData, getDistrictId } = require("./fetchCowinData");
const { sendNotification, testNotification } = require("./desktopNotification");

let districtCode = null;
let isValidMessageCred = false;

//fetch available slots as per age group
const getSlotData = async (pincode, ageLimit = 18) => {
    let today = moment().format('DD-MM-YYYY');
    let curentTime = moment().format('DD-MM-YYYY h:mm:ss a');
    if (districtCode === null) {
        districtCode = await getDistrictId(pincode);
    }
    let availableSlots = await getDistrictSlotsData(today, districtCode, ageLimit);
    let slotsmessage = [];
    let msgString = "";
    let slotsCout = availableSlots.length;
    for (i = 1; i < 3; i++) {
        if (slotsCout == 0) {
            today = moment().add((7 * i), 'd').format('DD-MM-YYYY');
            // console.log(chalk.greenBright(`also checked for ${today}`));
            availableSlots = await getDistrictSlotsData(today, districtCode, ageLimit);
            slotsCout = availableSlots.length;
        }
    }
    slotsCout > 0 && availableSlots.forEach(center => {
        slotsmessage.push(`Center :  ${center.centerName}, date : ${center.date}, capacity : ${center.capacity}, age : ${center.age_limit}`);
    });

    slotsmessage.forEach(msg => msgString += msg);
    if (slotsCout > 0) {
        console.log(chalk.green(`Find slots in ${slotsCout} centers at:- ${curentTime}`));
        sendDataInCollection(slotsCout, slotsmessage);
    } else {
        console.log(chalk.dim.green(`${curentTime} : No slots available right now for next 3 weeks!`));
    }
};

//make collection of 5 available centers 
const sendDataInCollection = (count, slotsData) => {
    sendWhatsapp("Slots available for 18+");
    let msgString = "";
    let counter = 0;
    let msgSend = 0;
    let isRemainingSlots = false;
    if (count > 30) {
        slotsData = slotsData.slice(0, 30);
    }
    slotsData.forEach(msg => {
        if (counter <= 4) {
            msgString += msg;
            msgString += "  ||  ";
            counter++;
        }

        if (count - msgSend < 5) {
            isRemainingSlots = true;
        }

        if (counter == 5 || isRemainingSlots) {
            console.log(msgString);
            sendWhatsapp(msgString);
            sendNotification(msgString);
            msgString = "";
            counter = 0;
            msgSend = msgSend + 5;
        }
    });
}

// check if we have proper credentials and then send message
const sendWhatsapp = (message) => {
    isValidMessageCred && sendMessage(message);
}


const cowinSlotsNotification = (pincode, options = {}) => {
    try {
        let validOption = ["age", "messageCredentials"];
        let isOptionProvided = options !== null;
        let optionsItem = isOptionProvided && Object.keys(options);
        let unacceptedOptionsItem = optionsItem.filter(item => !validOption.includes(item));
        let messageCred = optionsItem.includes("messageCredentials") && options.messageCredentials;
        let age = optionsItem.includes("age") ? options.age : 18;
        isValidMessageCred = messageCred && checkMessageCred(messageCred);

        if (unacceptedOptionsItem.length > 0) {
            throw new Error("Invalid Options!, provide the correct options");
        } else if (!validator.isPostalCode(pincode.toString(), 'IN')) {
            throw new Error("Invalid Pincode!, provide the correct pincode");
        } else if (age <= 18 && age >= 101) {
            throw new Error("Invalid age!, age must be between 18 and 45");
        }

        //set age to accepted age
        age = age >= 18 && age <= 44 ? 18 : 45;

        //Run on first time loading of code
        getSlotData(pincode, age);

        //Run after every 10 mins
        setInterval(() => {
            //1st arrgument is to be pincode of area and second is age limit(Optional), by default set to 18
            getSlotData(pincode, age);
        }, 600000);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
};

module.exports = {
    cowinSlotsNotification,
    testNotification
}
