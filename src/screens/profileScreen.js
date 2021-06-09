import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
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


  return (
    <View>
    </View>
  );
};
export default profileScreen
