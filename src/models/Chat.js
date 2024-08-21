// src/models/UserChatModel.js
import { ref, set, get, update , push } from 'firebase/database';
import { db } from '../firebase/firebaseConfig'; // Import your Firebase configuration

class Chat {
    constructor() {

    }

    async save(){
        const chatRef = ref(db,this.chatsPath);
        const newChatRef = push(chatRef);
        const key = newChatRef.key;
        const snapshot =  await set(newChatRef,{
          chatId:key,
          name : this.name !=  null  ? this.name : null,
          lastMessage: null,
          lastTime: null,
        });

        return key;
    }


    async updateChat(chatId,message){
        try{
          const chatRef = ref(db,`${this.strategy.chatsPath}/${chatId}`);
          await update(chatRef,{
            lastMessage:message.message,
            lastTime:message.time
          })

        const groupRef = ref(db,`${this.strategy.userChatsPath}/${state.value.user.email.replace(/\./g, ',')}/${chatId}`)
        await update(groupRef,{
          lastReadTime:message.time,
          lastProcessedTime : message.time
        })
          console.log(message.time)
          
        }
        catch(err){
          console.log(err);
        }
        finally{
          console.log("here update")
          
        }
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

}

export default Chat;