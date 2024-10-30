import { createSlice } from "@reduxjs/toolkit";
import { removeToken } from "@/utils";
import { setToken as _setToken, getToken } from "@/utils";

import { loginApi, getProfileApi } from "@/apis/user";

const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || "",
    userInfo: {},
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      //localStorage
      _setToken(action.payload);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.token = "";
      state.userInfo = {};
      removeToken();
    },
  },
});

const { setToken, setUserInfo, clearUserInfo } = userStore.actions;

const userReducer = userStore.reducer;

//异步请求
//获取token
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await loginApi(loginForm);
    console.log(res.data);

    dispatch(setToken(res.data.token));
  };
};

//获取个人信息
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getProfileApi();
    dispatch(setUserInfo(res.data));
  };
};

export { setToken, fetchLogin, fetchUserInfo, clearUserInfo };

export default userReducer;
