<template>

</template>

<script>
const fire = require('../firebaseConfig.js');
import paypal from "vue-paypal-checkout"
import {bus} from '../main.js';

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
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

.meeting-pannel{
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

.meeting-pannel span{
  font-size: 2.5vh;
  line-height: 3vh;
  display: block;
}
.meeting-pannel h1{
  font-size: 4vh;
  line-height: 5vh;
  margin: 0;
  display: block;
}
.meeting-pannel h2{
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
