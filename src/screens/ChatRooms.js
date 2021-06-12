import { Input, Button } from "react-native-elements";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  TouchableHighlight,
  Platform,
  Image,
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
import { setPhotoURLAction } from "../redux/reducers/authReducer";
import _ from "lodash";

const ChatRooms = ({ navigation }) => {
  dispatch = useDispatch();

  const { chatRooms } = useSelector((state) => state.chats);
  const { userEmail, logedin } = useSelector((state) => state.auth);
  const { photoURL } = useSelector((state) => state.auth);

  const [isModalVisible, setModalVisible] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState();
  const [imgaePath, setImagePath] = useState();
  useEffect(() => {
    // console.log("useEffect in chatrooms");
    // console.log("userEmail", userEmail);
    let chats = [];
    let url;
    console.log("current user is: ",userEmail);
    
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
        console.log("chat .then <= ");
        let chatsClean = [];
        let users = [];
        chats.forEach((chat) => {
          // console.log('user => ', chat);
          chat.users.forEach((user) => {
            // console.log('user => ', user);
            if (!user.includes(userEmail)) {
              console.log('user contains => ', user);
              users.push(user);
              chatsClean.push({ id: chat.id, email: user });
            }
          });
        });
        let chatsWithPhotos = []
        console.log('users are => ',users);
        console.log('chatsClean are => ',chatsClean);
        for (let index = 0; index < Math.ceil(users.length/10); index++) {
          console.log('loop',Math.ceil(users.length/10));
          
          let paginatedUsers = []
          let paginatedChatsClean = []
          for (let j = 0; j < 10; j++) {
            paginatedUsers[j] = users[(index * 10)+j];
            paginatedChatsClean[j] = chatsClean[(index * 10)+j]
          }
          console.log('paginated users: ',paginatedUsers);
          
          firestore()
          .collection("users")
          .where("email", "in", paginatedUsers)
          .get()
          .then((res) => {
            console.log('requesting from firestore photos');
              
              console.log('res from photos',res.docs);
              let photosArray = []
              res.docs.forEach((photo) => {
                photosArray.push(photo._data)
              })
              paginatedChatsClean.forEach((chat) => {
                
                let found = false
                photosArray.forEach((photo) => {
                  if(chat.email === photo.email){
                    found = true
                  chatsWithPhotos.push({id:chat.id,email:chat.email,photo:photo.photo})
                  }
  
                })
                if(found === false)
                chatsWithPhotos.push({id:chat.id,email:chat.email,photo:null})
              })
              console.log('chatsWithPhotos ',chatsWithPhotos);
              // let arr = _.intersectionBy(chatsClean,photosArray,"email") 
              // console.log('array from union: ',arr);
              
              console.log("chats: ", chats);
              console.log("chatsClean: ", chatsClean);
              dispatch(setChatsReducerAction({ chatRooms: chatsWithPhotos }));
            }).catch((e) => {
              console.log('error: ',e);
        })
            
          };
      });
  }, []);
  // useEffect(() => {
  //   firestore().collection('users').doc().
  // }, [])
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
        firestore()
          .collection("photos")
          .doc(generateGuid())
          .set({ email: userEmail, photoURL: res.metadata.fullPath });
        console.log("Image uploaded to the bucket!");
      })
      .catch((e) => console.log("uploading image error => ", e));
  };


    // return Platform.select({
    //   // android: { path },
    //   ios: { uri },
    // });
  
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
    // console.log("item : ", item);
    return (
      <TouchableHighlight

        style={{marginBottom:10}}
        onPress={() =>
          navigation.navigate("chat", { chatID: item.id, userEmail, users:item.email })
        }
      >
        <View
          style={{ alignItems: "baseline",flexDirection: "row", borderWidth:1,alignSelf:"stretch" }}
        >
          <Image
            style={{ width: 50, height: 50, marginRight: 15 }}
            source={{
              uri: item.photo,
            }}
          />
          <Text style={{alignSelf:"center"}}>{item.email}</Text>
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
            name="arrow-right"
            size={40}
            color="black"
            onPress={signOut}
          />
        </View>
        
      ),

    //   headerRight: () => <TouchableOpacity></TouchableOpacity>,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <FlatList 
        style={{alignContent:"flex-start",alignSelf:"stretch"}}
        data={chatRooms}
        renderItem={Item}
        keyExtractor={(item) => item.id}
      />
      <Feather
            name="plus"
            size={65}
            // color="black"
            onPress={toggleModal}
            style={{
              position: "absolute",
              right: 15,
              bottom: 15,
              // borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              height: 70,
              // backgroundColor: "#ccc",
              // borderRadius: 50,
            }}
          />
      {/* <TouchableOpacity
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
      ></TouchableOpacity> */}
      <View style={{ flex: 1 }}>
        <Modal
          style={{ margin: 100, marginTop: 400}}
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
            <Button title="ADD" onPress={addChat} style={{marginBottom:20}}/>
            <Button title="Cancel" onPress={toggleModal} />
          </View>
        </Modal>
      </View>
     
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
