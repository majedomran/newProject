import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
export const addUserToFirestore = createAsyncThunk(
  "auth/addUserToFirestore",
  async (url) => {
    const user = auth().currentUser
    console.log(user);
    
    firestore().collection("users").doc(user.uid).set({
      email:user.email,
      photo:url
    });
  }
);
export const loginAction = createAsyncThunk(
  "auth/loginAction",
  async (userAuths, { rejectWithValue }) => {
    console.log("loginAction");
    console.log(
      `password: ${userAuths.password} 
            userEmail: ${userAuths.email}
          `
    );
    return auth()
      .signInWithEmailAndPassword(userAuths.email, userAuths.password)
      .then(() => {
        console.log("loged");
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
    const chatRoomId = "0F112844-B80F-C753-2A07-670CB81692F7";
    console.log("signed Out email:", getState().auth.userEmail);
    // firestore()
    //   .collection("chats")
    //   .doc(chatRoomId)
    //   .collection("users")
    //   .doc(getState().auth.userEmail)
    //   .delete();
    return auth()
      .signOut()
      .then(() => {
        console.log("loged out");
        return false;
      })
      .catch((err) => {
        console.log(err);
        return rejectWithValue(true);
      });
    console.log("signed Out");
  }
);
export const setUserAuthAction = createAsyncThunk(
  "auth/setUserAuthAction",
  async () => {
    let user = auth().currentUser;
    console.log("user: ", user);

    return {
      userID: user.uid,
      userEmail: user.email,
    };
  }
);

const initialState = {
  userID: null,
  userEmail: null,
  logedin: false,
  photoURL: null,
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
    },
  },
  extraReducers: {
    [loginAction.fulfilled]: (state, action) => {
      state.logedin = action.payload;
    },
    [logoutAction.fulfilled]: (state, action) => {
      state.logedin = action.payload;
    },
    [setUserAuthAction.fulfilled]: (state, action) => {
      state.userID = action.payload.userID;
      state.userEmail = action.payload.userEmail;
    },
  },
});

export const {
  setLogedin: setLogedinAction,
  clearAll: clearAllAction,
  setPhotoURL: setPhotoURLAction,
} = authReducer.actions;

export default authReducer.reducer;
