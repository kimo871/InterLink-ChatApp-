import { ref as useState, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth, db } from '../firebase/firebaseConfig'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref, set, get, child, push, update } from 'firebase/database'

export const useStore = defineStore('store', () => {
  let state = useState({
    loading: false,
    user: null,
    recentChats: [],
    recentGroups: [],
    openedChat: null,
    feedback: { status: null, msg: '' }
  })

  // Watch the feedback object deeply
  watch(
    () => state.value.feedback.msg,
    (newMsg) => {
      if (newMsg) {
        console.log(state.value.feedback)
        setTimeout(() => {
          // Reset feedback after a timeout
          state.value.feedback = { status: null, msg: '' }
        }, 1000) // 1000 milliseconds = 1 second
      }
    },
    { deep: true } // Enable deep watching
  )

  // Watch the feedback object deeply
  watch(
    () => state.value.user,
    (newMsg) => {
      if (newMsg) {
        console.log(state.value.user.email)
        // 1000 milliseconds = 1 second
      }
    },
    { deep: true } // Enable deep watching
  )

  watch(
    () => state.value.openedChat,
    (newMsg) => {
      if (newMsg) {
        console.log(state.value.openedChat)
        // 1000 milliseconds = 1 second
      }
    },
    { deep: true } // Enable deep watching
  )

  watch(
    () => state.value.recentChats,
    (newMsg) => {
      if (newMsg) {
        console.log(state.value.recentChats)
        // 1000 milliseconds = 1 second
      }
    },
    { deep: true } // Enable deep watching
  )
  watch(
    () => state.value.recentGroups,
    (newGroup) => {
      if (newGroup) {
        console.log(state.value.recentGroups)
        // 1000 milliseconds = 1 second
      }
    },
    { deep: true } // Enable deep watching
  )

  const setFeedback = (status, msg) => {
    state.value.feedback = { status, msg }
  }

  const signUp = async (userData) => {
    try {
      state.value.loading = true
      const credentials = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )
      return credentials
    } catch (err) {
      console.log('ddddddddddddddddddd')
      console.log(state.value)
      state.value.feedback = {
        status: 400,
        msg: 'Error In Signing Up'
      }
    }
  }

  const logIn = async (userData) => {
    try {
      state.value.loading = true
      const credentials = await signInWithEmailAndPassword(auth, userData.email, userData.password)
      console.log(credentials)
      state.value.user = credentials.user
      state.value.feedback = {
        status: 200,
        msg: 'Logged In'
      }
      return
    } catch (err) {
      console.log(err)
      state.value.feedback = {
        status: 400,
        msg: 'Invalid Credentials'
      }
    } finally {
      state.value.loading = false
    }
  }

  const uploadImage = async (file) => {
    try {
      state.loading = true
      const storage = getStorage()
      const storagePath = storageRef(storage, `images/${file.name}`) // Ensure ref is used correctly
      await uploadBytes(storagePath, file) // Upload the file
      const url = await getDownloadURL(storagePath) // Get and return the download URL
      return url
    } catch (err) {
      console.error('Error uploading image:', err) // Log the error
      state.feedback = {
        status: 400,
        msg: 'Error uploading image'
      }
      // throw err
    } finally {
      state.loading = false
    }
  }

  const saveUser = async (data, file) => {
    try {
      const url = await uploadImage(file)
      const credentials = await signUp(data)

      await updateProfile(credentials.user, {
        displayName: data.name,
        photoURL: url
      })

      console.log(credentials.user.email)
      const sanitizedEmail = data.email.replace(/\./g, ',') // Replace dots with commas

      const userRef = ref(db, 'users/' + sanitizedEmail)

      await set(userRef, {
        name: data.name,
        uid: credentials.user.uid,
        email: data.email,
        photoURL: url
      })

      state.value.user = credentials.user

      console.log('wwww')
    } catch (err) {
      state.feedback = {
        status: 400,
        msg: 'Error in Request !'
      }
    } finally {
      state.loading = false
    }
  }

  const clearFeedback = () => {
    state.feedback = { status: null, msg: '' }
  }

  const getByEmail = async (userEmail) => {
    console.log('here.......')
    console.log(userEmail)
    try {
      state.loading = false
      const userRef = ref(db, `users`)
      // Reference to a child node with the sanitized email
      const childRef = child(userRef, userEmail)

      console.log('Child reference path:', childRef.toString())

      const snapshot = await get(childRef)

      if (snapshot.exists()) {
        const user = snapshot.val()
        state.value.feedback = {
          status: 200,
          msg: 'Account Found'
        }
        state.value.openedChat = {
          userData: user,
          messages: []
        }
      } else {
        state.value.feedback = {
          status: 400,
          msg: 'Account Not Found'
        }
      }
    } catch (err) {
      console.log('error', err)
      state.value.feedback = {
        status: 400,
        msg: err.message
      }
    } finally {
    }
  }

  const checkChat = async () => {
    try {
      let chatRef1 = ref(db, `userChats/${state.value.user.email.replace(/\./g, ',')}`)

      let chatRef2 = ref(
        db,
        `userChats/${state.value.openedChat.userData.email.replace(/\./g, ',')}`
      )

      const snapshot = await get(chatRef1)

      const snapshot1 = await get(chatRef2)

      console.log(snapshot.val())

      console.log(snapshot1.val())

      console.log('exits')
      console.log(snapshot.val())

      if (snapshot.exists() && snapshot1.exists()) {
        // Convert chats to sets for easier intersection check
        const chatIdsUser1 = new Set(Object.keys(snapshot.val()))
        const chatIdsUser2 = new Set(Object.keys(snapshot1.val()))

        console.log(chatIdsUser1)

        console.log(chatIdsUser2)

        // Check for intersection
        let intersection = false
        ;[...chatIdsUser1].forEach((chatId) => {
          if (chatIdsUser2.has(chatId)) intersection = chatId
        })
        console.log(intersection)
        return intersection
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
    } finally {
      state.loading = false
    }
  }

  const sendMessage = async (msg) => {
    console.log('here.......')

    try {
      // state.loading = false;
      // const chatRef = ref(db,`chats`);
      // const newChatRef = push(chatRef);
      // const key = newChatRef.key;

      let answer = await checkChat()

      console.log(answer)

      if (!answer) {
        answer = await createChat()
      }

      await createMessage(answer, msg)

      //  const snapshot =  await set(newChatRef,{
      //   participants : ["mku0@gmail.com",state.value.openedChat.userData.email],
      //   lastMessage: null,
      //   lastTime: null,
      //  });

      //  await update(newChatRef,{
      //   lastMessage:"kimo is here ",
      //   lastTime : 2
      //  })

      //  let msgRef = ref(db,"messages");

      //  let newMsgRef = push(msgRef);

      //  const message = {
      //   message : msg,
      //   time : Date.now(),
      //   sender: state.value.user.email, // Example additional field
      //   chatId: key // Example additional field
      //  }

      //  await set(newMsgRef,message)

      //state.value.openedChat.messages = {...state.value.openedChat.messages , message}
    } catch (err) {
      console.log('error', err)
      state.value.feedback = {
        status: 400,
        msg: err.message
      }
    } finally {
    }
  }

  const createChat = async () => {
    try {
      state.loading = false
      const chatRef = ref(db, `chats`)
      const newChatRef = push(chatRef)
      const key = newChatRef.key
      const email = state.value.user.email
      const email1 = state.value.openedChat.userData.email
      const snapshot = await set(newChatRef, {
        participants: {
          [email.replace(/\./g, ',')]: true,
          [email1.replace(/\./g, ',')]: true
        },
        chatId: key,
        lastMessage: null,
        lastTime: null
      })

      const userChatRef = ref(db, `userChats/${email.replace(/\./g, ',')}`)

      await update(userChatRef, {
        [key]: true
      })

      const userChatRef2 = ref(db, `userChats/${email1.replace(/\./g, ',')}`)

      await update(userChatRef2, {
        [key]: true
      })

      return key
    } catch (err) {
      console.log(err)
    } finally {
      state.loading = false
    }
  }

  const createMessage = async (chatId, msg) => {
    try {
      state.loading = true

      let msgRef = ref(db, `messages/${chatId}`)

      let newMsgRef = push(msgRef)

      const message = {
        message: msg,
        time: Date.now(),
        sender: state.value.user.email, // Example additional field
        chatId: chatId // Example additional field
      }

      await set(newMsgRef, message)

      message.sender = {
        name: state.value.user.displayName,
        photoURL: state.value.user.photoURL,
        email: state.value.user.email
      }

      console.log({ [newMsgRef.key]: message })

      updateChat(chatId, msg)

      state.value.openedChat.messages = {
        ...state.value.openedChat.messages,
        [newMsgRef.key]: message
      }
    } catch (err) {
      console.log(err)
    } finally {
      state.loading = false
    }
  }

  const getMessages = async (chatId, userDetails) => {
    try {
      let result = {}
      const chatRef = ref(db, `messages/${chatId}`)
      const dataRef = await get(chatRef)
      let messages = dataRef.val()
      console.log(Object.values(messages))
      for await (let [key, item] of Object.entries(dataRef.val())) {
        let userRef = ref(db, `users/${item.sender.replace(/\./g, ',')}`)
        let userData = await get(userRef)
        userData = userData.val()
        item.sender = userData
        result[key] = item
      }

      //  let userRef = ref(db,`users/${Object.values(messages)[0].sender.replace(/\./g, ',')}`);
      //  let userData = await get(userRef);
      //  userData = userData.val();
      state.value.openedChat = { userData: userDetails, messages: result }
    } catch (err) {
      console.log(err)
    }
  }

  const getUsers = async () => {
    try {
      const userRef = ref(db, `users`)
      const snapshot = await get(userRef)
      if (snapshot.exists()) {
        const users = snapshot.val()
        console.log(users)
        return users
      } else {
        return [] // No users found
      }
    } catch (err) {
      console.error('Error fetching recent chats:', err)
      return []
    }
  }

  const updateChat = async (chatId, msg) => {
    try {
      const chatRef = ref(db, `chats/${chatId}`)
      await update(chatRef, {
        lastMessage: msg
      })
    } catch (err) {
      console.log(err)
    } finally {
      state.loading = false
    }
  }

  const fetchRecentChats = async () => {
    try {
      const userEmail = state.value.user.email.replace(/\./g, ',')
      const userChatsRef = ref(db, `userChats/${userEmail}`)
      const snapshot = await get(userChatsRef)

      if (snapshot.exists()) {
        const chatIds = Object.keys(snapshot.val())
        // Fetch chat details for each chat ID sequentially
        const chatDetails = []
        for await (const chatId of chatIds) {
          const chatRef = ref(db, `chats/${chatId}`)
          const details = await get(chatRef)
          if (details) {
            const answer = details.val()
            console.log(state.value.user.email)

            console.log(answer.participants)
            let user_email = Object.keys(answer.participants).filter(
              (email) => email != state.value.user.email.replace(/\./g, ',')
            )
            console.log(user_email)
            const userRef = ref(db, `users/${user_email[0]}`)
            let user = await get(userRef)
            if (user) {
              user = user.val()
              console.log(user)
            }
            chatDetails.push({ chatDetails: details.val(), userDetails: user })
          }
        }
        state.value.recentChats = chatDetails
      } else {
        return [] // No chats found
      }
    } catch (err) {
      console.error('Error fetching recent chats:', err)
      return []
    }
  }

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

  const fetchUsers = async () => {
    try {
      const usersRef = ref(db, 'users')
      const snapshot = await get(usersRef)
      if (snapshot.exists()) {
        const users = snapshot.val()
        return Object.keys(users).map((uid) => users[uid])
      } else {
        return []
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      return []
    }
  }

  const getUserEmails = async () => {
    try {
      const usersRef = ref(db, 'users')
      const snapshot = await get(usersRef)
      if (snapshot.exists()) {
        const users = snapshot.val()
        return Object.keys(users).map((uid) => users[uid].email)
      } else {
        return []
      }
    } catch (err) {
      console.error('Error fetching user emails:', err)
      return []
    }
  }

  const createGroup = async (groupName) => {
    try {
      const groupRef = ref(db, 'groups')
      const newGroupRef = push(groupRef)
      const key = newGroupRef.key
      const groupData = {
        name: groupName,
        lastMessage: null,
        lastTime: Date.now()
      }
      await set(newGroupRef, groupData)
      return key
    } catch (err) {
      console.error('Error creating group:', err)
      return null
    }
  }

  const fetchGroups = async () => {
    try {
      const groupsRef = ref(db, `groups`)
      const snapshot = await get(groupsRef)
      if (snapshot.exists()) {
        const groups = snapshot.val()
        console.log(groups)
        state.value.recentGroups = groups
      }
    } catch (err) {
      console.error('Error fetching recent groups:', err)
    }
  }
  const getGroupMessages = async (groupId) => {
    try {
      let result = {}
      const chatRef = ref(db, `messages/${groupId}`)
      const dataRef = await get(chatRef)
      let messages = dataRef.val()
      console.log(Object.values(messages))
      //fetch the sender of each message in the group
      for await (let [key, item] of Object.entries(dataRef.val())) {
        let userRef = ref(db, `users/${item.sender.replace(/\./g, ',')}`)
        let userData = await get(userRef)
        userData = userData.val()
        item.sender = userData
        result[key] = item
      }

      //  let userRef = ref(db,`users/${Object.values(messages)[0].sender.replace(/\./g, ',')}`);
      //  let userData = await get(userRef);
      //  userData = userData.val();
      state.value.openedChat = { messages: result }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    signUp,
    state,
    setFeedback,
    clearFeedback,
    logIn,
    uploadImage,
    saveUser,
    getByEmail,
    sendMessage,
    fetchRecentChats,
    getMessages,
    fetchUsers,
    createGroup,
    fetchGroups,
    getGroupMessages
  }
})
