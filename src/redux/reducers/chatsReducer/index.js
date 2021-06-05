import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";




const initialState = {
    chatRooms: null
}

const chatsReducer = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setChatsReducer: (state, action) => {
            state.chatRooms = action.payload
        }
    }
})

export const {setChatsReducer:setChatsReducerAction} = chatsReducer.actions

export default chatsReducer.reducer
