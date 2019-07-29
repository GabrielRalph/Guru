<template>
  <div class = "admin">
    <input class = "search-bar" placeholder="Search Members" v-model="search"/>
    <div class = "table" v-on:touchmove = "scroll">

      <div v-for ="usera in sortusers" class = "row" v-if = "!usera.hidden" v-bind:key = "usera.uid">
        <img class = "user-dp" v-bind:src = "usera.dpURL"/> <!--  v-on:click = "switchMode($event, usera.uid)" v-on:touchstart = "switchMode($event, usera.uid)"  -->
        {{usera.name}}
        <img class = "status" v-bind:src = "buttonMode(usera)" v-on:click = "statusChange($event, usera)" v-on:touchstart = "statusChange($event, usera)"/>
      </div>
    </div>
  </div>
</template>

<script>
const fire = require('../firebaseConfig.js')

export default {
  data () {
    return {
      mode: false,
      search: '',
      users: {},
      usersList: []
    }
  },
  methods: {
    scroll(){
      enable.default();
    },
    // toggleMode(e){
    //   if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
    //     if(this.user.admin){
    //       this.adminMode = !this.adminMode;
    //     }
    //   }
    // },


    switchMode(e, uid){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
      //   this.users[uid].mode++;
      //
      //   if(this.users[uid].mode > 2){
      //     this.users[uid].mode = 0;
      //   }
      //   this.$forceUpdate(uid);
      }
    },
    statusChange(e, user){
      if(((e.type == 'click')&&!this.mode)||((e.type == 'touchstart')&&this.mode)){
        //if(user.mode == 0){
          var userRef = fire.database.ref('users/' + user.uid);
          userRef.update({doorAccess: !user.doorAccess});

        // }else if(user.mode == 1){
        //   var userRef = fire.database.ref('users/' + user.uid);
        //   userRef.update({doorAccess: !user.doorAccess});
        //   userRef.update({hidden: !user.hidden});
        // }else if(user.mode == 2){
        //   var userRef = fire.database.ref('users/' + user.uid);
        //   userRef.remove();
        // }
      }
    },
    buttonMode(user){
      if(user.mode == 0){
        if(user.doorAccess){
          return '/dist/checked.svg'
        }else{
          return '/dist/cancel.svg'
        }
      }else if(user.mode == 1){
        return '/dist/archive.svg'

      }else if(user.mode == 2){
        return '/dist/delete.svg'
      }

    },

  },
  computed:{
    sortusers(){
      let list = this.usersList.sort((a,b)=> (a.name > b.name) ? 1:-1);
      let finalList = [];
      for(let listItem in list){
        if(Object.values(list[listItem]).join().toUpperCase().includes(this.search.toUpperCase())){
          finalList.push(list[listItem])
        }
      }
      console.log(finalList)
      return finalList
    }
  },
  created(){
    this.mode = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    fire.database.ref('users').on('value', (sp)=>{
      this.users = sp.val();
      this.usersList = [];
      for(var usera in this.users){
        this.usersList.push(this.users[usera]);
        if(!this.users[usera].hidden){
          this.users[usera]['mode'] = 0;
        }
      }
    });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
.admin{
  height: calc(100% - 6vh);
  padding-top: 5vh;
}
.search-bar{
  background: rgba(0, 0, 0, 0.6);
  width:calc(100% - 6vw);
  transform: translateY(-5vh);
  float: left;
  height: 5vh;
  padding: 0 3vw;
  margin: 0 0 1vh 0;
  border-radius: 2.5vh;
  color: white;
  font-size: 3vh;
  outline:none;
  border:none;
}
.user-dp{
  cursor: pointer;
  height: 8vh;
  width: 8vh;
  margin-right: 3vw;
  border-radius: 4vh;
  float: left;
  touch-action: manipulation;
}
.status{
  /* background: rgba(255, 255, 255, 0.9); */
  height: 7vh;
  width: 7vh;
  padding: 0.5vh;
  border-radius: 4vh;
  float: right;
  cursor: pointer;

}
.table{
  overflow: auto;
  width: 100%;
  height: 100%;
  transform: translateY(-5vh);
  display: block;
  touch-action: manipulation;

}
.row{
  background: rgba(0, 0, 0, 0.6);
  width: calc(100% - 2vh);
  height: 8vh;
  padding: 1vh;
  margin: 0.5vh 0 ;
  border-radius: 5vh;
  font-size: 2vh;
  line-height: 8vh;
  color: white;
  touch-action: manipulation;

}
.header{
  width: 16vw;
  float: right;
  display: inline-block;
  height: 55vw;
  margin: 3vw;
}
::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: white;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: white;
}

</style>
