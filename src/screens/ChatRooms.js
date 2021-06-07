import { Input, Button } from "react-native-elements";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  TouchableHighlight,
  Platform,
  Image
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { setChatsReducerAction } from "../redux/reducers/chatsReducer";
import { logoutAction, clearAllAction } from "../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import Modal from "react-native-modal";
import { generateGuid } from "../helpers";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import {setPhotoURLAction} from '../redux/reducers/authReducer'
const ChatRooms = ({ navigation }) => {
  dispatch = useDispatch();

  const { chatRooms } = useSelector((state) => state.chats);
  const { userEmail, logedin } = useSelector((state) => state.auth);
  const { photoURL } = useSelector((state) => state.auth)


  const [isModalVisible, setModalVisible] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState();
  const [imgaePath, setImagePath] = useState();
  useEffect(() => {
    console.log("useEffect in chatrooms");
    console.log("userEmail", userEmail);
    let chats = [];
    let url 
    firestore()
      .collection("chats")
      .where("users", "array-contains", userEmail ? userEmail : "")
      .get()
      .then((snapshots) => {
        snapshots.docs.forEach((snapshot) => {
          console.log("snapshot", snapshot);
          chats.push({ id: snapshot.id, users: snapshot._data.users });
          // users.push(snapshot._data.users)
        });
      })
      .then(() => {
        console.log('chat .then <= ')
        let chatsClean = [];
        chats.forEach((chat) => {
          // console.log('user => ', chat);
          chat.users.forEach((user) => {
            // console.log('user => ', user);
            if (!user.includes(userEmail)) {
              // console.log('user contains => ', user);
              chatsClean.push({ id: chat.id, users: user });
            }
          });

          // if(chat.users.contains('majed1@gmail.com'))
          //   console.log('chat users => ',chat.users);
        });
        console.log("chats: ", chats);
        console.log("chatsCleab: ", chatsClean);
        dispatch(setChatsReducerAction({chatRooms:chatsClean}));
      });
      
  }, []);
  useEffect(() => {
    
  }, [])
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  const uploadImageToStorage = (path, imageName) => {
    let reference = storage().ref(imageName);
    console.log("storage path: ", path);

    let task = reference.putFile(path); // 3

    task
      .then((res) => {
        // 4
        console.log("respone from storage firebase", res);
        firestore().collection('photos').doc(generateGuid()).set({email:userEmail,photoURL:res.metadata.fullPath})
        console.log("Image uploaded to the bucket!");
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

        let path = response.assets[0].uri;
        let fileName = getFileName(response.fileName, path);
        setImagePath({ imagePath: path });
        uploadImageToStorage(path, fileName);
      }
    });
  };
  
  const Item = ({ item }) => {
    console.log("item : ", item);
    return (
      <TouchableHighlight
        style={styles.button}
        onPress={() =>
          navigation.navigate("chat", { chatID: item.id, userEmail })
        }
      >
        <View style={{alignItems:"baseline",margin:2,flexDirection:"row"}}>
      
        <Image
        style={{width: 50, height: 50,marginRight:15}}
        source={{
          uri: photoURL,
        }}
      />
          <Text style={styles.title}>{item.users}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  //logout
  useEffect(() => {
    if (!logedin) navigation.replace("login");
  }, [logedin]);
  const signOut = () => {
    dispatch(logoutAction());
    dispatch(clearAllAction());
    // navigation.replace("login");
  };
  const addImage = () => {
    launchImageLibrary({ quality: 1 }, (response) => {
      console.log(response);
    });
  };
  const addChat = () => {
    toggleModal();
    console.log("adding email: ", emailToAdd);
    const Guid = generateGuid();
    var req = firestore()
      .collection("chats")
      .doc(Guid)
      .set({ users: [userEmail, emailToAdd === null ? "" : emailToAdd] });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Feather
            name="arrow-left"
            size={40}
            color="black"
            onPress={signOut}
          />
        </View>
      ),

      headerRight: () => <TouchableOpacity></TouchableOpacity>,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
    
        data={chatRooms}
        renderItem={Item}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        onPress={toggleModal}
        style={{
          position: "absolute",
          right: 15,
          bottom: 70,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          width: 70,
          height: 70,
          backgroundColor: "#ccc",
          borderRadius: 50,
        }}
      ></TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Modal
          style={{ margin: 100, marginTop: 400 }}
          isVisible={isModalVisible}
        >
          <View style={{ flex: 1 }}>
            {/* <Text>Enter Email </Text> */}
            <Input
              placeholder="Enter Email"
              onChangeText={(text) => {
                setEmailToAdd(text);
              }}
            ></Input>
            <Button title="ADD" onPress={addChat} />
          </View>
        </Modal>
      </View>
      <Button title="ADD" onPress={chooseFile} />
    </View>
  );
};

export default ChatRooms;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
