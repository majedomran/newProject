import { Input, Button } from "react-native-elements";
import {
  View,
  FlatList,
  Text,
  TouchableHighlight,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { setChatsReducerAction } from "../redux/reducers/chatsReducer";
import { logoutAction, clearAllAction } from "../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import Modal from "react-native-modal";
import { generateGuid } from "../helpers";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import _ from "lodash";
import styles from "../styles/chatRoomsStyles";
const ChatRooms = ({ navigation }) => {
  dispatch = useDispatch();

  const { chatRooms } = useSelector((state) => state.chats);
  const { userEmail, logedin } = useSelector((state) => state.auth);

  const [isModalVisible, setModalVisible] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState();
  useEffect(() => {
    getChats();
  }, []);
  const getChats = () => {
    let chats = [];
    firestore()
      .collection("chats")
      .where("users", "array-contains", userEmail ? userEmail : "")
      .get()
      .then((snapshots) => {
        snapshots.docs.forEach((snapshot) => {
          chats.push({ id: snapshot.id, users: snapshot._data.users });
        });
      })
      .then(() => {
        let chatsClean = [];
        let users = [];
        chats.forEach((chat) => {
          chat.users.forEach((user) => {
            if (!user.includes(userEmail)) {
              users.push(user);
              chatsClean.push({ id: chat.id, email: user });
            }
          });
        });
        let chatsWithPhotos = [];
        for (let index = 0; index < Math.ceil(users.length / 10); index++) {
          let paginatedUsers = [];
          let paginatedChatsClean = [];
          for (let j = 0; j < 10; j++) {
            if (users[j] !== undefined) {
              paginatedUsers[j] = users[index * 10 + j];
              paginatedChatsClean[j] = chatsClean[index * 10 + j];
            }
          }
          firestore()
            .collection("users")
            .where("email", "in", paginatedUsers)
            .get()
            .then((res) => {
              let photosArray = [];
              res.docs.forEach((photo) => {
                photosArray.push(photo._data);
              });
              if (photosArray.length !== 0) {
                paginatedChatsClean.forEach((chat) => {
                  let found = false;
                  photosArray.forEach((photo) => {
                    if (chat.email === photo.email) {
                      found = true;
                      chatsWithPhotos.push({
                        id: chat.id,
                        email: chat.email,
                        photo: photo.photo,
                      });
                    }
                  });
                  if (found === false)
                    chatsWithPhotos.push({
                      id: chat.id,
                      email: chat.email,
                      photo: null,
                    });
                });
                dispatch(setChatsReducerAction({ chatRooms: chatsWithPhotos }));
              } else {
                paginatedChatsClean.forEach((chat) => {
                  chatsWithPhotos.push({
                    id: chat.id,
                    email: chat.email,
                    photo: null,
                  });
                });
                dispatch(setChatsReducerAction({ chatRooms: chatsWithPhotos }));
              }
            })
            .catch((e) => {
              console.log("error: ", e);
            });
        }
      });
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const uploadImageToStorage = (path, imageName) => {
    let reference = storage().ref(imageName);
    let task = reference.putFile(path);
    task
      .then((res) => {
        firestore()
          .collection("photos")
          .doc(generateGuid())
          .set({ email: userEmail, photoURL: res.metadata.fullPath });
      })
      .catch((e) => console.log("uploading image error => ", e));
  };
  const getFileName = (name, path) => {
    if (name != null) {
      return name;
    }

    if (Platform.OS === "ios") {
      path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
  };
  chooseFile = () => {
    var options = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Photo from Custom Option",
        },
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
    return (
      <TouchableHighlight
        style={{ marginBottom: 10 }}
        onPress={() =>
          navigation.navigate("chat", {
            chatID: item.id,
            userEmail,
            users: item.email,
          })
        }
      >
        <View
          style={{
            alignItems: "baseline",
            flexDirection: "row",
            borderWidth: 1,
            alignSelf: "stretch",
          }}
        >
          <Image
            style={{ width: 50, height: 50, marginRight: 15 }}
            source={{
              uri: item.photo,
            }}
          />
          <Text style={{ alignSelf: "center" }}>{item.email}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  useEffect(() => {
    if (!logedin) navigation.popToTop();
  }, [logedin]);
  const signOut = () => {
    dispatch(logoutAction());
    dispatch(clearAllAction());
  };
  const addChat = () => {
    toggleModal();
    let emailToAddSmall = emailToAdd.toLowerCase();
    const Guid = generateGuid();
    var req = firestore()
      .collection("chats")
      .doc(Guid)
      .set({ users: [userEmail, emailToAdd === null ? "" : emailToAddSmall] })
      .then(() => {
        getChats();
      })
      .catch((e) => {
        console.log("error", e);
      });
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={{ alignContent: "flex-start", alignSelf: "stretch" }}
        data={chatRooms}
        renderItem={Item}
        keyExtractor={(item) => item.id}
      />
      <Feather
        name="user-plus"
        size={35}
        onPress={toggleModal}
        style={styles.addChatButton}
      />
      <View style={styles.flex1}>
        <Modal style={styles.modal} isVisible={isModalVisible}>
          <View style={styles.flex1}>
            <Input
              placeholder="Enter Email"
              onChangeText={(text) => {
                setEmailToAdd(text);
              }}
            ></Input>
            <Button title="ADD" onPress={addChat} style={styles.addButton} />
            <Button title="Cancel" onPress={toggleModal} />
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default ChatRooms;
