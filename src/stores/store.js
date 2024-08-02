import { ref as useState, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from "firebase/storage"
import { ref , set , get , child , push,update} from 'firebase/database';

export const useStore = defineStore('store', () => {

  
  let state = useState({
    loading:false,
    user:null,
    recentChats:[],
    openedChat:null,
    feedback:{ status: null, msg: '' },
  })


  // Watch the feedback object deeply
watch(
  () => state.value.feedback.msg,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.feedback);
      setTimeout(() => {
        // Reset feedback after a timeout
        state.value.feedback = { status: null, msg: '' };
      }, 1000); // 1000 milliseconds = 1 second
    }
  },
  { deep: true } // Enable deep watching
);


watch(
  () => state.value.openedChat,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.openedChat);
      // 1000 milliseconds = 1 second
    }
  },
  { deep: true } // Enable deep watching
);


 


 const setFeedback = (status, msg) => {
    state.feedback = { status, msg };
  };
  
  const signUp =  async (userData)=>{
    try{
    state.value.loading=true;
    const credentials = await createUserWithEmailAndPassword(auth,userData.email,userData.password);
    return credentials;
  }
    catch(err){
      console.log("ddddddddddddddddddd");
      console.log(state.value)
      state.value.feedback={
        status:400,
        msg:"Error In Signing Up"
      }
    }
  }

  const logIn = async (userData)=>{
    try{
    state.value.loading = true;
    const credentials = await  signInWithEmailAndPassword(auth,userData.email,userData.password);
    console.log(credentials)
    state.value.feedback = {
      status:200,
      msg:"Logged In"
    }
    return;
    }
    catch(err){
      console.log(err)
     state.value.feedback  = {
      status : 400,
      msg : "Invalid Credentials"
     }
    }
    finally{
      state.value.loading = false;
    }
    }
  

  const uploadImage = async (file) => {
    try {
      state.loading = true;
      const storage = getStorage();
      const storagePath = storageRef(storage, `images/${file.name}`); // Ensure ref is used correctly
      await uploadBytes(storagePath, file); // Upload the file
      const url = await getDownloadURL(storagePath); // Get and return the download URL
      return url
    } catch (err) {
      console.error("Error uploading image:", err); // Log the error
      state.feedback={
        status:400,
        msg:"Error uploading image"
      }
      // throw err
    }
    finally{
      state.loading = false;
    }
  };

  const saveUser = async(data,file)=>{
    try{
      const url = await uploadImage(file);
      const credentials  = await signUp(data);

      await updateProfile(credentials.user, {
        displayName: data.name,
        photoURL: url
      });

      console.log(credentials.user.email)
      const sanitizedEmail = data.email.replace(/\./g, ','); // Replace dots with commas

      const userRef = ref(db,"users/"+sanitizedEmail);

      await set(userRef,{
        name : data.name,
        uid:credentials.user.uid,
        email : data.email ,
        photoURL : url
       });

      console.log("wwww")

      
    }
    catch(err){
      state.feedback = {
        status:400,
        msg:"Error in Request !"
      }
    }

    finally{
       state.loading = false;
    }
    
  }


  const clearFeedback = ()=>{
    state.feedback  = {status:null,msg:""}
  }

  const getByEmail = async (userEmail)=>{
    console.log("here.......")
    console.log(userEmail)
      try{
        state.loading = false;
        const userRef = ref(db,`users`);
           // Reference to a child node with the sanitized email
        const childRef = child(userRef, userEmail);

        console.log('Child reference path:', childRef.toString());

       const snapshot =  await get(childRef);

       

       if(snapshot.exists()){
        const user = snapshot.val();
        state.value.feedback={
          status:200,
          msg:"Account Found"
        }
        state.value.openedChat = {
          userData : user,
          messages:[]
        }
       }
        else {
          state.value.feedback={
            status:400,
            msg:"Account Not Found"
          }
        }

      }
      catch(err){
        console.log("error",err)
        state.value.feedback={
          status:400,
          msg:err.message
        }
      }
      finally{

      }
  }

  const sendMessage = async(msg)=>{
    console.log("here.......")
    
      try{
        state.loading = false;
        const chatRef = ref(db,`chats`);
        const newChatRef = push(chatRef);
        const key = newChatRef.key;
        //    // Reference to a child node with the sanitized email
        // const childRef = child(userRef, userEmail);

        //console.log('Child reference path:', childRef.toString());

        

       const snapshot =  await set(newChatRef,{
        participants : ["mku0@gmail.com",state.value.openedChat.userData.email],
        lastMessage: null,
        lastTime: null,
       });

       await update(newChatRef,{
        lastMessage:"kimo is here ",
        lastTime : 2
       })

       let msgRef = ref(db,"messages");

       let newMsgRef = push(msgRef);

       await set(newMsgRef,{
         message : msg,
         time : Date.now()
       })

      }
      catch(err){
        console.log("error",err)
        state.value.feedback={
          status:400,
          msg:err.message
        }
      }
      finally{

      }
  }

  

  return { signUp, state,setFeedback,clearFeedback,logIn,uploadImage,saveUser,setFeedback,getByEmail,sendMessage}
})






