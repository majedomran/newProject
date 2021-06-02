import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
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

  const register = ({}) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.log(error);
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your name"
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Input
        placeholder="Enter your image url"
        label="Profile Picture"
        onChangeText={(text) => setImageUrl(text)}
      />
      <Button title="register" style={styles.button} onPress={register} />
    </View>
  );
};
export default RegisterScreen;
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
