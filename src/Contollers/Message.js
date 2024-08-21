import Message from './MessageModel';
import DirectChatController from './DirectChat';
import { useStore } from '../stores/store.js';

const store = useStore();
console.log(store);

class MessageController {
    constructor() {
        this.Controller = new DirectChatController();
    }

    async createMessage (chatId,msg){
        try{
          state.loading=true;

          console.log(msg)

          let result = msg;

          if(msg.type){
            result = await uploadFile("files",msg);
            
            console.log("upload url...",result)
          }

         
          let msgRef = ref(db,`messages/${chatId}`);

          let newMsgRef = push(msgRef);

          let domain =  import.meta.env.VITE_APP_FIREBASE_URL+"/v0/b/"+import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET
          
          console.log(result,"ww",domain)

          const message = {
            id : newMsgRef.key,
            message : msg.type ? "Sent A file" : msg ,
            type : msg.type ?  "file" : "text",
            download : result.replace(domain,""),
            downloadName : msg.type ? msg.name : null,
            time : Date.now(),
            readBy:null,
            sender: {email:state.value.user.email,name:state.value.user.displayName,photoURL:state.value.user.photoURL}, // Example additional field
            chatId: chatId // Example additional field
          }

          await set(newMsgRef,message)

          message.sender = {name:state.value.user.displayName,photoURL:state.value.user.photoURL,email:state.value.user.email};

          console.log({[newMsgRef.key]:message})

          await this.Controller.updateChat(chatId,message);

          state.value.openedChat.messages = {...state.value.openedChat.messages , [newMsgRef.key]:message}
         
        }
        catch(err){
        console.log(err);
        }
        finally{
          state.loading = false;
        }
      }

}

export default MessageController;