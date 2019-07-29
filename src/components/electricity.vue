<template>

</template>

<script>
const fire = require('../firebaseConfig.js');

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
      simple: true,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      nextRentDay: '',
      rentRate: 0,
      rentFreq: 0,
    }
  },
  computed: {
    date(){
      return parseInt(this.nextRentDay.split('/')[0]) + ' ' + this.months[parseInt(this.nextRentDay.split('/')[1])-1] +' '+ parseInt(this.nextRentDay.split('/')[2])
    },
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
