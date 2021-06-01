import React, { useEffect } from 'react'
import { View, TouchableOpacity, Button } from 'react-native'
import { Avatar } from 'react-native-elements'
import { useState, useCallback, useLayoutEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat'
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';


Feather.loadFont()

const ChatScreen = ({ navigation }) =>
{
    function generateGuid()
    {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++)
        {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    }
    const [messages, setMessages] = useState([]);
    const [chatRoomId, setChatRoomId] = useState()
    const newChatRoom = () =>
    {
        setChatRoomId(generateGuid())
    }
    useEffect(() =>
    {
        const oldMessages = []

        const roomId = '0F112844-B80F-C753-2A07-670CB81692F7'
        setChatRoomId(roomId)
        firestore().collection('chats').doc(roomId).collection('messages').orderBy('createdAt','desc').onSnapshot((snapshot) =>
        {
            snapshot.docs.forEach((doc) =>
            {
                const { _id, createdAt, text, user } = doc.data()
                
                if (doc.data()._id)
                {
                    oldMessages.push({
                        _id,
                        createdAt: new Date(createdAt.toDate()),
                        text,
                        user
                    })
                    console.log("pushed", doc.data())
                }
            })
        })
        oldMessages.push({
            _id:2,
            createdAt: new Date(),
            text:'hey',
            user:{
                _id:1
            }
        })
        setMessages(oldMessages)
        console.log(messages)


    }, [])

    const onSend = (messages = []) =>
    {
        setMessages(previousState => GiftedChat.append(previousState, messages))
        console.log(messages[0]);

        const { _id, createdAt, text, user,
        } = messages[0]
        // console.log(
        //     `ID${_id},
        // createat ${createdAt}
        // text ${text},
        // user ${user}`);

        firestore().collection('chats').doc(chatRoomId).collection('messages').doc(generateGuid()).set({
            _id,
            createdAt,
            text,
            user

        }).then(() =>
        {

        }).catch((err) =>
        {

            console.log('firebase error', err);

        })

    }
    const signOut = () =>
    {
        auth().signOut().then(() =>
        {
            // Sign-out successful.
            navigation.replace("Login");
        }).catch((error) =>
        {
            // An error happened.
        });
    }

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Feather
                        name='arrow-left'
                        size={40}
                        color='black'
                        onPress={signOut}
                    />

                    <Avatar
                        rounded
                        source={{
                            uri: auth?.currentUser?.photoURL,
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity
                >
                    <Button
                        title="Logout" onPress={signOut}
                    />
                    {/* <AntDesign name="logout" size={24} color="black" /> */}
                </TouchableOpacity>
            )
        })
    }, [navigation])
    return (<GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: auth()?.currentUser?.email,
            name: auth()?.currentUser?.displayName
        }} />
    )
}

export default ChatScreen