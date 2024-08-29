import DirectChat from '../models/DirectChat';
import Message from '../models/Message'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL } from "firebase/storage"
import { ref , set , get , child , push,update,onValue,onChildChanged,off} from 'firebase/database';
import { debounce } from 'lodash';
import { sendNotification } from '@/Services/notificationService';
class DirectChatController {
    constructor(store) {
        this.store = store;
        this.chatsPath="chats";
        this.userChatsPath="userChats";
    }

  //=====================================================================================================

  async handleForm(e){
    e.preventDefault()
    let formData = new FormData(e.target)
    let data = Object.fromEntries(formData.entries())
    const sanitizedEmail = data.email.replace(/\./g, ',')
    console.log(sanitizedEmail)
    this.getByEmail(sanitizedEmail)
  }

  async additionalDetails(answer,userEmail){
    const otherUserEmail = Object.keys(answer.participants).find(email => email !== userEmail);
      console.log(otherUserEmail)
        if (otherUserEmail) {
          const userRef = ref(db, `users/${otherUserEmail}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const userDetails = userSnapshot.val();
            console.log(userDetails)
            return {name:userDetails.name,photoURL:userDetails.photoURL,email:userDetails.email,deviceToken:userDetails?.deviceToken}
           }
       }
       return null;
    }
  

  // ==================================================================================================

  async getByEmail(userEmail){
    console.log("here.......")
    console.log(userEmail)
      try{
        //state.loading = false;
        const userRef = ref(db,`users`);
          // Reference to a child node with the sanitized email
        const childRef = child(userRef, userEmail);

        console.log('Child reference path:', childRef.toString());

      const snapshot =  await get(childRef);


      if(snapshot.exists()){
        const user = snapshot.val();
        let result = await this.checkChat(this.store.state.user.email,userEmail);
        if(result){
          this.getMessages(result,{...user});
        }
        else{
          
        }
        this.store.state.feedback={
          status:200,
          msg:"Account Found"
        }
        this.store.state.openedChat = {
          userData : user,
          messages:[],
          chatType:"chats"
          
        }
      }
        else {
          this.store.state.feedback={
            status:400,
            msg:"Account Not Found"
          }
        }

      }
      catch(err){
        console.log("error",err)
        this.store.state.feedback={
          status:400,
          msg:err.message
        }
      }
      finally{

      }
  }

  async sendMessage(msg,chatId=null){
    console.log("here.......",msg)
      try{
        let answer = await checkChat(this.store.state.user.email,this.store.state.openedChat.userData.email);

        console.log(answer)

        if(!answer){
        answer = await createChat(this.store.state.user.email,this.store.state.openedChat.userData.email);
        } 

        await this.basic.createMessage(answer,msg);

        await sendNotification(this.store.state.openedChat.userData.deviceToken,this.store.state.openedChat.userData.name,msg)

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
        chatDetails.sort((a, b) => b.chatDetails.lastTime - a.chatDetails.lastTime );
       state.value.recentChats= [...chatDetails];
      }
  }


  //====================================================================================================
  async uploadFile(path,file){
    try {
      console.log("gg",file)
      //state.loading = true;
      const storage = getStorage();
      const storagePath = storageRef(storage, `${path}/${file.name}`); // Ensure ref is used correctly
      await uploadBytes(storagePath, file); // Upload the file
      const url = await getDownloadURL(storagePath); // Get and return the download URL
      return url;
    } catch (err) {
      console.error("Error uploading image:", err); // Log the error
      state.feedback={
        status:400,
        msg:"Error uploading image"
      }
      // throw err
    }
    finally{
      //state.loading = false;
    }
  };
  //===================================================================================================

   async sendMessage(msg,chatId=null){
    
        console.log("here.......",msg)
        console.log(this.store.state.openedChat.userData.email.replace(/,/g, '.'))
        
          try{
            let answer = await this.checkChat(this.store.state.user.email,this.store.state.openedChat.userData.email.replace(/,/g, '.'));
    
      
            if(!answer){
            answer = await this.createChat(this.store.state.user.email,this.store.state.openedChat.userData.email.replace(/,/g, '.'));
            } 

            console.log(answer)
      
            await this.basic.createMessage(answer,msg);

            await sendNotification(this.store.state.openedChat.userData.deviceToken,this.store.state.openedChat.userData.name,msg)
      
          }
          catch(err){
            console.log("error",err)
            this.store.state.feedback={
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

    async createChat(email,email1){
      try{
        const chatsRef = ref(db,`chats`);
        const newChatRef = push(chatsRef);
        const key = newChatRef.key;
        const snapshot =  await set(newChatRef,{
          participants :{
            [email.replace(/\./g, ',')] : true,
            [email1.replace(/\./g, ',')] : true
          },
          chatId:key,
          lastMessage: null,
          lastTime: null,
        });
  
        const userChatRef = ref(db,`userChats/${email.replace(/\./g, ',')}`);
  
        await update(userChatRef,{
          [key] : {unread:0}
        })
  
        const userChatRef2 = ref(db,`userChats/${email1.replace(/\./g, ',')}`);

        

        const answer = await get(userChatRef2)

          await update(userChatRef2,{
            [key] : {unread:0}
          })
        
  
        let obj = {...this.store.state.openedChat};

          obj.chatId = key;
          obj.chatType="chats";

          //console.log(answer.val())

          this.store.state.openedChat = {
           ...this.store.state.openedChat,
           chatType:"chats",
           chatId:key,
        }
        return key;
      }
      catch(err){
        console.log(err);
      }
      finally{
        //state.loading = false;
      }
  }

    async checkChat(email,email1){
        try{
          console.log(email.replace(/\./g, ','),email1.replace(/\./g, ','))
            let chatRef1 = ref(db,`userChats/${email.replace(/\./g, ',')}`)
    
            let chatRef2 = ref(db,`userChats/${email1.replace(/\./g, ',')}`)
    
             const snapshot = await get(chatRef1);
    
             const snapshot1 = await get(chatRef2);
    
              console.log(snapshot.val())

              console.log(snapshot1.val())

              console.log("exits")
              console.log(snapshot.val())
    
              if(snapshot.exists() && snapshot1.exists()){
              // Convert chats to sets for easier intersection check
              const chatIdsUser1 = new Set(Object.keys(snapshot.val()));
              const chatIdsUser2 = new Set(Object.keys(snapshot1.val()));
    
              console.log(chatIdsUser1)
    
              console.log(chatIdsUser2)
    
              // Check for intersection
              let intersection = false;
              [...chatIdsUser1].forEach(chatId => {if(chatIdsUser2.has(chatId)) intersection = chatId});
              console.log(intersection)
              return intersection;
              }
              else{
                return false
              }
            }
            catch(err){
            console.log(err)
            }
            finally{
            //state.loading=false;
            }
    }
  
}

export default DirectChatController;
