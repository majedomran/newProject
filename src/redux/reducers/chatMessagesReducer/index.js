import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

export const addChatsToStoreAction = createAsyncThunk(
  "chatMessages/addChatsToStoreAction",
  async (chatID, userEmail, messages) => {
    console.log(
      `route params:
      chatID: ${chatID}
      userEmail ${userEmail}
      `
    )
  let returnVal 
  const fireMessages = [];
   firestore()
    .collection("chats")
    .doc(chatID)
    .collection("messages")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const { _id, createdAt, text, user } = doc.data();
        console.log('docs in redux: ',doc.data());
        
        if (doc.data()._id) {
          fireMessages.push({
            _id,
            createdAt: new Date(createdAt.toDate()),
            text,
            user,
          });
        }
      });
      let updatedMessages = _.unionBy(fireMessages, messages, "_id");

        // console.log('addChatsToStoreAction updated messages',updatedMessages);
        
         updatedMessages.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        
        // console.log("addChatsToStoreAction updated messages sorted",updatedMessages);
    });
    return fireMessages
  console.log("updated");
  }
) 
const initialState = {
  messages:[]
};

const chatMessagesReducer = createSlice({
  name: "chatMessages",
  initialState,
  reducers: {
    
  },extraReducers:{
    [addChatsToStoreAction.fulfilled]: (state,action) => {
      console.log("addChatsToStoreAction fulfilled",action.payload);
      
      state.messages = action.payload
    }
  }
});

export const {  } = chatMessagesReducer.actions;

export default chatMessagesReducer.reducer;
