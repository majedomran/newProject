import { View,  Button } from "react-native";
import {  Text, Image } from "react-native-elements";
import React, {  useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addUserToFirestore,
  setPhotoURLAction
} from "../redux/reducers/authReducer";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import styles from '../styles/profileScreen'
import {getFileName} from '../helpers'
const profileScreen = ({ navigation }) => {
  const { userEmail, photoURL } = useSelector((state) => state.auth);
  const uploadImageToStorage = async (path, imageName) => {
    let reference = storage().ref(imageName);
    let task = reference.putFile(path);
    await task
      .then((res) => {
        storage()
          .ref(res.metadata.fullPath)
          .getDownloadURL()
          .then((url) => {
            dispatch(addUserToFirestore(url));
            dispatch(setPhotoURLAction(url))
          });
      })
      .catch((e) => console.log("uploading image error => ", e));
  };

  
  chooseFile = () => {
    var options = {
      title: "Select Image",
      customButtons: [
        { name: "customOptionKey", title: "Choose Photo from Custom Option" },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images", 
      },
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker", storage());
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else if(response.assets?.[0]?.uri){
        
        uploadImageToStorage(
          response.assets[0].uri,
          getFileName(response.fileName, response.assets[0].uri)
        );
      }
    });
  };
  

  return (
    <View style={styles.view}>
      <Text style={styles.text}>Hello {userEmail}</Text>
      <Image
        style={styles.image}
        source={{
          uri: photoURL,
        }}
      />
      <Button
        style={styles.button}
        styleDisabled={{ color: "red" }}
        title={photoURL ? "Change photo" : "Add photo"}
        onPress={chooseFile}
      ></Button>
    </View>
  );
};
export default profileScreen;
