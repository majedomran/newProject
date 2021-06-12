import { View, StyleSheet, Button } from "react-native";
import { Input, Text, Image } from "react-native-elements";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  setLogedinAction,
  setUserAuthAction,
  addUserToFirestore,
  setPhotoURLAction
} from "../redux/reducers/authReducer";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

const profileScreen = ({ navigation }) => {
  const { userEmail, photoURL } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log('photoURL is changing ');
    
  },[photoURL])
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
            dispatch(setPhotoURLAction(url))
          });
      })
      .catch((e) => console.log("uploading image error => ", e));
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
        uploadImageToStorage(
          response.assets[0].uri,
          getFileName(response.fileName, response.assets[0].uri)
        );
        console.log(
          "the filename is: ",
        );
      }
    });
  };
  

  return (
    <View style={{ margin: 50, alignItems: "center" }}>
      <Text style={{ margin: 50, fontSize: 14 }}>Hello {userEmail}</Text>
      <Image
        style={{ width: 200, height: 200 }}
        source={{
          uri: photoURL,
        }}
      />
      <Button
        style={{ fontSize: 20, color: "green" }}
        styleDisabled={{ color: "red" }}
        title={photoURL ? "Change photo" : "Add photo"}
        onPress={chooseFile}
      ></Button>
    </View>
  );
};
export default profileScreen;
