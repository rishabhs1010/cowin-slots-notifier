const notifier = require("node-notifier");

// testings and allow permission over desktop
const testNotification = () => {
    notifier.notify({
        title: "Cowin Slots information",
        message: "Test notification to allow permission for Notification"
    });
}


//sending notification over desktop
const sendNotification = (message) => {
    notifier.notify({
        title: "Cowin Slots information",
        message
    });
}

module.exports = {
    testNotification,
    sendNotification
}