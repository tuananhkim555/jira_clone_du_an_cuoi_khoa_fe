import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import logoLogin from "../../assets/Logo Jira 5.png";
import { Link, useNavigate } from "react-router-dom";
import ShinyEffect from "../../components/ShinyEffect";
import { BackgroundBeamsWithCollision } from "../../components/ui/Background-beams-with-collision";
import Reveal from "../../components/Reveal";
import axios from "axios";
import { notification } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from "./auth.module.css"
import { useDispatch } from 'react-redux';
import { setUser } from '../../store'; // Đảm bảo đường dẫn đúng

interface GoogleLoginResponse {
  success: boolean;
  message?: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý đăng nhập Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const { access_token } = tokenResponse;
        if (!access_token) {
          throw new Error("No access token received from Google");
        }

        // Gọi API backend để xác thực token
        const response = await axios.post<GoogleLoginResponse>('YOUR_BACKEND_API_URL/google-login', { token: access_token });

        if (response.data.success) {
          notification.success({
            message: "Google login successful!",
            placement: "topRight",
            duration: 4,
          });
          navigate("/project");
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        notification.error({
          message: "Google login failed!",
          description: error instanceof Error ? error.message : "An error occurred",
          placement: "topRight",
          duration: 4,
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      notification.error({
        message: "Google login failed!",
        description: "An error occurred while connecting to Google",
        placement: "topRight",
        duration: 4,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    if (!email || !password) {
      notification.error({
        message: "Please enter email and password!",
        placement: "topRight",
        duration: 4,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://jiranew.cybersoft.edu.vn/api/Users/signin",
        { email, passWord: password },
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            TokenCybersoft: import.meta.env.VITE_CYBERSOFT_TOKEN,
          },
        }
      );
      
      // Dispatch action để lưu thông tin user vào Redux store
      dispatch(setUser(response.data.content));
      
      // Lưu token vào localStorage nếu cần
      localStorage.setItem('authToken', response.data.content.accessToken);

      notification.success({
        message: "Login successful!",
        placement: "topRight",
        duration: 4,
      });
      navigate("/project");
    } catch (error) {
      notification.error({
        message: "Login failed!",
        description: error instanceof Error ? error.message : "An error occurred",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.bgAuth} relative overflow-hidden`}>
      {isLoading && <LoadingSpinner />}
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0" children={undefined} />
      <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'justify-between'} items-center h-screen mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 ${isMobile ? 'pt-20' : ''}`}>
        <Reveal>
          <div className={`${isMobile ? 'mb-8' : 'mb-10 md:mb-0 md:mr-10 lg:mr-20'}`}>
            <div className={`flex items-center justify-center ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'}`}>
              <img
                src={logoLogin}
                alt="Logo"
                className={`${isMobile ? 'w-44 mb-4' : 'w-40 sm:w-52 md:w-60 lg:w-80'} h-auto object-contain ${isMobile ? '' : 'mb-4 md:mb-0 md:mr-4'}`}
              />
              <h2 className={`text-gray-200 ${isMobile ? 'text-3xl' : 'text-3xl md:text-5xl lg:text-6xl'} text-center font-semibold`}>
                Software
              </h2>
            </div>
          </div>
        </Reveal>
        <div className={`flex flex-col p-6 bg-opacity-70 backdrop-blur-lg rounded-lg shadow-2xl w-full ${isMobile ? 'max-w-md' : 'max-w-md'} z-50 bg-[gray]/5 ${isMobile ? 'mt-8' : ''}`}>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
              Đăng nhập
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm"
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-400"
                >
                  Mật khẩu
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm"
                    placeholder="Nhập mật khẩu"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? (
                      <FaEye
                        size={18}
                        onClick={togglePassword}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FaEyeSlash
                        size={18}
                        onClick={togglePassword}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 duration-300 hover:scale-105"
                >
                  Đăng nhập
                </button>
              </div>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="inline-flex items-center justify-center w-9 h-9 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none duration-300 hover:scale-110 mr-2"
                >
                  <FaGoogle size={16} className="text-white" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-9 h-9 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none duration-300 hover:scale-110 ml-2"
                >
                  <FaFacebookF size={16} className="text-white" />
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <Link to="/register" className="text-gray-400 text-sm">
                Bạn chưa có tài khoản?{" "}
                <span className="text-orange-400 hover:underline">
                  Nhấn vào đây để đăng ký
                </span>
              </Link>
            </div>
          </div>
        </div>
        <ShinyEffect left={0} top={0} size={1000} />
      </div>
    </div>
  );
};

export default Login;
