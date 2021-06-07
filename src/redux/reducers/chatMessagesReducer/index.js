import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";


const initialState = {
  messages:[]
};

const chatMessagesReducer = createSlice({
  name: "chats",
  initialState,
  reducers: {
    
  },
});

export const {  } = chatMessagesReducer.actions;

export default chatMessagesReducer.reducer;
