// src/models/MessageModel.js
import { ref, set, get, update } from 'firebase/database';
import { db } from '../firebase/firebaseConfig'; // Import your Firebase configuration
import DirectChatController from '@/Contollers/Chat';
class Message {
    constructor(chatId,message,sender,Controller) {
        this.chatId = chatId;
        this.message = message
        this.sender = sender
        this.controller = Controller;
    }

 async save(){
    try{

        let msgRef = ref(db,`messages/${this.chatId}`);

        let newMsgRef = push(msgRef);

        let domain =  import.meta.env.VITE_APP_FIREBASE_URL+"/v0/b/"+import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET
        
        console.log(result,"ww",domain)

        const message = {
          ...this.message,
          id : newMsgRef.key,
          message : this.message.type ? "Sent A file" : this.message ,
          type : this.message.type ?  "file" : "text",
          download : result.replace(domain,""),
          downloadName : msg.type ? msg.name : null,
          time : Date.now(),
          sender: this.sender, 
          chatId: chatId 
        }

        await set(newMsgRef,message)

        message.sender = {name:state.value.user.displayName,photoURL:state.value.user.photoURL,email:state.value.user.email};

        console.log({[newMsgRef.key]:message})

    }
    catch(err){
        
    }

}

    async updateMessage(data) {
        const chatRef = ref(db, `messages/${this.chatId}/${this.message.id}`);
        await update(chatRef, data);
    }

}

export default Message;