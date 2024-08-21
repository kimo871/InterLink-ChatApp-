// src/models/UserChatModel.js
import { ref, set, get, update } from 'firebase/database';
import { db } from '../firebase/firebaseConfig'; // Import your Firebase configuration
import Chat from './Chat';
class DirectChat extends Chat {
    constructor() {
      super();
      this.chatsPath="chats";
      this.userChatsPath="userChats"
      this.userchatDetails="users"
    }

    async save(){
      await super.save();

      const userChatRef = ref(db,`userChats/${email.replace(/\./g, ',')}`);

      await update(userChatRef,{
        [key] : {unread:0}
      })

      const userChatRef2 = ref(db,`userChats/${email1.replace(/\./g, ',')}`);

      await update(userChatRef2,{
        [key] : {unread:0}
      })
    }

    async getData(){
      return {
        key:this.key,
        chatId:this.chatId, 
        participants : this.participants ,
        lastMessage :this.lastMessage ,
        lastTime : this.lastTime ,
        sender : this.sender,
        receiver : this.receiver
      }
    }

  async updateChat(message) {
      try{
      await update(this.chatsRef,{
        lastMessage:message.message,
        lastTime:message.time
      })
    const userChatsRef = ref(db,`userChats/${sender.email.replace(/\./g, ',')}/${this.chatId}`)
    await update(userChatsRef,{
      lastReadTime:message.time,
      lastProcessedTime : message.time
    })
    }

    catch(err){
      console.log(err);
    }

  }  
}

export default DirectChat;