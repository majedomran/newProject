import React, {useEffect} from 'react'
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from "react-redux";
import { View } from 'react-native';
import {setLoadingAction} from '../redux/reducers/chatsReducer'
const LoadingScreen = ({navigation}) => {
    dispatch = useDispatch()
    const { userEmail} = useSelector((state) => state.auth)
    const { loading} = useSelector((state) => state.chats)
        const timer = () => {
            dispatch(setLoadingAction(false))
            // navigation.navigate('chatsProfileSwitcher');
        }
        useEffect(() => {
            setTimeout(timer,500)

        },[])
        useEffect(()=> {
            if(!userEmail)
            navigation.replace('login')
        },[userEmail])
        useEffect(()=> {
            if(!loading){
                navigation.replace('chatsProfileSwitcher')
                console.log('navigating to chatsa');
                
            }
        },[loading])
        const loadingRender = () => {
            return(

                <LottieView
                        style={{flex:1}}
                        source={require('../animations/17481-apple-icon-animation.json')}
                        
                        autoPlay
                        loop
                      />
            )}
    // if (loading && userEmail){
    
    return(
        <View style={{flex:1}}>

            {loadingRender()}
        </View>
        
        )
    // }
    // else
    // navigation.navigate('chatsProfileSwitcher');
    
}
export default LoadingScreen