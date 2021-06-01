import { View, TouchableOpacity, Button } from 'react-native'
import { Avatar } from 'react-native-elements'
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash'

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
        const fireMessages = []

        const roomId = '0F112844-B80F-C753-2A07-670CB81692F7'
        setChatRoomId(roomId)
        firestore().collection('chats').doc(roomId).collection('messages').orderBy('createdAt', 'desc').onSnapshot((snapshot) =>
        {
            snapshot.docs.forEach((doc) =>
            {

                const { _id, createdAt, text, user } = doc.data()



                if (doc.data()._id)
                {
                    fireMessages.push({
                        _id,
                        createdAt: new Date(createdAt.toDate()),
                        text,
                        user
                    })
                }
            })
            let updatedMessages = _.unionBy(fireMessages, messages, '_id')

            console.log('updatedMessages', updatedMessages[0]);

            setMessages(updatedMessages.sort((a, b) =>
            {
                return new Date(b.createdAt) - new Date(a.createdAt)
            }))
            console.log('messages', messages[0])
        })



    }, [])

    const onSend = (messages = []) =>
    {
        setMessages(previousState => GiftedChat.append(previousState, messages))
        console.log(messages[0]);

        const { _id, createdAt, text, user,
        } = messages[0]

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
                   
                </TouchableOpacity>
            )
        })
    }, [navigation])


    const renderBubble = (props) =>
    {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'green'
                    },
                    left: {
                        backgroundColor: '#6C6C6C',
                        color: 'red'
                    }
                }}
                textStyle={{
                    right: {
                        color: 'white'
                    },
                    left: {
                        color: 'white'
                    }
                }}
                timeTextStyle={{ left: { color: 'black' }, right: { color: 'black' } }}


            />
        )
    }
    return (

        <GiftedChat
            listViewProps={{
                style: {
                    backgroundColor: '#E7E7E7',
                },
            }}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth()?.currentUser?.email,
                name: auth()?.currentUser?.displayName
            }}
            renderBubble={renderBubble
            }
        />
    )
}

export default ChatScreen