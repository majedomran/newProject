import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) =>
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
   
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('in')
            navigation.replace('Chat')
        } else {
            // No user is signed in.
            
            console.log('out')  
        }
    });
    return unsubscribe;
}, [])
    const signIn = () =>
    {
        
        auth().signInWithEmailAndPassword(email, password).catch((error) =>
            {
                var errorMessage = error.message;
                alert(errorMessage)
            });
        
    }
    return (
        <View style={styles.container}>
            
            <Input
                placeholder='Enter your email'
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input

                placeholder='Enter your password'
                label='Password'
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title="login" style={styles.button} onPress={signIn} />
            <Button title="register" style={styles.button} onPress={() => navigation.navigate('Register')} />
        </View>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    button: {
        width: 200,
        marginTop: 10
    }
})