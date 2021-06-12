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
    clearAll: () => initialState,

    setChatsReducer: (state, action) => {
       
        
      state.chatRooms = action.payload.chatRooms
    },
  },
});

export const { setChatsReducer: setChatsReducerAction, clearAll:chatsClearAllAction } = chatsReducer.actions;

export default chatsReducer.reducer;
