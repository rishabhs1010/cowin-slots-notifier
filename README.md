# COWIN-AVAILABLE-SLOTS

A npm package to provide desktop and whatsapp notification for available slots on cowin portal

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


## Minimum Requirment

Windows - windows 8 or more
MacOS - High Sierra or more




