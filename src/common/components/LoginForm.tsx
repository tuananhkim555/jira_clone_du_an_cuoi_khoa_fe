import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    onSubmit(email, password);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Sao chép nội dung form từ component Login */}
    </form>
  );
};

export default LoginForm;
