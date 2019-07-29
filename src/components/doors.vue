<template>
  <div v-if = "user.doorAccess" class = "doors-pannel" v-bind:style = "minimizeStyle">
    <!-- Front door button -->
          <div class = "front-door" v-on:touchstart = "openFrontDoor" v-on:click = "openFrontDoor" v-bind:class = "{on: frontdoor}">
            <img src = "../assets/doorClosed.svg" v-bind:class = "{open: frontdoor}" class = "door"/>
          </div>

          <!-- Back door button -->
          <div class = "back-door" v-on:touchstart = "openBackDoor" v-on:click = "openBackDoor" v-bind:class = "{on: backdoor}">
            <img src = "../assets/back-door.svg" v-bind:class = "{open: backdoor}" class = "door"/>
          </div>
  </div>
  <div v-else class = "no-access">
    Hey {{user.name.split(' ')[0]}},
    <span>{{noaccessmessage}}</span>
    <template v-if = "status == 'new'">
      <textarea class = "messager" ref = "messageRef"/>
      <div class = 'btn-pannel'>
        <div class = "btn" v-on:click = "clearMessage" v-on:touchstart = "clearMessage">clear</div>
        <div class = "btn" v-on:click = "sendMessage" v-on:touchstart = "sendMessage">send</div>
      </div>
    </template>
  </div>
</template>

<script>
const fire = require('../firebaseConfig.js');
//const nodemailer = require("nodemailer");
//const functions = require('firebase-functions');


import {bus} from '../main.js';

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    hide: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      minimize: false,
      mode: false,
      frontdoor: false,
      backdoor: false,
      status: 'new',
      noaccessmessage: "It appears you don't have access, please send admin a message bellow."
    }
  },
  methods: {
    openBackDoor(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
          // if(!this.backdoor){
            this.backdoor = !this.backdoor   //*backDoor
            fire.database.ref('stucco/locks').update({lock1: this.backdoor}) // <-- Should change to back door on data base
          // }
      }
    },
    openFrontDoor(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)) {
        if(!this.frontdoor){
          this.frontdoor = true;      //*frontDoor
          // fire.database.ref('stucco/locks').update({lock0: this.frontdoor}) // <-- Should change to front door on data base
          fire.database.ref('stucco').update({coffee: this.frontdoor}) // <-- Should change to front door on data base
        }
      }
    },
    clearMessage(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        this.$refs.messageRef.value = "";
      }
    },
    sendMessage(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        var user = fire.database.ref('users/'+this.user.uid +'/');
        this.noaccessmessage = 'we currently processing your access request.';
        this.status = 'processing';
        user.child('message').set(this.user.name+'\n' + this.$refs.messageRef.value);
        user.child('status').set(this.status);
        this.$refs.messageRef.value = "";
      }
    }
  },
  computed:{
    minimizeStyle(){
      if(this.minimize){
        return {
          display:'none'
        }

      }
    }
  },
  created(){
    bus.$on('expand',() => {
      this.minimize = true;
    });
    bus.$on('unexpand',() => {
      this.minimize = false;
    });
    if(this.user.hasOwnProperty('status')){
      this.status = this.user.status;
      if(this.status == 'processing'){
        this.noaccessmessage = 'we currently processing your access request.';
      }else if(this.status == 'declined'){
        this.noaccessmessage = 'you have been denied access.';
      }
    }
    this.mode = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);                                 //*frontDoor
    // var frontDoorRef = fire.database.ref('stucco/locks/lock0'); // <-- Should change to front door on data base
    // frontDoorRef.on('value', (snapshot) => {
    //   this.frontdoor = snapshot.val();
    // });

    // will remove one day
    var cofref = fire.database.ref('stucco/coffee');
    cofref.on('value', (sc) => {
      this.frontdoor = sc.val();
    })
                                       //*backDoor
    var backDoorRef = fire.database.ref('stucco/locks/lock1'); // <-- Should change to back door on data base
    backDoorRef.on('value', (snapshot) => {
      this.backdoor = snapshot.val();
    });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
.messager{
  display: flex;
  height: 100%;
  float: left;
  width: calc(100% - 2*2vw);
  font-size: 5vw;
  border-width: 0;
  background: rgba(255,255,255,0.2);
  font-family: Helvetica, Arial, sans-serif;
  color: white;
  padding: 2vw;
  overflow: hidden;
  margin-top: 2vh;
  border-radius: 3vh;
  outline: none;
}
.doors-pannel{
  width: 100%;
  height: calc(12vw + 43 * (100vw - 16vw - 4*3vw - 28vw) / 39);
  transition-duration:0.3s;
}
.door{
  transition-property: transform;
  transition-duration:0.5s;
  transform-origin: left;
  touch-action: manipulation;
}
.back-door{
  perspective: 1000px;
  display: inline-block;
  float: left;
  cursor: pointer;
  width: calc((100% - 28vw)* 21 / 39);
  height: calc(100% - 12vw);
  padding: 6vw;
  border-radius: 6vw;
  background: rgba(0, 0, 0, 0.6);
  touch-action: manipulation;
}
.front-door{
  perspective: 1000px;
  display: inline-block;
  float: left;
  color: white;
  cursor: pointer;
  margin:0 4vw 0 0;
  width: calc(18 * (100% - 28vw) / 39);
  height: calc(100% - 12vw);
  padding: 6vw;
  border-radius: 6vw;
  background: rgba(0, 0, 0, 0.6);
  touch-action: manipulation;
}
.on{
  box-shadow: 0 0 2vw rgba(200, 200, 200,1);
  cursor: progress;
}
.open{
  transform: rotateY(-45deg);
}
.no-access{
  flex-direction: column;
  color: white;
  font-size: 8vw;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6vw;
  padding: 6vw;
  height: calc(100% - 12vw);
  width: calc(100% - 12vw);
  display: flex;
  float: left;
  line-height: 8vw;
}
.no-access span{
  font-size: 5vw;
}
.btn-pannel{
  margin-top: 2vh;
  width: 100%;
  height: 5vh;
}
.btn{
  cursor: pointer;
  display: inline-block;
  float: right;
  padding:0 2vh;
  margin-left: 2vh;
  height:5vh;
  font-size: 3vh;
  line-height: 5vh;
  text-align: center;
  color: white;
  border-radius: 3vh;
  background: rgba(255,255,255,0.2);
}
</style>
