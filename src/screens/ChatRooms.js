import { Input, Button } from 'react-native-elements';
import {
  View,
  FlatList,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { setChatsReducerAction } from '../redux/reducers/chatsReducer';
import { logoutAction, clearAllAction } from '../redux/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import {
  generateGuid,
  unionFirestoreToArray,
  paginateChats,
} from '../helpers';
import _ from 'lodash';
import styles from '../styles/chatRoomsStyles';
const ChatRooms = ({ navigation }) => {
  dispatch = useDispatch();

  const { chatRooms } = useSelector((state) => state.chats);
  const { userEmail, logedin } = useSelector((state) => state.auth);

  const [isModalVisible, setModalVisible] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState();
  useEffect(() => {
    getChats();
  }, []);
  const getChats = async () => {
    let chats = [];
    firestore()
      .collection('chats')
      .where('users', 'array-contains', userEmail)
      .get()
      .then((users) => {
        // 1- get each chat user 
        users.docs.forEach((user) => {
          chats.push({ id: user.id, users: user._data.users });
        });
      })
      .then(async () => {
        // -2 paginate chats and users so we request 10 users at a time 
        
        const usersAndChats = paginateChats(chats, userEmail); // a list of lists each containing 10 users and 10 chats
        let finalChats = [];
        // -3 request each 10 users and push to finalChats 
        for (const item of usersAndChats) {
          const paginatedUsers = item.paginatedUsers;
          const paginatedChatsClean = item.paginatedChatsClean;

          await firestore()
            .collection('users')
            .where('email', 'in', paginatedUsers)
            .get()
            .then((res) => {
              finalChats.push(unionFirestoreToArray(res, paginatedChatsClean));
            })
            .catch((e) => {
              console.log('error: ', e);
            });
        }
        //dispatch and then flatten in the reducer 
        dispatch(setChatsReducerAction(finalChats));
      })
      .catch((e) => {
        console.log('error', e);
      });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const Item = ({ item }) => {
    return (
      <TouchableHighlight
        style={{ marginBottom: 10 }}
        onPress={() =>
          navigation.navigate('chat', {
            chatID: item.id,
            userEmail,
            users: item.email,
          })
        }
      >
        <View
          style={{
            alignItems: 'baseline',
            flexDirection: 'row',
            borderWidth: 1,
            alignSelf: 'stretch',
          }}
        >
          <Image
            style={{ width: 50, height: 50, marginRight: 15 }}
            source={{
              uri: item.photo,
            }}
          />
          <Text style={{ alignSelf: 'center' }}>{item.email}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  useEffect(() => {
    if (!logedin) navigation.popToTop('login');
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
      .collection('chats')
      .doc(Guid)
      .set({ users: [userEmail, emailToAdd === null ? '' : emailToAddSmall] })
      .then(() => {
        getChats();
      })
      .catch((e) => {
        console.log('error', e);
      });
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={{ alignContent: 'flex-start', alignSelf: 'stretch' }}
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
