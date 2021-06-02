import { View, TouchableOpacity, Button } from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import auth from "@react-native-firebase/auth";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import Feather from "react-native-vector-icons/Feather";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";

Feather.loadFont();
function generateGuid() {
  var result, i, j;
  result = "";
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
}
const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(
    "0F112844-B80F-C753-2A07-670CB81692F7"
  );
  const [currentUsers, setCurrentUsers] = useState(auth().currentUser.email);
  const newChatRoom = () => {
    setChatRoomId(generateGuid());
  };
  useEffect(() => {
    const fireMessages = [];

    firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const { _id, createdAt, text, user } = doc.data();

          if (doc.data()._id) {
            fireMessages.push({
              _id,
              createdAt: new Date(createdAt.toDate()),
              text,
              user,
            });
          }
        });
        let updatedMessages = _.unionBy(fireMessages, messages, "_id");

        setMessages(
          updatedMessages.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
        );
      });
    console.log("updated");
    let users = [];
    firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("users")
      .onSnapshot((snapshot) => {
        users = [];
        snapshot.docs.forEach((doc) => {
          users.push(doc.data().user);
        });
        let usersTitle = "";
        users.forEach((user) => {
          usersTitle = usersTitle.concat(`${user.split("@", 1)},`);
        });

        navigation.setOptions({
          title: usersTitle,
        });

        console.log("current users", usersTitle);
      });
  }, []);
  useEffect(() => {
    firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("users")
      .doc(auth().currentUser.email)
      .set({
        user: auth().currentUser.email,
        timeStamp: new Date().toISOString(),
      })
      .then(() => {
        console.log("user updated");
      })
      .catch((err) => {
        console.log("firebase error", err);
      });

    return () => {
      console.log("unmounted");
      firestore()
        .collection("chats")
        .doc(chatRoomId)
        .collection("users")
        .doc(auth().currentUser.email)
        .delete();
    };
  }, []);
  const onSend = (messages = []) => {
    setMessages((previousState) => GiftedChat.append(previousState, messages));
    console.log(messages[0]);

    const { _id, createdAt, text, user } = messages[0];

    firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("messages")
      .doc(generateGuid())
      .set({
        _id,
        createdAt,
        text,
        user,
      })
      .then(() => {})
      .catch((err) => {
        console.log("firebase error", err);
      });
  };
  const signOut = async () => {
    await firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("users")
      .doc(auth().currentUser.email)
      .delete();

    console.log("signed out");

    auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const deleteUser = () => {
    firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("users")
      .doc("majed1@gmail.com")
      .delete();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentUsers,
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

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "green",
          },
          left: {
            backgroundColor: "#6C6C6C",
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
          left: {
            color: "white",
          },
        }}
        timeTextStyle={{ left: { color: "black" }, right: { color: "black" } }}
      />
    );
  };
  return (
    <GiftedChat
      listViewProps={{
        style: {
          backgroundColor: "#E7E7E7",
        },
      }}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth()?.currentUser?.email,
        name: auth()?.currentUser?.displayName,
      }}
      renderBubble={renderBubble}
    />
  );
};

export default ChatScreen;
