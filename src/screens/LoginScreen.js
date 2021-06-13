import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { getUserAuthAction, loginAction, setLogedinAction} from "../redux/reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";
import styles from '../styles/loginScreenStyles'
const LoginScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const { userID, userEmail, logedin, userPassword, loginError } = useSelector((state) => state.auth);

  const [localEmail, setLocalEmail] = useState("majed1@gmail.com");
  const [localPassword, setLocalPassword] = useState('12345678')
  const [lang, setLang] = useState({
    en: {
      enterEmail: 'Enter your email',
      enterPassword:"Enter your password",
      password:'Password',
      email:'email',
      signUp: 'Signup',
      login: 'Login',
      error:'Something went wrong'
    },
  });
  useEffect(() => {
    dispatch(setLogedinAction(false))
  },[])
  useEffect(() => {
    if (logedin) navigation.navigate("chatsProfileSwitcher");
    return logedin
  },[logedin])
  const signIn = () => {
    dispatch(loginAction({ email: localEmail, password: localPassword }));
    dispatch(getUserAuthAction())
    console.log(
      `password:  ${userPassword}
      userEmail: ${userEmail}
      userid:   ${userID}
      `
  )
    console.log("logedin: ",logedin);
  };
  const loginRender = () => {
    return (
      <View style={styles.container}>
        <Input
        placeholder={enterEmail}
        label={email}
        value={localEmail}
        onChangeText={(text) => setLocalEmail(text)}
      />
      <Input
        placeholder={enterPassword}
        label={password}
        onChangeText={(text) => setLocalPassword(text)}
        secureTextEntry
      />
<Text style={{ color: "red" }}>{loginError?error:''}</Text>
      <Button title={login} style={styles.button} onPress={signIn} />
      <Button
        title={signUp}
        style={styles.button}
        onPress={() => navigation.navigate("register")}
      />
      </View>
    )
  }
  const {enterEmail,error,login,signUp,email,enterPassword,password} = lang.en
  return (
    <View style={{flex:1}}>
      {loginRender()}
    </View>
  );
};

export default LoginScreen;

