import { View, StyleSheet } from "react-native";
import { Input, Button, Text, Image } from "react-native-elements";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  setLogedinAction,
  setUserAuthAction,
  addUserToFirestore,
} from "../redux/reducers/authReducer";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

const profileScreen = ({ navigation }) => {
  const {userEmail,photoURL} = useSelector((state) => state.auth)

  return (
    <View style={{margin:50, alignItems:"center"}}>
        <Text style={{margin:50}}>
            Hello {userEmail}
        </Text >
        <Image
            style={{ width: 200, height: 200,}}
            source={{
              uri: photoURL,
            }}
          />
        <Button style={{margin:50}}>

        </Button>
    </View>
  );
};
export default profileScreen
