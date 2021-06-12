import { View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import auth from "@react-native-firebase/auth";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import Feather from "react-native-vector-icons/Feather";
import firestore from "@react-native-firebase/firestore";
import _ from "lodash";
import { useDispatch } from "react-redux";
import {generateGuid} from '../helpers'
import styles from '../styles/chatScreenStyles'
Feather.loadFont();
const ChatScreen = ({route, navigation }) => {
  dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
    const { chatID, userEmail, users } = route.params;
    useEffect(() => {
      console.log(
        `route params:
        chatID: ${chatID}
        userEmail ${userEmail}
        `
      )
    const fireMessages = [];
    firestore()
      .collection("chats")
      .doc(chatID)
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
  }, []);

  const onSend = (messages = []) => {
    setMessages((previousState) => GiftedChat.append(previousState, messages));
    const { _id, createdAt, text, user } = messages[0];
    firestore()
      .collection("chats")
      .doc(chatID)
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
    navigation.navigate('chatRooms')
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
      title: users.split('@')[0],
      headerLeft: () => (
        <View style={styles.backButton}>
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
