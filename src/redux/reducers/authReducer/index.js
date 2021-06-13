import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
export const addUserToFirestore = createAsyncThunk(
  "auth/addUserToFirestore",
  async (url) => {
    const user = auth().currentUser
    firestore().collection("users").doc(user.uid).set({
      email:user.email,
      photo:url
    });
  }
);
export const loginAction = createAsyncThunk(
  "auth/loginAction",
  async (userAuths, { rejectWithValue }) => {
    return auth()
      .signInWithEmailAndPassword(userAuths.email, userAuths.password)
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return rejectWithValue(err);
      });
  }
);

export const logoutAction = createAsyncThunk(
  "auth/logoutAction",
  async (empty, { rejectWithValue, getState }) => {
    return auth()
      .signOut()
      .then(() => {
        return false;
      })
      .catch((err) => {
        console.log(err);
        return rejectWithValue('TRUE');
      });
  }
);
export const getUserAuthAction = createAsyncThunk(
  "auth/getUserAuthAction",
  async () => {
    let user = auth().currentUser;
    return await firestore().collection('users').where("email","==",user.email).get().then((URL) => {
      
      return {
        userID: user.uid,
        userEmail: user.email,
        photoURL:URL.docs[0]?._data.photo
      };
    }).catch((e) => {
      console.log('error',e);
      
    })
  }
);

const initialState = {
  userID: null,
  userEmail: null,
  logedin: false,
  photoURL: null,
  loginError:false
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAll: () => initialState,
    setPhotoURL: (state, action) => {
      state.photoURL = action.payload;
    },
    setLogedin: (state, action) => {
      state.logedin = action.payload;
      state.loginError = action.payload
    },
  },
  extraReducers: {
    [logoutAction.fulfilled]: (state, action) => {
      state.logedin = action.payload;
    },
    [getUserAuthAction.fulfilled]: (state, action) => {
      state.userID = action.payload.userID;
      state.userEmail = action.payload.userEmail;
      state.photoURL = action.payload.photoURL
      state.logedin = true
    },
    [loginAction.rejected]: (state, action) => {
      state.loginError = true
    }
  },
});

export const {
  setLogedin: setLogedinAction,
  clearAll: clearAllAction,
  setPhotoURL: setPhotoURLAction,
} = authReducer.actions;

export default authReducer.reducer;
