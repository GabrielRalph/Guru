<template>
  <div class = "background">

    <template v-if = "auth" >
      <div class = "components" v-bind:style = "realHeight">
        <Users v-if = "adminMode"></Users>
        <Profile v-else-if = "profileMode" v-bind:user = "user"></Profile>
        <template v-else>
          <Doors v-bind:user = "user"></Doors>
          <Rent v-bind:user = "user"></Rent>
        </template>
      </div>
      <div class = "user-pannel" v-bind:style = "realHeight">
        <img class = "dp" v-bind:src = "user.dpURL" v-on:click = "profile" v-on:touchstart = "profile"/>
        <div class = "logout">
          <img src = "./assets/logout.svg" style = "padding-top: 1vw" v-on:click = "logout"/>
        </div>
        <img v-if = "user.admin&&(!adminMode)" class = "icon icon-top" src = "./assets/admin.svg" v-on:click = "adminMode = true"/>
        <img v-if = "user.admin&&(adminMode)" class = "icon icon-top" src = "./assets/back.svg" v-on:click = "adminMode = false"/>
      </div>
    </template>

    <div v-else class = "login-page">
      <div v-if = "!auth" id="firebaseui-auth-container"></div>
      <div class = "load-wheel">  <div v-if = "loading" class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
    </div>

  </div>


</template>

<script>
const fire = require('./firebaseConfig.js')
import firebaseui from 'firebaseui';
import Doors from './components/doors.vue'
import Rent from './components/rent.vue'
import Users from './components/users.vue'
import Profile from './components/profile.vue'

export default {
  components: {
    Doors,
    Rent,
    Users,
    Profile
  },
  data () {
    return {
      loading: false,
      adminMode: false,
      profileMode: false,
      mode: false,
      auth: false,
      user: {
        doorAccess: false,
      }
    }
  },
  methods: {
    logout(e){
        fire.auth.signOut();
        this.auth = false;
    },
    profile(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        this.profileMode = !this.profileMode;
      }
    },
  },
  computed:{
    realHeight(calcs){
      return {height: "calc("+window.innerHeight+"px - 8vw)"}
    },
  },
  created(){
    var ui = new firebaseui.auth.AuthUI(fire.auth);
    fire.auth.onAuthStateChanged(user => {
      if(user){
        var userRef = fire.database.ref('users/' + user.uid)
        userRef.on('value', (snapshot) => {
          if(snapshot.val()){
            this.user = snapshot.val();
          }else{
            this.user = {
              dpURL: user.photoURL,
              email: user.email,
              name: user.displayName,
              uid: user.uid,
              admin: false,
              doorAccess: false
            }
            userRef.set(this.user)
          }
          this.auth = true;
          this.loading = false;
        })
      }else{
        if(ui.isPendingRedirect()){
          this.loading = true;
        }else{
          this.loading = false;
        }
        ui.start('#firebaseui-auth-container', fire.authConfig);
      }
    });
    this.mode = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');

body{
  font-family: Helvetica, Arial, sans-serif;
  font-size: 10vw;
  margin: 0;
  overflow: hidden;
}
.load-wheel{
  margin: 30vh 35vw;
}
.login-page{
  margin: 4vw;
  width: calc(100vw - 2*4vw);
}
.components{
  margin: 4vw 0 4vw 4vw;
  width: calc(100vw - 3*4vw - 16vw);
  float: left;
  display: inline-block;

}
.user-pannel{
  margin: 4vw;
  width: 16vw;

  border-radius: 8vw;
  float: right;
  display: inline-block;
  overflow: hidden;


}
.logout{
  padding: 5vw 6vw;
  margin-top: 4vw;
  width: calc(100% - 12vw);
  border-radius: 16vh;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  display: inline-block;
}
.dp{
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 16vw;
  border-radius: 8vw;
  margin: 0;
  float: right;
  touch-action: manipulation;
}
.icon-top{
  margin-top: 4vw;
}
.icon-left{
  margin-left: 4vw;
}
.icon-right{
  margin-right: 4vw;
}
.icon{
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  display: inline-block;
  width: 12vw;
  height: 12vw;
  padding: 2vw;
  border-radius: 8vw;
  float: right;
  touch-action: manipulation;
}

.background{
  display: inline-block;
  /* overflow: hidden; */
  height: 100vh;
  width: 100vw;
  background-image: url("./assets/stucco.jpg");
  background-position: 50% -10vh;
  background-size: 100vmax;
  background-attachment: fixed;
  touch-action: manipulation;
  /* -webkit-overflow-scrolling: touch; */
  position: fixed;
}


.firebaseui-card-content{
  width: 100%;
  height: 30vh;
}
.firebaseui-idp-list{
  list-style: none;
  margin: 0;
  padding: 0;
}
.firebaseui-list-item{
  height: 8vh;
  margin:0;
}
.firebaseui-idp-password{
  box-shadow: 1px 1px 3px darkred;
  background: #e03021;
  color: white;

}
.firebaseui-idp-icon-wrapper{
  display: block;
}
.firebaseui-idp-icon{
  width: 20vw;
  padding: 0 auto;
}
.firebaseui-idp-text{
}
.firebaseui-idp-text-short{
  display:none;
}
.firebaseui-idp-text-long{
  line-height: 8vh;
}
.firebaseui-idp-google{
  background: rgba(0, 0, 0, 0.6);
  color: white;
}
.firebaseui-idp-button{
  padding: 0;
  font: bold 6vh Arial;
  height: 40vh;
  text-align: center;
  border-width: 0px;
  border-radius: 5vh;
  width: 100%;
  opacity: 0.90;
  cursor: pointer;
}
.firebaseui-idp-button:hover{
  opacity: 1;
}
.firebaseui-auth-container{
  width: 100%;
  float: left;
}
.loader{
  margin: calc((100vw - 200px)/2);
  margin-top: calc((100vh - 118px - 64px - 2*20px - 100px)/2);
  margin-bottom: calc((100vh - 118px - 64px - 2*20px - 50px)/2);

}
.lds-default {
  display: inline-block;
  position: relative;
  margin: 20px calc((200px - 64px)/2);
  width: 64px;
  height: 64px;
}
.lds-default div {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #fff;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 29px;
  left: 53px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 18px;
  left: 50px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 9px;
  left: 41px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 6px;
  left: 29px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 9px;
  left: 18px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 18px;
  left: 9px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 29px;
  left: 6px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 41px;
  left: 9px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 50px;
  left: 18px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 53px;
  left: 29px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 50px;
  left: 41px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 41px;
  left: 50px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}


</style>
