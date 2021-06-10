import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ChatRooms from "./src/screens/ChatRooms"
import profileScreen from "./src/screens/profileScreen"
import chatsProfileSwitcher from "./src/screens/chatsProfileSwitcher"
import { Provider as PaperProvider } from "react-native-paper";
import { PersistGate } from "redux-persist/integration/react";
import {persistor} from './src/redux';
const App = () => {
  const Stack = createStackNavigator();

  return (
    
    <PaperProvider>
      <PersistGate
      loading={null}
      persistor={persistor}
      >
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen name="chatRooms" component={ChatRooms}/> */}
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="register" component={RegisterScreen} />
          <Stack.Screen name="profileScreen" component={profileScreen} />
          <Stack.Screen name="chatsProfileSwitcher" component={chatsProfileSwitcher}/>
          <Stack.Screen
            name="chat"
            component={ChatScreen}
            options={{ title: null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PersistGate>
    </PaperProvider>
  );
};

export default App;
