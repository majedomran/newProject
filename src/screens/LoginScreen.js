import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import auth from "@react-native-firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("majed1@gmail.com");
  const [password, setPassword] = useState("12345678");
    const [loginError, setLoginError] = useState('')
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("in");
        navigation.replace("Chat");
      } else {
        // No user is signed in.

        console.log("out");
      }
    });
    return unsubscribe;
  }, []);
  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        var errorMessage = ''
        errorMessage = error.message;
        console.log(errorMessage)
        if(errorMessage.includes('password'))
        setLoginError('The password is incorrect')
        if(errorMessage.includes('email'))
        setLoginError('the email is incorrect')
        if(errorMessage.includes('no user'))
        setLoginError('the user doesn\'t exist ')
      });
  };
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Text style={{color:'red'}}>{loginError}</Text>
      <Button title="login" style={styles.button} onPress={signIn} />
      <Button
        title="register"
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
