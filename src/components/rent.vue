<template>
  <div v-if = "simple" class = "simple-rent" v-on:click = "expand" v-on:touchstart = "expand" v-bind:style = "minimizeStyle">
    <div class = "simple-rent-day">
      <span>Next rent day</span>
      <h1>{{rentAmount}}</h1>
      <h2>{{nextRentDay}}</h2>
    </div>
    <div v-if = "false" class = "simple-rent-acc">
      <span>Rent account</span>
      <h1 v-bind:style = "deptColor">{{rentAccount}}</h1>
    </div>
  </div>
  <div v-else class = "expanded-rent" v-on:click = "expand" v-on:touchstart = "expand">
    <paypal :button-style="myStyle"></paypal>
  </div>
</template>

<script>
const fire = require('../firebaseConfig.js');
import paypal from "vue-paypal-checkout"
import {bus} from '../main.js';

export default {
  components:{
    paypal
  },
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
      myStyle: {
        label: 'checkout',
        size:  '10vw',
        shape: 'pill',
        color: 'gold'
      },
      mode: false,
      minimize: false,
      simple: true,
      nextRentDay: '',
      rentRate: 0,
      rentFreq: 0,
    }
  },
  computed: {
    rentAmount(){
      return '$' + this.rentFreq*this.rentRate
    },
    rentAccount(){
      if(this.user.rentAccount >= 0){
          return '$' + this.user.rentAccount
      }else{
          return '-$' + Math.abs(this.user.rentAccount)
      }
    },
    deptColor(){
      if(this.user.rentAccount >= 0){
          return {color: 'green'}
      }else{
          return {color: 'red'}
      }
    },
    minimizeStyle(){
      if(this.minimize){
        return {
          "transform-origin": "top",
          height: "0",
          padding: "0",
          transform: "scaleY(0)",
        }
      }
    }
  },
  methods: {
    expand(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        if(this.simple){
          bus.$emit('expand');
          this.simple = false;
        }else{
          bus.$emit('unexpand');
          this.simple = true;
        }
      }
    }
  },
  created(){
    this.mode = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    bus.$on('expand',() => {
      if(this.simple){
        this.minimize = true;
      }
    });
    bus.$on('unexpand',() => {
      this.minimize = false;
    });
    if(!this.user.hasOwnProperty('rentAccount')){
      fire.database.ref('users/'+this.user.uid+'/rentAccount').set(0)
      this.user.rentAccount = 0;
    }
    var nextRentDay = fire.database.ref('stucco/nextRentDay'); // <-- Should change to back door on data base
    nextRentDay.on('value', (snapshot) => {
      this.nextRentDay = snapshot.val();
    });
    var rentRate = fire.database.ref('stucco/rentRate'); // <-- Should change to back door on data base
    rentRate.on('value', (snapshot) => {
      this.rentRate = snapshot.val();
    });
    var rentFreq = fire.database.ref('stucco/rentFreq'); // <-- Should change to back door on data base
    rentFreq.on('value', (snapshot) => {
      this.rentFreq = snapshot.val();
    });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
.paypalww{
  width: 100%;
}
.paypal-button-text span{
  display: none;
}
.paypal-button-logo{
  height: 10vh;
}
.simple-rent{
  margin-top: 4vw;
  color: white;
  font-size: 8vw;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6vw;
  padding: 4vw 6vw;
  height: 12vh;
  width: calc(100% - 12vw);
  display: inline-block;
  float: left;
  line-height: 8vw;
}
.expanded-rent{
  color: white;
  font-size: 8vw;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6vw;
  padding: 4vw 6vw;
  height: calc(100% - 2*4vw);
  width: calc(100% - 12vw);
  display: block;
  line-height: 8vw;
}
.simple-rent span{
  font-size: 2.5vh;
  line-height: 3vh;
  display: block;
}
.simple-rent h1{
  font-size: 4vh;
  line-height: 5vh;
  margin: 0;
  display: block;
}
.simple-rent h2{
  font-size: 2.8vh;
  line-height: 4vh;
  margin: 0;
  display: block;
}
.simple-rent-day{
  width: 50%;
  display: inline-block;
  float: left;
}
.simple-rent-acc{
  width: 47%;
  padding-left: 2%;
  height: 100%;
  border-left: 3px solid white;
  display: inline-block;
  float: left;
}



</style>
