

import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'
import ChatScreen from './src/screens/ChatScreen'
import { Provider as PaperProvider } from 'react-native-paper'; 


const App = () => {
  const Stack = createStackNavigator();

  return (
    <PaperProvider>


    <NavigationContainer>
<Stack.Navigator 
  >
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Register" component={RegisterScreen} />
<Stack.Screen name="Chat" component={ChatScreen} options={{title:null}}/>

</Stack.Navigator>
</NavigationContainer>
    </PaperProvider>

  );
};

export default App;
