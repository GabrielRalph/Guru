<template>
  <div>
    <div class = "field top" v-bind:class = "{'edit-mode': editMode, 'display-mode': !editMode}">
      <span>First Name</span>
      <h1 v-bind:contenteditable="editMode" ref = "firstNameRef">
      </h1>
    </div>
    <div class = "field" v-bind:class = "{'edit-mode': editMode, 'display-mode': !editMode}">
      <span>Last Name</span>
      <h1 v-bind:contenteditable="editMode" ref = "lastNameRef" v-on:input = "input('lastName', 'numbers')">
      </h1>
    </div>
    <div class = "field" v-bind:class = "{'edit-mode': editMode, 'display-mode': !editMode}">
      <span>Unit Number</span>
      <h1 v-bind:contenteditable="editMode" ref = "unitRef">
      </h1>
    </div>
    <div class = "field" v-bind:class = "{'edit-mode': editMode, 'display-mode': !editMode}">
      <span>Committee</span>
      <h1 v-bind:contenteditable="editMode" ref = "committeeRef">
      </h1>
    </div>


    <div class = "btns">
      <img v-if = "!editMode" class = "icon" src = "../assets/edit.svg" v-on:click = "edit" v-on:touchstart = "edit"/>
      <img v-if = "editMode" class = "icon" src = "../assets/checked.svg" v-on:click = "pushEdits" v-on:touchstart = "pushEdits"/>
      <img v-if = "editMode" class = "icon icon-right" src = "../assets/cancel.svg" v-on:click = "cancel" v-on:touchstart = "cancel"/>
    </div>
  </div>
</template>

<script>
const fire = require('../firebaseConfig.js');
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
      firstName: '',
      mode: false,
      lastName: '',
      unit: '',
      committee: '',
      editMode: false
    }
  },
  methods: {
    edit(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        this.editMode = true;
      }
    },
    cancel(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        this.editMode = false;
        this.restore()
      }
    },
    pushEdits(e){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        this.editMode = false;
        const updates = {
          name: this.$refs.firstNameRef.innerText + ' ' + this.$refs.lastNameRef.innerText,
          unit: parseInt(this.$refs.unitRef.innerText)<=8 ? parseInt(this.$refs.unitRef.innerText): 'Not a valid unit.',
          committee: this.$refs.committeeRef.innerText
        }
        fire.database.ref('users/'+this.user.uid).update(updates)
        restor();
      }
    },
    restore(){
      this.$refs.firstNameRef.innerText = this.user.name.split(' ')[0];
      if(!(this.$refs.lastNameRef.innerText = this.user.name.split(' ')[1])){
        this.$refs.lastNameRef.innerText = '';
      }
      this.$refs.unitRef.innerText = this.user.hasOwnProperty('unit')? this.user.unit:'';
      this.$refs.committeeRef.innerText = this.user.hasOwnProperty('committee')? this.user.committee:'';
    },
    input(field, type){
      let value = this.$refs[field + 'Ref'].innerText
      //Maybe edit input
      this[field] = this.$refs[field + 'Ref'].innerText;
    },
    notNum(a){
      if( ((a < '0')||(a > '9')) && ((a != '-')&&(a != '.')) ){
        return true
      }else{
        return false
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

  },
  mounted(){
    this.restore();
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');

.field{
  position: relative;
  width: calc(100% - 2*1vw - 2*4vw);
  height: 6vh;
  color: white;
  padding: 1vh 4vw;
  border-radius: 5vh;
  margin-bottom: 4vh;
}
.edit-mode{
  background-color: rgba(200, 200, 200, 0.3);
  border: 1vw solid rgba(0,0,0,0.5);
}
.edit-mode span{
  background: rgb(0, 0, 0, 0.6);
  background-blend-mode: multiply;
  border: 1vw solid rgba(0,0,0,0);
}
.display-mode{
  background-color: rgb(0, 0, 0, 0.6);
  border: 1vw solid rgba(0,0,0,0);
}
.display-mode span{
  background-blend-mode: add;
  border: 1vw solid rgba(0,0,0,0.6);
}

.top{
  margin-top: 1.8vh;
}
.field span{
  background-image: url("../assets/stucco.jpg");
  background-position: 50% -8vh;
  background-size: 100vmax;
  background-attachment: fixed;
  height: auto;
  font-size: 2.2vh;
  line-height: 2vh;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 5vw;
  padding: 0.25vw 1.5vw;
  border-radius: 2vh;
  transform: translateY(-2.25vh);
}
.field h1{
  border-radius: 3vh;
  font-size: 5vh;
  margin: 0;
  font-weight: lighter;
  outline: 0;
  outline-offset: -10px;
}
.btns{
  width: calc(100% - 2*4vw);
  height: 16vw;
  position: fixed;
  bottom: 4vw;
}

</style>
