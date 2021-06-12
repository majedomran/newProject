import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import { setUserAuthAction, loginAction, setLogedinAction } from "../redux/reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";
import styles from '../styles/loginScreenStyles'
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userID, userEmail, logedin, userPassword } = useSelector((state) => state.auth);

  const [localEmail, setLocalEmail] = useState("majed1@gmail.com");
  const [loginError, setLoginError] = useState("");
  const [localPassword, setLocalPassword] = useState('12345678')
  useEffect(() => {
    if (logedin) navigation.navigate("chatsProfileSwitcher");
    return logedin
  },[logedin])
  const signIn = async() => {
    console.log(
      `localPassword:  ${localPassword}
      localEmail: ${localEmail}`
      
  )
    await dispatch(loginAction({ email: localEmail, password: localPassword }));
    await dispatch(setUserAuthAction())
    // await dispatch(setLogedinAction(true))
    console.log(
      `password:  ${userPassword}
      userEmail: ${userEmail}
      userid:   ${userID}
      `
  )
    // navigation.navigate('chatRooms')
    console.log("logedin: ",logedin);
  };
  
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your email"
        label="Email"
        value={localEmail}
        onChangeText={(text) => setLocalEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        onChangeText={(text) => setLocalPassword(text)}
        secureTextEntry
      />
      <Text style={{ color: "red" }}>{loginError}</Text>
      <Button title="login" style={styles.button} onPress={signIn} />
      <Button
        title="register"
        style={styles.button}
        onPress={() => navigation.navigate("register")}
      />
    </View>
  );
};

export default LoginScreen;

