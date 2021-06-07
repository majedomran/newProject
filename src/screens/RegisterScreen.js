import { View, StyleSheet } from "react-native";
import { Input, Button,Text } from "react-native-elements";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { setLogedinAction, setUserAuthAction} from '../redux/reducers/authReducer'
const RegisterScreen = ({ navigation }) => {
  dispatch = useDispatch()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [registerError,setRegisterError] = useState('')

  // const [ ] = useSelector((state) => state.auth)

  
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("in");
        dispatch(setLogedinAction(true))
        navigation.replace("chatRooms");
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
        dispatch(setUserAuthAction())
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
          setRegisterError("That email address is already in use!")
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
          setRegisterError("That email address is invalid!")
        }

        console.log(error);
        
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
      <Text style={{color:'red'}}>{registerError}</Text>
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
