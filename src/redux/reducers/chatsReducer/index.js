import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";


const initialState = {
  chatRooms: [
    
  ],
  loading:true
};

const chatsReducer = createSlice({
  name: "chats",
  initialState,
  reducers: {
    clearAll: () => initialState,
    
    setChatsReducer: (state, action) => {
      let flattenedChats = action.payload
      state.chatRooms = flattenedChats.flat()
    },
    setLoading:(state,action) => {
      state.loading = action.payload
    }
  },
});

export const { setChatsReducer: setChatsReducerAction, clearAll:chatsClearAllAction, setLoading: setLoadingAction } = chatsReducer.actions;

export default chatsReducer.reducer;
