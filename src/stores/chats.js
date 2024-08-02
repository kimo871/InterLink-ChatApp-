import { ref as useState, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from "firebase/storage"
import { ref , set , get , child} from 'firebase/database';

export const useStore = defineStore('store', () => {

  
  let state = useState({
    recentChats:[],
    openedChat:null,
    Feedback:{ status: null, msg: '' },
  })

  const fetchOpenedChat = async ()=>{
     
  }





 


 const setFeedback = (status, msg) => {
    state.feedback = { status, msg };
  };
  

  

  return { setFeedback}
})
