import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'
import authReducer from './authReducer';
import chatsReducer from './chatsReducer'
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'],
}
const reducers = persistCombineReducers(persistConfig, {
    auth:authReducer,
    chats:chatsReducer
})

export default reducers