import axios from 'axios';

interface GoogleLoginResponse {
  success: boolean;
  message?: string;
}

interface UserResponse {
  content: {
    id: string;
    email: string;
    avatar: string;
    phoneNumber: string;
    name: string;
    accessToken: string;
  };
}

export const handleGoogleLogin = async (access_token: string) => {
  const response = await axios.post<GoogleLoginResponse>(
    'YOUR_BACKEND_API_URL/google-login',
    { token: access_token }
  );
  return response.data;
};

export const handleUserLogin = async (email: string, password: string) => {
  const response = await axios.post<UserResponse>(
    "https://jiranew.cybersoft.edu.vn/api/Users/signin",
    { email, passWord: password },
    {
      headers: {
        "Content-Type": "application/json-patch+json",
        TokenCybersoft: import.meta.env.VITE_CYBERSOFT_TOKEN,
      },
    }
  );
  return response.data;
};
