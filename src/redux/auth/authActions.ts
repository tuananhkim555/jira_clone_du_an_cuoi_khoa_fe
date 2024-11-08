import { Dispatch } from 'redux';

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';

// Interface cho action types
interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: any; // Thay 'any' bằng kiểu dữ liệu user của bạn
}

interface LoginFailAction {
  type: typeof LOGIN_FAIL;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = LoginSuccessAction | LoginFailAction | LogoutAction;

// Action Creators
export const loginSuccess = (userData: any) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userData
  };
};

export const loginFail = (error: string) => {
  return {
    type: LOGIN_FAIL,
    payload: error
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

// Async Actions
export const login = (credentials: { email: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      // Thêm logic gọi API login của bạn ở đây
      // const response = await api.login(credentials);
      // dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFail(error instanceof Error ? error.message : 'Login failed'));
    }
  };
};

export const clearToken = () => {
  // function implementation
};

export const clearUser = () => {
  // implementation
};
