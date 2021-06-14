import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import {
  setLogedinAction,
  getUserAuthAction,
  addUserToFirestore,
  setPhotoURLAction,
} from '../redux/reducers/authReducer';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import styles from '../styles/registerScreenStyles';
import { getFileName } from '../helpers';
const RegisterScreen = ({ navigation }) => {
  dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [localPath, setLocalPath] = useState('');
  const [fileNameResponse, setFileNameResponse] = useState('');
  const [lang, setLang] = useState({
    en: {
      enterName: 'Enter your name',
      nameText: 'name',
      addPhoto: 'Add photo',
      photo: 'photo',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      passwordText: 'Password',
      emailText: 'email',
      signUp: 'Signup',
      login: 'Login',
      error: 'Something went wrong',
    },
  });
  const uploadImageToStorage = async (path, imageName) => {
    let reference = storage().ref(imageName);

    let task = reference.putFile(path);

    await task
      .then((res) => {
        storage()
          .ref(res.metadata.fullPath)
          .getDownloadURL()
          .then((url) => {
            console.log('url from storage => ', url);
            dispatch(addUserToFirestore(url));
            dispatch(setPhotoURLAction(url));
          });
      })
      .catch((e) => console.log('uploading image error => ', e));
  };

  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker', storage());
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('response', response.assets[0].uri);
        console.log(
          `local path: ${response.assets[0].uri}
          fileName: ${response.fileName}`
        );
        setLocalPath(response.assets[0].uri);
        setFileNameResponse(response.fileName);
      }
    });
  };
  const register = ({}) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('localPath', localPath);
        console.log('filename', getFileName(fileNameResponse, localPath));

        if (localPath) {
          console.log('no photo');
          uploadImageToStorage(
            localPath,
            getFileName(fileNameResponse, localPath)
          );
        } else {
          dispatch(addUserToFirestore());
        }

        dispatch(getUserAuthAction());

        dispatch(setLogedinAction(true));

        console.log('User account created & signed in!');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          setRegisterError('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setRegisterError('That email address is invalid!');
        }

        console.log(error);
      });
  };
  const {
    enterEmail,
    error,
    login,
    signUp,
    emailText,
    enterPassword,
    passwordText,
    addPhoto,
    enterName,
    nameText,
    photo,
  } = lang.en;

  return (
    <View style={styles.container}>
      <Input
        placeholder={enterName}
        label={nameText}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder={enterEmail}
        label={emailText}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder={enterPassword}
        label={passwordText}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button title={addPhoto} onPress={chooseFile} />
      <Text style={{ color: 'red' }}>{registerError}</Text>
      <Button title={signUp} style={styles.button} onPress={register} />
    </View>
  );
};
export default RegisterScreen;
