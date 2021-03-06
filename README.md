# COWIN-SLOTS-NOTIFIER

A npm package to provide desktop and whatsapp notification for available slots on cowin portal.

It will check for available slots in every 10 minutes and notify you once any slots are available in your Area.

Cowin-slots-notifier will notify for slots available within 7 days and it will check for next 14 days as well in case of no slots available from current date.

# Installation

`npm i cowin-slots-notifier`

OR

`npm install cowin-slots-notifier`

# Usage

Import the functions from cowin-slots-notifier

```
const {cowinSlotsNotification, testNotification} = require("cowin-slots-notifier");
```

To test desktop notification permission -
You need to allow the desktop notification once it get pop up by above function

```
testNotification();
```

To schedule the notification, when slots are available for given age group on selected pincode - 
```
cowinSlotsNotification(pincode, options);
```

With options, you can get whatsapp notification as well for available slots -
```
cowinSlotsNotification(pincode, {
    age : 18,
    messageCredentials : {
        accountSid: 'your account Sid',
        authToken: 'your auth token',
        from: 'number provided from twilio as from number',
        to: 'phone number attched with twilio'
    }
});
```
* pincode - pincode for which you want to search slots

## Options

cowin-available-slots support 2 options

* age -  Age need to be between 18 and 100 year. 
        - This is optional option as if not provided, it will take age = 18 by default.

* messageCredentials - You need to create account over https://www.twilio.com/ and get setup for whatsapp message
then below information need to be passed in messageCred
    
    ```
    {
        accountSid: 'your account Sid',
        authToken: 'your auth token',
        from: 'number provided from twilio as from number',
        to: 'phone number attched with twilio'
    }
    ```

    - This is an optional option as cowin-available-slots provide notification over desktop only if this info is not passed
    - "from" and "to" phone number need to have country code as well. Like "from" will have "+14155238886".


## Minimum Requirment

Windows - windows 8 or more
MacOS - High Sierra or more




