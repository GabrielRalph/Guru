const functions = require('firebase-functions');
const twilio = require('twilio');

const accountSid = 'ACad47e30cb321a453695796d75d160480';
const authToken = 'ca3055af2a2db0c9c24c892fae2bf20d';
const client = require('twilio')(accountSid, authToken);

const client = new twilio(accountSid, authToken);
