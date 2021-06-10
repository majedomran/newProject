import React,{useLayoutEffect} from "react"
import { View, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatRooms from "./ChatRooms"
import profileScreen from "./profileScreen"

import {clearAllAction, logoutAction} from "../redux/reducers/authReducer"
const Tab = createBottomTabNavigator();

function chatsProfileSwitcher({navigation}) {
    const signOut = () => {
        dispatch(logoutAction());
        dispatch(clearAllAction());
        // navigation.replace("login");
      };
      useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (


        <View style={{ marginLeft: 20 }}>
          <Feather
            name="arrow-left"
            size={40}
            color="black"
            onPress={signOut}
          />
        </View>
        
      ),

    //   headerRight: () => <TouchableOpacity></TouchableOpacity>,
    });
  }, [navigation]);
  return (
    <Tab.Navigator>
      <Tab.Screen name="chatRooms" component={ChatRooms} />
      <Tab.Screen name="profile" component={profileScreen} />
    </Tab.Navigator>
  );
}
export default chatsProfileSwitcher