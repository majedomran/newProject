import { Input, Button } from "react-native-elements";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { setChatsReducerAction
 } from "../redux/reducers/chatsReducer";
import { useDispatch, useSelector } from "react-redux";
const ChatRooms = ({ navigation }) => {
  dispatch = useDispatch();

  const { chatRooms } = useSelector((state) => state.chats);

  const [localChatRooms, setLocalChatRooms] = useState([]);

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ];
  useEffect(() => {
    console.log("useEffect in chatrooms");

      dispatch(setChatsReducerAction("0F112844-B80F-C753-2A07-670CB81692F7"));

    
    
  }, []);
  useEffect(()=> {
    
    console.log('chatrooms updated',chatRooms)
    setLocalChatRooms({id:'231321',title:chatRooms})
    console.log('localChatRooms: ',localChatRooms)
    // DATA.push({id:'231321',title:localChatRooms})    
    // console.log('Data: ',DATA);

  },[chatRooms])
  function Item({ title }) {
    return (
      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate("login")}
      >
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
          {/* <TouchableOpacity style={{width=100,height=100}} onPress={navigation.navigate("login")}/> */}
        </View>
      </TouchableHighlight>
    );
  }
  const signOut = () => {
    navigation.replace("login");
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
        data={localChatRooms}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ChatRooms;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
