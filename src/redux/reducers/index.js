import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'
import authReducer from './authReducer';
import chatsReducer from './chatsReducer'
import chatMessagesReducer from './chatMessagesReducer'
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'],
}
const reducers = persistCombineReducers(persistConfig, {
    auth:authReducer,
    chats:chatsReducer,
    chatMessages:chatMessagesReducer
})

export default reducers