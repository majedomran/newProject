import firestore from '@react-native-firebase/firestore';

export function generateGuid() {
    var result, i, j;
    result = "";
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
      i = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
      result = result + i;
    }
    return result;
  }
  export const getFileName = (name, path) => {
    if (name != null) {
      return name;
    }

    if (Platform.OS === "ios") {
      path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
  };
  export const unionFirestoreToArray = (fireRes,array) => {
    let result = []
    fireRes.docs.forEach((doc) => {
      array.forEach((chat) => {
        if(chat.email === doc.data().email){
          // console.log(chat.email);
          result.push({
            id:chat.id,
            email:chat.email,
            photo:doc.data().photo
          })
        }
        
      })
    })
    return result
  }
  export const filterEmailOut = (chats, userEmail) => {
    //clean an email out of an array 
    let chatsWithoutEmail = []
    chats.forEach((chat) => {
      chat.users.forEach((user) => {
        if (!user.includes(userEmail)) {
          chatsWithoutEmail.push({ id: chat.id, email: user });
        }
      });
    });
    console.log('chatsWithoutEmail', chatsWithoutEmail);
    
    return chatsWithoutEmail
  }
  export const getUsers = (chats) => {
    let users = []
    chats.forEach((chat) => {
      users.push(chat.email)
    })
    
    console.log('getUsers',users);
    
    return users
  }
  export const paginateChats = (chats,userEmail) => {
    let chatsClean = filterEmailOut(chats,userEmail)
    let users = getUsers(chatsClean)
    let usersAndChats = [];
        const usersLength = users.length;
        for (let index = 0; index < Math.ceil(usersLength / 10); index++) {
          usersAndChats.push({
            paginatedUsers: users.splice(0, 10),
            paginatedChatsClean: chatsClean.splice(0, 10),
          });

         
        }
        return usersAndChats
  }