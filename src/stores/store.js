import { computed, ref as useState, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db,store} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL } from "firebase/storage"
import { ref , set , get , child , push,update,onValue,onChildChanged,off} from 'firebase/database';
import { debounce } from 'lodash';
import GroupChat from '../models/GroupChat.js'
import ChatController from '@/Contollers/Chat';
export const useStore = defineStore('store', () => {
  
  let state = useState({
    loading:{
      recentChats:false,
      chatBody : false
    },
    searchQuery:"",
    mode:"chats",
    user:null,
    recentChats:[],
    openedChat:null,
    feedback:{ status: null, msg: '' },
  })


    // =================================================================================================

  const filteredResults = computed(() => {
    let res = {};
  
    const query = state.value.searchQuery.trim().toLowerCase();

    if(query=="") return state.value.recentChats;
  
    Object.values(state.value.recentChats).forEach((item) => {
      if (item.userDetails.name.toLowerCase().includes(query)) {
        res[item.chatId] = item;
      }
    });
  
    return res;
  });

  
  // =================================================================================================

  
  // Watch the feedback object deeply
watch(
  () => state.value.feedback.msg,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.feedback);
      setTimeout(() => {
      
        state.value.feedback = { status: null, msg: '' };
      }, 1000); 
    }
  },
  { deep: true } 
);

  // Watch the feedback object deeply
  watch(
    () => state.value.user,
    (newMsg) => {
      if (newMsg) {
        console.log(state.value.user.email);
     
      }
    },
    { deep: true } 
  );


watch(
  () => state.value.openedChat,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.openedChat);
      
    }
  },
  { deep: true } 
);


watch(
  () => state.value.recentChats,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.recentChats,"recentChats");
    }
  },
  { deep: true } 
);


watch(
  () => state.value.mode,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.mode,"mode");
    }
  },
  { deep: true } 
);

  

   // ===============================================================================================
  
    const signUp =  async (userData)=>{
      try{
      //state.value.loading=true;
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

   // ===============================================================================================

    const logIn = async (userData)=>{
      try{
      //state.value.loading.recentChats = true;
      const credentials = await  signInWithEmailAndPassword(auth,userData.email,userData.password);
      console.log(credentials)
      state.value.user = credentials.user;
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
        //state.value.loading = false;
      }
      }
  
  // ===============================================================================================

    const uploadFile = async (path,file) => {
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
    

   // ===============================================================================================

      const saveUser = async(data,file)=>{
        try{
          const url = await uploadFile("images",file);
          const credentials  = await signUp(data);

          const sanitizedEmail = data.email.toLowerCase().replace(/\./g, ','); // Replace dots with commas

          await updateProfile(credentials.user, {
            displayName: data.name,
            photoURL: url,
          });

          console.log(credentials.user.email)
          

          const userRef = ref(db,"users/"+sanitizedEmail);

          await set(userRef,{
            name : data.name,
            uid:credentials.user.uid,
            email : sanitizedEmail,
            photoURL : url
          });

          const controller = new ChatController("groups",store);
          await  controller.strategy.subscribeToGroups(sanitizedEmail)

          // save in user chats

          // save in group chats

          state.value.user = credentials.user;

          console.log("wwww")

          
        }
        catch(err){
          state.feedback = {
            status:400,
            msg:"Error in Request !"
          }
        }

        finally{
          //state.loading = false;
        }
        
      }

   // ===============================================================================================


      const clearFeedback = ()=>{
        state.feedback  = {status:null,msg:""}
      }

   // ==============================================================================================
  

  return { signUp, state,clearFeedback,logIn,uploadFile,saveUser,filteredResults}
})









