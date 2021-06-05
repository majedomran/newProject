import { View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import auth from "@react-native-firebase/auth";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import Feather from "react-native-vector-icons/Feather";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  logoutAction,
  setLogedFalseAction,
} from "../redux/reducers/authReducer";
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
  dispatch = useDispatch();
  const { logedin, userEmail } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(
    "0F112844-B80F-C753-2A07-670CB81692F7"
  );
  const [currentUsers, setCurrentUsers] = useState(email);
  let email = "majed1@gmail.com";

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
    console.log("userEmail in chatscreen is: ", userEmail);
    firestore()
      .collection("chats")
      .doc(chatRoomId)
      .collection("users")
      .doc(userEmail)
      .set({
        user: userEmail,
        timeStamp: new Date().toISOString(),
      })
      .then(() => {
        console.log("user updated");
      })
      .catch((err) => {
        console.log("firebase error", err);
      });
  }, []);
  useEffect(() => {
    if (!logedin) navigation.replace("login");
  }, [logedin]);
  const onSend = (messages = []) => {
    console.log("user id is: ", auth().currentUser.uid);

    setMessages((previousState) => GiftedChat.append(previousState, messages));

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
    dispatch(logoutAction());
    // dispatch(setLogedFalseAction(false))
    // deleteUser()
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
        timeTextStyle={{
          left: { color: "#AEAEAE" },
          right: { color: "#AEAEAE" },
        }}
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
        _id: auth()?.currentUser?.uid,
        name: auth()?.currentUser?.displayName,
      }}
      renderAvatar={null}
      renderBubble={renderBubble}
    />
  );
};

export default ChatScreen;
