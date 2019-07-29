const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
//const accountSid = 'ACad47e30cb321a453695796d75d160480';
//const authToken = 'ca3055af2a2db0c9c24c892fae2bf20d';
//const client = require('twilio')(accountSid, authToken);
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'f32e43c9',
  apiSecret: 'g8inxsm2LpbmVYZL'
})



//const twilioNumber = '+61488845618' // your twilio phone number


/// start cloud function

exports.textStatus = functions.database
       .ref('users/{uid}/message')
       .onCreate(event => {
         console.log(event)
         // const uid = event.after._path.split('/')[2]
         const from = 'Doors'
         const to = '61403072574'
         const text = event._data + '\n\n\n\n\n <3 - ';

         nexmo.message.sendSms(from, to, text).then(x =>
            console.log("we got here " + x)
          ).catch(err => console.log("nope "+err))

    // return admin.database()
    //             .ref('/users/${uid}')
    //             .once('value')
    //             .then(snapshot => {
    //                 const message      = snapshot.val().message
    //                 const name = snapshot.val().name.split(' ')[0]
    //
    //
    //                 const textMessage = {
    //                     body: message,
    //                     to: '+61403072574',  // Text to this number
    //                     from: twilioNumber // From a valid Twilio number
    //                 }
    //
    //                 return client.messages.create(textMessage)
    //             })
    //             .then(message => console.log(message.sid, 'success'))
    //             .catch(err => console.log(err))


});

exports.scheduledFunctionCrontab = functions.pubsub.schedule('23 59 * * 3')
  .timeZone('Australia/Sydney') // Users can choose timezone - default is UTC
  .onRun((context) => {
  admin.database().ref('stucco/nextRentDay').once('value').then(sc => {
  var lastRentDay = new Date(sc.val());
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  var difDays = (currentDate - lastRentDay)/(60*60*1000*24);
  if(difDays > 12){
  	var newRentDay = new Date();
    newRentDay.setTime(lastRentDay.getTime() + 14*(60*60*1000*24));
    admin.database().ref('stucco').update({
      nextRentDay: String(newRentDay).split(' ')[1] + ' ' + String(newRentDay).split(' ')[2] + ' ' + String(newRentDay).split(' ')[3]
    });
    console.log('Next rent day' + String(newRentDay).split(' ')[1] + ' ' + String(newRentDay).split(' ')[2] + ' ' + String(newRentDay).split(' ')[3]);
  }

  })
  console.log('update payday test');
});

/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}
