// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'
import ChatScreen from './screens/ChatScreen'
import { Provider as PaperProvider } from 'react-native-paper'; 


const App = () => {
  const Stack = createStackNavigator();

  return (
    <PaperProvider>


    <NavigationContainer>
<Stack.Navigator >
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
<Stack.Screen name="Chat" component={ChatScreen} />

</Stack.Navigator>
</NavigationContainer>
    </PaperProvider>

  );
};

export default App;
