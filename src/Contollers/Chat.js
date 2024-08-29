import DirectChat from '../models/DirectChat';
import Message from '../models/Message'
import DirectChatController from './DirectChat';
import GroupChatController from './GroupChat';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth,db} from "../firebase/firebaseConfig"
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL } from "firebase/storage"
import { ref , set , get , child , push,update,onValue,onChildChanged,off} from 'firebase/database';
import { debounce } from 'lodash';
class ChatController {
     strategies = new Map()
    constructor(strategy,store) {
        this.strategies.set('groups', GroupChatController);
        this.strategies.set('chats',  DirectChatController);
        this.store = store;
        this.setStrategy(strategy);  
        this.debouncedListenRecentMessages = debounce(async (chatId, messageSnapshot, chatDetails) => {
           await this.listenRecentMessages(chatId, messageSnapshot, chatDetails);
       }, 700); // Adjust debounce delay as needed  
    }

    setStrategy(strategy) {
        if (this.strategies.has(strategy)) {
            const StrategyClass = this.strategies.get(strategy);
            this.strategy = new StrategyClass(this.store);
            this.strategy.basic = this;
        } else {
            throw new Error(`Strategy ${strategy} not found`);
        }
    }

// =======================================================================================================

    async createChat(){
        
    }

//=====================================================================================================


    handleForm(e){}

//=====================================================================================================

    async updateChat(chatId,message){
        try{
          const chatRef = ref(db,`${this.strategy.chatsPath}/${chatId}`);
          await update(chatRef,{
            lastMessage:message.message,
            lastTime:message.time
          })
        const userChatRef = ref(db,`${this.strategy.userChatsPath}/${this.store.state.user.email.replace(/\./g, ',')}/${chatId}`)
        await update(userChatRef,{
          unread:0,
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


 

  
// =======================================================================================================
// Method to remove chat listener
removeChatListener(chatId) {
    if (this.store.state.messageListeners?.[chatId]) {
        const messageRef = ref(db, `messages/${chatId}`);
        off(messageRef); // Remove the existing listener
        console.log(`Listener removed for chatId ${chatId}`);
    }
}

// Method to add chat listener
addChatListener(chatId) {
    if (!this.store.state.messageListeners?.[chatId]) {
        const messageRef = ref(db, `messages/${chatId}`);
        this.store.state.messageListeners = {
            ...this.store.state.messageListeners,
            [chatId]: onValue(messageRef, async (messageSnapshot) => {
                await this.listenRecentMessages(chatId, messageSnapshot);
            })
        };
        console.log(`Listener added for chatId ${chatId}`);
    }
}




async listenRecentMessages(chatId, messageSnapshot, chatDetails) {
    this.store.state.isUpdating = true;
    console.log("Message added");

    const messages = messageSnapshot.val();
    console.log(messages)
    console.log("Received messages:", messages);

    const existingChatIndex = chatDetails.findIndex(chat => chat.chatDetails.chatId === chatId);
    console.log("Existing chat index:", existingChatIndex);

    if (existingChatIndex !== -1) {
        const chat = { ...chatDetails[existingChatIndex] }; // Create a shallow copy
        const lastProcessedTime = chat.userDetails.lastProcessedTime || 0;

        const newMessages = (messages)!=null ?  Object.values(messages).filter(message => message.time > lastProcessedTime) : [];
        console.log("New messages:", newMessages);

        if (newMessages.length > 0) {
            const latestMessage = newMessages[newMessages.length - 1];

            // Update chatDetails with immutable patterns
            chat.chatDetails = {
                ...chat.chatDetails,
                lastMessage: latestMessage.message,
                lastTime: latestMessage.time,
            };

            const userEmail = this.store.state.user.email.replace(/\./g, ',');

            if (this.store.state.openedChat?.chatId !== chatId) {
                const previousUnread = chat.userDetails.unread || 0;
                chat.userDetails = {
                    ...chat.userDetails,
                    unread: previousUnread + newMessages.length,
                };
            } else {
                this.store.state.openedChat = {
                    ...this.store.state.openedChat,
                    messages: { ...messages },
                };
                chat.userDetails = {
                    ...chat.userDetails,
                    unread: 0,
                    lastReadTime: latestMessage.time,
                };
            }

            chat.userDetails.lastProcessedTime = latestMessage.time;

            // Update chatDetails array immutably
            const updatedChatDetails = [
                chat,
                ...chatDetails.filter((_, index) => index !== existingChatIndex),
            ].sort((a, b) => b.chatDetails.lastTime - a.chatDetails.lastTime);

            this.store.state.recentChats = [...updatedChatDetails];

            // Persist changes to the database
            const readChatRef = ref(db, `${this.strategy.userChatsPath}/${userEmail}/${chatId}`);
            try {
                await update(readChatRef, {
                    unread: chat.userDetails.unread,
                    lastReadTime: chat.userDetails.lastReadTime,
                    lastProcessedTime: chat.userDetails.lastProcessedTime,
                });
                console.log(`Updated chatId ${chatId} with unread count ${chat.userDetails.unread}`);
            } catch (error) {
                console.error(`Failed to update chatId ${chatId}:`, error);
            }
        }
    }

    this.store.state.isUpdating = false;
}


async fetchRecentChats() {
    try {
        this.store.state.loading.recentChats = true;
        this.store.state.recentChats = null;

        const userEmail = this.store.state.user.email.replace(/\./g, ',');
        const userChatsRef = ref(db, `${this.strategy.userChatsPath}/${userEmail}`);

        // Remove old listener if needed
        if (this.store.state.chatListener) {
            off(userChatsRef);  // Cleanup old listener if it exists
        }

        // Debounced function to handle updates
        const handleUpdates = debounce(async (snapshot) => {
            if (snapshot.exists()) {
                const chatIds = Object.keys(snapshot.val());
                let chatDetails = [];

                const fetchChatDetails = chatIds.map(async (chatId) => {
                    try {
                        const chatRef = ref(db, `${this.strategy.chatsPath}/${chatId}`);
                        const detailsSnapshot = await get(chatRef);

                        const userChatRef = ref(db, `${this.strategy.userChatsPath}/${userEmail}/${chatId}`);
                        const userVal = await get(userChatRef);

                        if (!userVal.exists()) {
                            return; 
                        }

                        const userInfo = userVal.val();
                        if (detailsSnapshot.exists()) {
                            const chatData = detailsSnapshot.val();
                            const additionalData = await this.strategy.additionalDetails(chatData, userEmail);

                            

                            if (!this.store.state.messageListeners[chatId]) {
                                const messageRef = ref(db, `messages/${chatId}`);
                                this.store.state.messageListeners[chatId] = onValue(messageRef, async (messageSnapshot) => {
                                    this.debouncedListenRecentMessages(chatId, messageSnapshot, chatDetails);
                                });
                            }

                            chatDetails.push({
                                chatDetails: {
                                    chatId,
                                    lastMessage: chatData.lastMessage,
                                    lastTime: chatData.lastTime
                                },
                                userDetails: {
                                    ...additionalData,
                                    lastReadTime: userInfo.lastReadTime || 0,
                                    lastProcessedTime: userInfo.lastProcessedTime,
                                    unread: userInfo.unread || 0
                                }
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching details for chatId ${chatId}:`, error);
                    }
                });

                await Promise.all(fetchChatDetails).then(() => {
                    chatDetails.sort((a, b) => b.chatDetails.lastTime - a.chatDetails.lastTime);
                    this.store.state.recentChats = chatDetails;
                });
            } else {
                this.store.state.recentChats = []; 
            }
        }, 700); // Adjust debounce delay as needed (e.g., 200ms)

        const chatListener = onValue(userChatsRef, handleUpdates);
        this.store.state.chatListener = chatListener;

        if (!this.store.state.messageListeners) {
            this.store.state.messageListeners = {};
        }

    } catch (error) {
        console.error('Error fetching recent chats:', error);
        this.store.state.recentChats = [];
    } finally {
        this.store.state.loading.recentChats = false;
    }
}


    //=====================================================================================================


    async createMessage(chatId,msg){
        try{
         // state.loading=true;

          console.log(msg)

          let result = msg;

          if(msg.type){
            result = await this.store.uploadFile("files",msg);
            
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
            download : result,
            downloadName : msg.type ? msg.name : null,
            time : Date.now(),
            readBy:null,
            sender: {email:this.store.state.user.email,name:this.store.state.user.displayName,photoURL:this.store.state.user.photoURL}, // Example additional field
            chatId: chatId // Example additional field
          }

          await set(newMsgRef,message)

          message.sender = {name:this.store.state.user.displayName,photoURL:this.store.state.user.photoURL,email:this.store.state.user.email};

          console.log({[newMsgRef.key]:message})

          await this.updateChat(chatId,message);

          this.store.state.openedChat.messages = {...this.store.state.openedChat.messages , [newMsgRef.key]:message}
         
        }
        catch(err){
        console.log(err);
        }
        finally{
         // this.store.state.loading = false;
        }
    }

//=====================================================================================================

    async getMessages(chatId,userDetails){
        try{
          this.store.state.openedChat= null;
          this.store.state.loading.chatBody=true;
          let result= {};
          const chatRef = ref(db,`messages/${chatId}`);
          const dataRef = await get(chatRef);
          let messages = dataRef.val();
          if(messages){
          for ( let [key,item] of Object.entries(dataRef.val())){
            result[key]=item;
          }
        }
          
          const read1 = ref(db,`${this.strategy.userChatsPath}/${this.store.state.user.email.replace(/\./g, ',')}/${chatId}`);
           await update(read1,{unread:0,lastProcessedTime:Date.now(),lastReadTime:Date.now()});

          
          this.store.state.openedChat= {userData:userDetails,messages:result,chatId:chatId,chatType:this.strategy.chatsPath};

          let obj = [...this.store.state.recentChats];

          this.store.state.recentChats = obj.map((item)=> item.chatDetails.chatId == chatId ? {...item,userDetails:{...item.userDetails,unread:0}} : item )
        }
        catch(err){
          console.log(err);
          //state.value.openedChat= {userData:userDetails,messages:[]};
        }
        finally{
          this.store.state.loading.chatBody=false;
        }
      }


    
      // ===============================================================================================
    async reactMessage(chatId,messageId,emoji){
      try{
       const msgRef = ref(db,`messages/${chatId}/${messageId}`);
       await update(msgRef,{
        reaction :  emoji
       })
         
       if (this.store.state.openedChat?.chatId === chatId) {
        const messages = this.store.state.openedChat.messages;
        Object.values(messages).forEach((item) => {
            if (item.id === messageId) {
                item["reaction"] = emoji;
            }
        });

        // Trigger a reactivity update by assigning the updated messages back to the store
        this.store.state.openedChat.messages = { ...messages };
    }
      }

      catch(err){
        console.log(err);
      }
    }

    
}

export default ChatController;