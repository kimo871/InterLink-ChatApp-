import { ref as useState, watch } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from "firebase/storage"
import { ref , set , get , child , push,update,onValue} from 'firebase/database';

export const useStore = defineStore('store', () => {

  
  let state = useState({
    loading:{
      recentChats:false,
      chatBody : false
    },
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

  // Watch the feedback object deeply
  watch(
    () => state.value.user,
    (newMsg) => {
      if (newMsg) {
        console.log(state.value.user.email);
      // 1000 milliseconds = 1 second
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


watch(
  () => state.value.recentChats,
  (newMsg) => {
    if (newMsg) {
      console.log(state.value.recentChats);
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
    //state.value.loading = true;
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
  

  const uploadImage = async (file) => {
    try {
      //state.loading = true;
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
      //state.loading = false;
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


  const clearFeedback = ()=>{
    state.feedback  = {status:null,msg:""}
  }

  const getByEmail = async (userEmail)=>{
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

  const checkChat = async()=>{
    try{
     let chatRef1 = ref(db,`userChats/${state.value.user.email.replace(/\./g, ',')}`)

     let chatRef2 = ref(db,`userChats/${state.value.openedChat.userData.email.replace(/\./g, ',')}`)


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

  const sendMessage = async(msg)=>{
    console.log("here.......")
    
      try{
        let answer = await checkChat();

        console.log(answer)

        if(!answer){
         answer = await createChat();
        } 

        await createMessage(answer,msg);


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

  const createChat = async ()=>{
      try{
        //state.loading = false;
        const chatRef = ref(db,`chats`);
        const newChatRef = push(chatRef);
        const key = newChatRef.key;
        const email= state.value.user.email;
        const email1 = state.value.openedChat.userData.email
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
          [key] : true
         })

         const userChatRef2 = ref(db,`userChats/${email1.replace(/\./g, ',')}`);

         await update(userChatRef2,{
          [key] : true
         })

        return key;
      }
      catch(err){
        console.log(err);
      }
      finally{
        //state.loading = false;
      }
  }

  const createMessage = async (chatId,msg)=>{
    try{
      state.loading=true;

      let msgRef = ref(db,`messages/${chatId}`);

       let newMsgRef = push(msgRef);

       const message = {
        message : msg,
        time : Date.now(),
        sender: state.value.user.email, // Example additional field
        chatId: chatId // Example additional field
       }

       await set(newMsgRef,message)

       message.sender = {name:state.value.user.displayName,photoURL:state.value.user.photoURL,email:state.value.user.email};

       console.log({[newMsgRef.key]:message})

       updateChat(chatId,msg);

       state.value.openedChat.messages = {...state.value.openedChat.messages , [newMsgRef.key]:message}

       


    }
    catch(err){
     console.log(err);
    }
    finally{
      state.loading = false;
    }
  }

  const getMessages = async(chatId,userDetails)=>{
     try{
      state.value.openedChat= null;
      state.value.loading.chatBody=true;
      let result= {};
       const chatRef = ref(db,`messages/${chatId}`);
       const dataRef = await get(chatRef);
       let messages = dataRef.val();
       console.log(Object.values(messages));
       for await ( let [key,item] of Object.entries(dataRef.val())){
        let userRef = ref(db,`users/${item.sender.replace(/\./g, ',')}`);
        let userData = await get(userRef);
        userData = userData.val();
        item.sender = userData;
        result[key]=item;
       }
       
      //  let userRef = ref(db,`users/${Object.values(messages)[0].sender.replace(/\./g, ',')}`);
      //  let userData = await get(userRef);
      //  userData = userData.val();
       state.value.openedChat= {userData:userDetails,messages:result};
     }
     catch(err){
      console.log(err);
     }
     finally{
      state.value.loading.chatBody=false;
     }
  }



  const updateChat = async (chatId,msg) =>{
      try{
        const chatRef = ref(db,`chats/${chatId}`);
        await update(chatRef,{
          lastMessage:msg
         })
      }
      catch(err){
        console.log(err);
      }
      finally{
        state.loading=false;
      }
  }


  const fetchRecentChats = async() => {
    try {
      state.value.loading.recentChats = true;
      const userEmail = state.value.user.email.replace(/\./g, ',');
      const userChatsRef = ref(db, `userChats/${userEmail}`);
  
      onValue(userChatsRef, (snapshot) => {
        if (snapshot.exists()) {
          const chatIds = Object.keys(snapshot.val());
          const chatDetails = [];
  
          // Use Promise.all to fetch all chat details in parallel
          const fetchChatDetails = chatIds.map(async (chatId) => {
            try {
              const chatRef = ref(db, `chats/${chatId}`);
              const detailsSnapshot = await get(chatRef);
  
              if (detailsSnapshot.exists()) {
                const answer = detailsSnapshot.val();
                const otherUserEmail = Object.keys(answer.participants).find(email => email !== userEmail);
  
                if (otherUserEmail) {
                  const userRef = ref(db, `users/${otherUserEmail}`);
                  const userSnapshot = await get(userRef);
  
                  if (userSnapshot.exists()) {
                    const userDetails = userSnapshot.val();
                    chatDetails.push({ chatDetails: answer, userDetails });
                  } else {
                    console.error(`User details not found for ${otherUserEmail}`);
                  }
                } else {
                  console.error(`No other participant found for chat ${chatId}`);
                }
              }
            } catch (error) {
              console.error('Error fetching chat details:', error);
            }
          });
  
          // Wait for all chat details to be fetched before updating state
          Promise.all(fetchChatDetails)
            .then(() => {
              state.value.recentChats = chatDetails;
            })
            .catch((error) => {
              console.error('Error fetching chat details:', error);
            });
        } else {
          state.value.recentChats = []; // No chats found
        }
      });
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      state.value.recentChats = [];
    } finally {
      state.value.loading.recentChats = false;
    }
  };
  
  


  // const getChatDetails = async (chatId) => {
  //   try {
  //     const chatRef = ref(db, `chats/${chatId}`);
  //     const chatSnapshot = await get(chatRef);
  
  //     if (chatSnapshot.exists()) {
  //       const chatData = chatSnapshot.val();
  //       // Fetch the last message
  //       const messagesRef = ref(db, `chats/${chatId}/messages`);
  //       const messagesSnapshot = await get(messagesRef);
  //       const messages = messagesSnapshot.val();
  //       const lastMessage = messages ? Object.values(messages).pop() : null; // Get the last message
  
  //       return {
  //         chatId,
  //         participants: chatData.participants,
  //         lastMessage,
  //       };
  //     } else {
  //       return null; // Chat not found
  //     }
  //   } catch (err) {
  //     console.error('Error fetching chat details:', err);
  //     return null;
  //   }
  // };
  

  

  return { signUp, state,setFeedback,clearFeedback,logIn,uploadImage,saveUser,setFeedback,getByEmail,sendMessage,fetchRecentChats,getMessages}
})






