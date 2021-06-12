import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  setLogedinAction,
  setUserAuthAction,
  addUserToFirestore,
  setPhotoURLAction,
} from "../redux/reducers/authReducer";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import styles from "../styles/registerScreenStyles";
const RegisterScreen = ({ navigation }) => {
  dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileNameResponse, setFileNameResponse] = useState("");
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("in");
        // dispatch(setLogedinAction(true));
        // navigation.replace("chatRooms");
      } else {
        // No user is signed in.
        console.log("out");
      }
    });

    return unsubscribe;
  }, []);
  const uploadImageToStorage = async (path, imageName) => {
    let reference = storage().ref(imageName);
    console.log("storage path: ", path);

    let task = reference.putFile(path);

    await task
      .then((res) => {
        console.log("response from storage uploading: ", res);
        storage()
          .ref(res.metadata.fullPath)
          .getDownloadURL()
          .then((url) => {
            console.log("url from storage => ", url);
            dispatch(addUserToFirestore(url));
            dispatch(setPhotoURLAction(url));
          });
        // storage().ref(res)
      })
      .catch((e) => console.log("uploading image error => ", e));
  };
  const getPlatformPath = (uri) => {
    console.log(
      `
      
      uri: ${uri}`
    );

    return Platform.select({
      // android: { path },
      ios: { uri },
    });
  };
  const getFileName = (name, path) => {
    if (name != null) {
      return name;
    }

    if (Platform.OS === "ios") {
      console.log("path: ", path);
      path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
  };
  chooseFile = () => {
    var options = {
      title: "Select Image",
      customButtons: [
        { name: "customOptionKey", title: "Choose Photo from Custom Option" },
      ],
      storageOptions: {
        skipBackup: true, // do not backup to iCloud
        path: "images", // store camera images under Pictures/images for android and Documents/images for iOS
      },
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker", storage());
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log("response", response.assets[0].uri);
        console.log(
          `local path: ${response.assets[0].uri}
          fileName: ${response.fileName}`
        );
        setLocalPath(response.assets[0].uri);
        setFileNameResponse(response.fileName);
        // setImagePath({ imagePath: path });
        // uploadImageToStorage(localPath, fileName);
      }
    });
  };
  // useEffect(() => {
  //   if (fileNameResponse) setFileName(getFileName(fileNameResponse, localPath));
  // }, [fileNameResponse]);
  const register = ({}) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        uploadImageToStorage(
          localPath,
          getFileName(fileNameResponse, localPath)
        );
        console.log("localPath: ", localPath);
        console.log(
          "the filename is: ",
          getFileName(fileNameResponse, localPath)
        );

        dispatch(setUserAuthAction());

        dispatch(setLogedinAction(true));

        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
          setRegisterError("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
          setRegisterError("That email address is invalid!");
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
      <Button title="Add Photo" onPress={chooseFile} />
      <Text style={{ color: "red" }}>{registerError}</Text>
      <Button title="register" style={styles.button} onPress={register} />
    </View>
  );
};
export default RegisterScreen;
