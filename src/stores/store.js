import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebase/firebaseConfig';
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from "firebase/storage"
import {  doc, setDoc } from "firebase/firestore";

export const useStore = defineStore('store', () => {

  
  let state = ref({
    loading:false,
    user:null,
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


 


 const setFeedback = (status, msg) => {
    state.feedback = { status, msg };
  };
  
  const signUp =  async (userData)=>{
    try{
    state.loading=true;
    const auth = getAuth(app);
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

  const logIn = async(userData)=>{
    try{
    state.loading = true;
    const auth = getAuth(app);
    const credentials = await signInWithEmailAndPassword(auth,userData.email,userData.password);
    return credentials;
    }
    catch(err){
      state.feedback={
        status:400,
        msg:"Error In login "
      }
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
      const userRef = doc(db,"users",credentials.user.uid);
      await setDoc(userRef,{
        name : data.name,
        email: data.email,
        avatar : url
      })
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

  

  return { signUp, state,setFeedback,clearFeedback,logIn,uploadImage,saveUser,setFeedback}
})



