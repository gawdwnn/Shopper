import { AsyncStorage } from 'react-native';

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const AUTHENTICATE = "AUTHENTICATE";

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      payload: {
        token: token,
        userId: userId
      }
    });
  }
}

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAsUbYkGv2zSOXsr7VcinLTtIEcUjtiaIY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message
      let message = "Something went wrong"
      if (errorId === "EMAIL_EXISTS") {
        message = "This E-Mail exists already!";
      } else if (errorId === "WEAK_PASSWORD : Password should be at least 6 characters") {
        message = "Password should be at least 6 characters"
      } 
      throw new Error(message);
    }

    const responseData = await response.json();
    // console.log(responseData);
    // dispatch({
    //   type: SIGNUP,
    //   payload: {
    //     token: responseData.idToken,
    //     userId: responseData.localId
    //   }
    // });
    dispatch(authenticate(responseData.localId, responseData.idToken, parseInt(responseData.expiresIn) * 1000))
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAsUbYkGv2zSOXsr7VcinLTtIEcUjtiaIY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );
      
    if(!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;
      let message = "Something went wrong";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This E-Mail could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is invalid!"
      }
      throw new Error(message);
    }

    const responseData = await response.json(); 
    // console.log(responseData);
    // dispatch({
    //   type: SIGNUP,
    //   payload: {
    //     token: responseData.idToken,
    //     userId: responseData.localId
    //   }
    // });
    dispatch(authenticate(responseData.localId, responseData.idToken, parseInt(responseData.expiresIn) * 1000))
    const expirationDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);
    // console.log(expirationDate);
    saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
}

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
}

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime); 
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  // console.log(expirationDate)
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({ token: token, userId: userId, expiryDate: expirationDate.toISOString() })
  );
}
