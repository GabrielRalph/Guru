<template>
  <div class = "date-display" :class = "classHandler" >
      <span>Next General Meeting</span>
      <h2>{{gmDate}}</h2>
  </div>

</template>

<script>
const fire = require('../firebaseConfig.js');
import {bus} from '../main.js';

export default {

  props: {

    hide: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      mode: false,
      minimize: false,
      simple: true,
      gmDate: ''
    }
  },
  computed: {
    classHandler(){
      var date = this.gmDate.split(' ')[0]
      return {
        'semi-ergent': (date == "Tommorow")||(date == "Yesterday"),
        ergent: (date == "Today"),
        normal: !((date == "Today")||(date == "Yesterday")||(date == "Tommorow")),
        'full-screen': !this.simple
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
    dateUpdate(date){
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate());
      var rentDay = new Date(date);
      var difDays = (rentDay - currentDate)/(60*60*1000*24);
      var date2 = String(date);
      date2 = date2.split(' ');

      if((difDays < 1)&&(difDays > 0)){
        return "Today"  + " at "+ date2[4];
      }else if((difDays < 2)&&(difDays > 1)){
        return "Tommorow"  + " at " +date2[4];
      }else if((difDays < 0)&&(difDays > -1)){
        return "Yesterday" + " at " +date2[4]
      }else if((difDays < -1)&&(difDays > -4)){
        return "Date Not Set"
      }else{
        return date2[1] + " " + date2[2] + " at " +date2[4]
      }
    },
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
    fire.database.ref('stucco/GM/meetingDate').on('value', (sc) => {
      this.gmDate = this.dateUpdate(sc.val())
    })
  }
}
</script>

<style>


@import url('https://fonts.googleapis.com/css?family=Roboto');
.ergent{
  border: 1vw solid #ff9105;
  box-shadow: 0 0 2vw #ff9105;
}
.semi-ergent{
  border: 1vw solid white;
  box-shadow: 0 0 1vw white;
}
.normal{
  border: 1vw solid rgba(0, 0, 0, 0);
}


.full-screen{
  height: calc(100% - 20vw);
  width: calc(100% - 50vw);
  margin: 0 4vw;
  position: fixed;
  top: 0;
  left: 0;
}

.date-display{
  margin-top: 4vw;
  color: white;
  font-size: 8vw;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 6vw;
  padding: 4vw 6vw;
  width: calc(100% - 12vw - 2*1vw);
  display: inline-block;
  float: left;
  line-height: 8vw;
}

.date-display span{
  font-size: 2.5vh;
  line-height: 3vh;
  display: block;
}
.date-display h1{
  font-size: 4vh;
  line-height: 5vh;
  margin: 0;
  display: block;
}
.date-display h2{
  font-size: 2.8vh;
  line-height: 4vh;
  margin: 0;
  display: block;
}



</style>
