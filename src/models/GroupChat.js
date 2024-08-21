
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db,store} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL } from "firebase/storage"
import { ref , set , get , child , push,update,onValue,onChildChanged,off} from 'firebase/database';
import { debounce } from 'lodash';
import Chat from "./Chat";
class GroupChat extends Chat {
    constructor() {
        super();
        this.chatsPath="groups";
        this.userChatsPath="groupChats"
        this.userchatDetails="groups"
    }

    setName(name){
        this.name = name;
    }

    async save(){
        const key = await super.save();
        const groupChat = ref(db,`${this.userChatsPath}`);
        const users = ref(db,`users`);
        const snap = await get(users);
        console.log(snap)

        await Promise.all(Object.values(snap.val()).map(async(item)=>{
            try{
              const Ref = ref(db,`${this.userChatsPath}/${item.email.replace(/\./g, ',')}/${key}`);
             // const newRef = push(ref);
              let time = Date.now();
               await set(Ref,{
              unread:0,lastReadTime:time,lastProcessedTime:time
              });
            }
            catch(err){
               console.log(err);
            }
        }));

        return key;
      }

// =====================================================================================================

    async updateChat(data) {
        const chatRef = ref(db, `groupChats/${this.groupId}/${this.chatId}`);
        await update(chatRef, data);
    }

    


    async sendGroupMessage(msg,chatId){
        console.log("here.......",msg)
        
        try{
          await createGroupMessage(chatId,msg);
        }
        catch(err){
          console.log("error",err)
          this.store.state.value.feedback={
            status:400,
            msg:err.message
          }
        }
        finally{
          let chatDetails = state.value.recentChats;
          //chatDetails.sort((a, b) => b.chatDetails.lastTime - a.chatDetails.lastTime );
         // state.value.recentChats= [...chatDetails];
        }
      }


      async createGroupMessage(chatId,msg){
        try{
          //state.loading=true;

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

          await updateGroup(chatId,message);

          state.value.openedChat.messages = {...state.value.openedChat.messages , [newMsgRef.key]:message}
         
        }
        catch(err){
        console.log(err);
        }
        finally{
          state.loading = false;
        }
    }


    async sendMessage(msg,chatId){
      console.log("here.......",msg)
      
      try{
        await createMessage(chatId,msg);
      }
      catch(err){
        console.log("error",err)
        state.value.feedback={
          status:400,
          msg:err.message
        }
      }
      finally{
        let chatDetails = state.value.recentChats;
        //chatDetails.sort((a, b) => b.chatDetails.lastTime - a.chatDetails.lastTime );
       // state.value.recentChats= [...chatDetails];
      }
    }

}

export default GroupChat;