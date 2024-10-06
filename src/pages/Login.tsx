import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import logoLogin from "../assets/Logo Jira 5.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate và Link
import "../index.css";
import ShinyEffect from "../components/ShinyEffect";
import { BackgroundBeamsWithCollision } from "../components/ui/Background-beams-with-collision";
import Reveal from "../components/Reveal";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import { notification } from "antd"; // Import notification từ antd
import { useGoogleLogin } from "@react-oauth/google"; // Sử dụng đúng hook

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Sử dụng useNavigate cho điều hướng

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Hàm xử lý đăng nhập Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const credential = tokenResponse.access_token;
        if (credential) {
          const decoded = jwtDecode(credential);
          console.log("Google login thành công:", decoded);

          notification.success({
            message: "Đăng nhập Google thành công!",
            placement: "topRight",
            duration: 4,
            style: { animation: "slide-in 0.5s forwards" },
          });

          // Điều hướng đến dashboard sau khi đăng nhập Google thành công
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Lỗi trong quá trình đăng nhập Google:", error);
        notification.error({
          message: "Đăng nhập Google thất bại!",
          placement: "topRight",
          duration: 4,
          style: { animation: "slide-in 0.5s forwards" },
        });
      }
    },
    onError: () => {
      notification.error({
        message: "Đăng nhập Google thất bại!",
        placement: "topRight",
        duration: 4,
        style: { animation: "slide-in 0.5s forwards" },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    // Kiểm tra xem email và mật khẩu có được nhập không
    if (!email || !password) {
      notification.error({
        message: "Vui lòng nhập email và mật khẩu!",
        placement: "topRight",
        duration: 4,
        style: { animation: "slide-in 0.5s forwards" },
      });
      return; // Dừng nếu không có email hoặc mật khẩu
    }

    // Gọi API đăng nhập
    try {
      const response = await axios.post(
        "https://jiranew.cybersoft.edu.vn/api/Users/signin",
        {
          email,
          passWord: password,
        },
        {
          headers: {
            "Content-Type": "application/json-patch+json",
            TokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBETiAxMSIsIkhldEhhblN0cmluZyI6IjE3LzAyLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTczOTc1MDQwMDAwMCIsIm5iZiI6MTcwOTc0NDQwMCwiZXhwIjoxNzM5ODk4MDAwfQ.qvs2zsWDKR2CRt273FQIadSYJzZM-hCro_nsLVpa-Wg",
          },
        }
      );

      console.log("Đăng nhập thành công:", response.data);
      notification.success({
        message: "Đăng nhập thành công!",
        placement: "topRight",
        duration: 4,
        style: { animation: "slide-in 0.5s forwards" },
      });
      navigate("/dashboard"); // Điều hướng sau khi đăng nhập thành công
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      notification.error({
        message: "Đăng nhập thất bại!",
        placement: "topRight",
        duration: 4,
        style: { animation: "slide-in 0.5s forwards" },
      });
    }
  };

  return (
    <>
      <BackgroundBeamsWithCollision className="overflow-hidden">
        <div className="flex flex-col md:flex-row lg:justify-around justify-center items-center h-screen mx-10">
          <Reveal>
            <div className="mb-10 md:mb-0">
              <div className="flex items-center justify-center flex-col lg:flex-row md:space-x-2">
                <img
                  src={logoLogin}
                  alt="Logo"
                  className="w-1/3 md:w-1/2 h-auto object-cover mb-4 md:mb-0"
                />
                <h2 className="text-4xl md:text-5xl lg:text-6xl text-center font-semibold">
                  Software
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col p-6 bg-opacity-70 backdrop-blur-lg rounded-lg shadow-2xl xl:max-w-6xl z-50 inset-0 bg-[gray]/5 relative">
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
                  {/* Đăng nhập bằng Google (sử dụng icon) */}
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
              <div className="mt-4">
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
      </BackgroundBeamsWithCollision>
    </>
  );
};

export default Login;
