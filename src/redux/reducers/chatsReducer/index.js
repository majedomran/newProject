import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";


const initialState = {
  chatRooms: [
    
  ]
};

const chatsReducer = createSlice({
  name: "chats",
  initialState,
  reducers: {
    
    setChatsReducer: (state, action) => {
        // console.log("payload: ",action.payload);
        
      state.chatRooms = action.payload.chatRooms
    },
  },
});

export const { setChatsReducer: setChatsReducerAction } = chatsReducer.actions;

export default chatsReducer.reducer;
