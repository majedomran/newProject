import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatRooms from "./ChatRooms";
import profileScreen from "./profileScreen";

import { clearAllAction, logoutAction } from "../redux/reducers/authReducer";
import { chatsClearAllAction } from "../redux/reducers/chatsReducer";

import styles from "../styles/chatsProfileSwitcherStyles";
const Tab = createBottomTabNavigator();
function chatsProfileSwitcher({ navigation }) {
  const signOut = () => {
    dispatch(chatsClearAllAction());
    dispatch(logoutAction());
    dispatch(clearAllAction());
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.backButton}>
          <Feather
            name="arrow-left"
            size={40}
            color="black"
            onPress={signOut}
          />
        </View>
      ),

    });
  }, [navigation]);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="chatRooms"
        component={ChatRooms}
        options={{
          tabBarIcon: () => (
            <Feather name="message-circle" size={30} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={profileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Feather name="user" size={30} color="black" />,
        }}
      />
    </Tab.Navigator>
  );
}
export default chatsProfileSwitcher;
