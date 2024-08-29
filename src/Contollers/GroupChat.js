import GroupChat from '../models/GroupChat';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db,store} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL } from "firebase/storage"
import { ref , set , get , child , push,update,onValue,onChildChanged,off} from 'firebase/database';
import { debounce } from 'lodash';
import groupIcon from '../assets/icons/group.png';

class GroupChatController {
    constructor(store) {
        this.store = store;
        this.model = new GroupChat();
        this.chatsPath="groups";
        this.userChatsPath="groupChats";
    }

    async handleForm(e) {
         e.preventDefault()
          let formData = new FormData(e.target)
          let data = Object.fromEntries(formData.entries())
          let name = data.name;
          this.model.setName(name);
          const key = await this.model.save();
          let obj = {...this.store.state.openedChat};

          obj.chatId = key;
          obj.chatType="groups";

          this.store.state.openedChat = obj;

          this.store.state.openedChat = {
           userData : {name:this.model.name , photoURL:groupIcon},
           messages:[],
           chatType:"groups",
           chatId:key,
        }

        console.log(this.store.state.openedChat)
    }

    async subscribeToGroups(userId){
           const groupsRef = ref(db,`groups`);
           const answer = await get(groupsRef);
           const userRef = ref(db,`users/${userId}`)
           const userChat = ref(db,`groupChats/${userId}`)
           let res ={};
           if(answer.exists()){
           Object.values(answer.val()).forEach(async(item)=>{
               res[item.chatId] = {unread:0,lastProcessedTime:0,lastReadTime:0}
           })
           await set(userChat,res);
        }
    }

    // =============================================================================================

   

    async updateChat(key, data) {
        const chat = this.chats[key];
        if (chat) {
            await chat.updateChat(chat.chatId, data);
            Object.assign(chat, data);
            return chat.getData();
        }
        return null;
    }

    generateKey(chatId, participants) {
        return `${chatId}_${participants[0].replace(/\./g, ',')}_${participants[1].replace(/\./g, ',')}`;
    }

    async additionalDetails(answer,userEmail){
        return {name:answer.name , photoURL:groupIcon};
}


 async sendMessage(msg,chatId){
    console.log("here.......",msg)
    try{
      await this.basic.createMessage(chatId,msg);
    }
    catch(err){
      console.log("error",err)
      state.value.feedback={
        status:400,
        msg:err.message
      }
    }
    finally{
      let chatDetails = this.store.state.recentChats;
      chatDetails.sort((a, b) => b.chatDetails.lastTime - a.chatDetails.lastTime );
     this.store.state.recentChats= [...chatDetails];
    }
  }
}

export default GroupChatController;