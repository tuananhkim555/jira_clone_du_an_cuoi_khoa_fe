import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaLock, FaEye, FaEyeSlash, FaUser, FaPhoneAlt} from 'react-icons/fa'; 
import logoLogin from "../assets/Logo Jira 5.png";
import { Link, useNavigate } from 'react-router-dom';
import "../index.css";
import ShinyEffect from '../components/ShinyEffect';
import { BackgroundBeamsWithCollision } from '../components/ui/Background-beams-with-collision';
import Reveal from '../components/Reveal';
import axios from 'axios'; // Add this import for making HTTP requests
import { Alert } from 'antd'; // Đảm bảo đã import Alert từ antd

const Register: React.FC = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState<string>(''); 
    const [emailValid, setEmailValid] = useState<boolean>(false); 
    const [emailError, setEmailError] = useState<string>(''); 
    const [password, setPassword] = useState<string>(''); 
    const [passwordError, setPasswordError] = useState<string>(''); 
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null); // Trạng thái mật khẩu để điều chỉnh icon
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null); // Trạng thái email để điều chỉnh icon
    const [fullName, setFullName] = useState<string>(''); 
    const [fullNameError, setFullNameError] = useState<string>(''); 
    const [fullNameValid, setFullNameValid] = useState<boolean | null>(null); // Trạng thái họ tên để điều chỉnh icon
    const [phoneNumber, setPhoneNumber] = useState<string>(''); 
    const [phoneNumberError, setPhoneNumberError] = useState<string>(''); 
    const [phoneNumberValid, setPhoneNumberValid] = useState<boolean | null>(null); // Trạng thái số điện thoại để điều chỉnh icon
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Thêm useEffect để tự động ẩn alert sau 4 giây
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email: string): boolean => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const validatePhoneNumber = (phoneNumber: string): boolean => {
        const regex = /^\d+$/;
        return regex.test(phoneNumber);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        const isValid = validateEmail(value);
        setIsEmailValid(isValid);

        if (!value) {
            setEmailError('Email không được để trống');
        } else if (!isValid) {
            setEmailError('Email không đúng định dạng');
        } else {
            setEmailError('');
        }
    };

    const handleEmailBlur = () => {
        if (!email) {
            setEmailError('Email không được để trống');
        } else if (!validateEmail(email)) {
            setEmailError('Email không đúng định dạng');
        } else {
            setEmailError('');
        }
    };

    // Kiểm tra mật khẩu và thay đổi icon tương ứng
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        if (value === '') {
            setIsPasswordValid(false);
            setPasswordError('Không được để trống mật khẩu');
        } else {
            setIsPasswordValid(true);
            setPasswordError('');
        }
    };

    // Xử lý khi rời khỏi trường mật khẩu
    const handlePasswordBlur = () => {
        if (password === '') {
            setIsPasswordValid(false); // Giữ nguyên icon Lock
            setPasswordError('Không được để trống mật khẩu'); // Hiển thị thông báo lỗi
        }
    };


    // Xử lý khi trường email được focus, reset lại icon Lock
    const handleEmailFocus = () => {
        setIsEmailValid(null); // Reset lại icon khóa khi được focus
    };

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFullName(value);

        if (value === '') {
            setFullNameValid(false);
            setFullNameError('Họ tên không được để trống');
        } else {
            setFullNameValid(true);
            setFullNameError('');
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneNumber(value);

        const isValid = validatePhoneNumber(value);
        setPhoneNumberValid(isValid);

        if (value === '') {
            setPhoneNumberValid(false);
            setPhoneNumberError('Số điện thoại không được để trống');
        } else if (!isValid) {
            setPhoneNumberValid(false);
            setPhoneNumberError('Số điện thoại phải là số');
        } else {
            setPhoneNumberValid(true);
            setPhoneNumberError('');
        }
    };

    const handlePhoneNumberFocus = () => {
        // Add any logic needed on focus, or leave empty if not needed
    };

    const handleFullNameFocus = () => {
        // Add any focus handling logic here if needed
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        const model = {
            email,
            passWord: password,
            name: fullName,
            phoneNumber,
        };

        try {
            const response = await axios.post('https://jiranew.cybersoft.edu.vn/api/Users/signup', model, {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBETiAxMSIsIkhldEhhblN0cmluZyI6IjE3LzAyLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTczOTc1MDQwMDAwMCIsIm5iZiI6MTcwOTc0NDQwMCwiZXhwIjoxNzM5ODk4MDAwfQ.qvs2zsWDKR2CRt273FQIadSYJzZM-hCro_nsLVpa-Wg',
                },
            });
            console.log('Signup successful:', response.data);
            setAlert({ message: 'Đăng ký thành công!', type: 'success' }); // Hiển thị alert thành công

            // Chuyển đến trang đăng nhập sau 4 giây
            setTimeout(() => {
                navigate('/login');
            }, 800);
        } catch (error: any) { // Assert error type
            console.error('Signup error:', error.response?.data);
            setAlert({ message: 'Đăng ký thất bại! Email đã tồn tại', type: 'error' }); // Hiển thị alert thất bại
        }
    };

    const onClose = () => {
        setAlert(null);
    };

    return (
        <>
        <BackgroundBeamsWithCollision className='overflow-hidden'>
        <div className="flex flex-col md:flex-row lg:justify-around justify-center items-center h-screen mx-10">
            <Reveal>
            <div className="mb-4 md:mb-0">
                <div className="flex items-center justify-center flex-col lg:flex-row md:space-x-2">
                    <img src={logoLogin} alt="Logo" className="w-1/3 md:w-1/2 h-auto object-cover mb-4 md:mb-0" />
                    <h2 className="hidden md:block text-4xl md:text-5xl lg:text-6xl text-center font-semibold">Software</h2>
                </div>   
            </div>
            </Reveal>
            <div className="flex flex-col max-w-sm p-5 bg-opacity-70 backdrop-blur-lg rounded-lg shadow-2xl md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-4 z-50 inset-0 bg-[gray]/5 relative">
                <div className="flex flex-col ">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">Đăng ký</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    {isEmailValid === true ? (
                                        <FaCheckCircle size={16} className="text-green-500" />
                                    ) : isEmailValid === false ? (
                                        <FaTimesCircle size={16} className="text-orange-400" />
                                    ) : (
                                        <FaEnvelope size={16} />
                                    )}
                                </div>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm" 
                                    placeholder="Nhập vào email của bạn..." 
                                    value={email} 
                                    onChange={handleEmailChange} 
                                    onBlur={handleEmailBlur} 
                                    onFocus={handleEmailFocus}
                                />
                            </div>
                            <div className="min-h-[20px] mt-1">
                                {emailError && <p className="text-orange-400 text-sm">{emailError}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Mật khẩu</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    {isPasswordValid === true ? (
                                        <FaCheckCircle size={16} className="text-green-500" />
                                    ) : isPasswordValid === false ? (
                                        <FaTimesCircle size={16} className="text-orange-400" />
                                    ) : (
                                        <FaLock size={16} />
                                    )}
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    id="password" 
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm" 
                                    placeholder="Nhập mật khẩu của bạn" 
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showPassword ? <FaEye size={18} onClick={togglePassword} className='cursor-pointer' /> : <FaEyeSlash size={18} onClick={togglePassword} className='cursor-pointer' />}
                                </div>
                            </div>
                            <div className="min-h-[20px] mt-1">
                                {passwordError && <p className="text-orange-400 text-sm">{passwordError}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-400">Họ tên</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    {fullNameValid === true ? (
                                        <FaCheckCircle size={16} className="text-green-500" />
                                    ) : fullNameValid === false ? (
                                        <FaTimesCircle size={16} className="text-orange-400" />
                                    ) : (
                                        <FaUser size={16} />
                                    )}
                                </div>
                                <input type="text" name="fullName" id="fullName" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm" placeholder="Nhập tên của bạn" value={fullName} onChange={handleFullNameChange} onBlur={handleFullNameFocus} />
                            </div>
                            <div className="min-h-[20px] mt-1">
                                {fullNameError && <p className="text-orange-400 text-sm">{fullNameError}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">Số điện thoại</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    {phoneNumberValid === true ? (
                                        <FaCheckCircle size={16} className="text-green-500" />
                                    ) : phoneNumberValid === false ? (
                                        <FaTimesCircle size={16} className="text-orange-500" />
                                    ) : (
                                        <FaPhoneAlt size={16} />
                                    )}
                                </div>
                                <input type="tel" name="phoneNumber" id="phoneNumber" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm" placeholder="Nhập số điện thoại của bạn" value={phoneNumber} onChange={handlePhoneNumberChange} onBlur={handlePhoneNumberFocus} />
                            </div>
                            <div className="min-h-[20px] mt-1">
                                {phoneNumberError && <p className="text-orange-400 text-sm">{phoneNumberError}</p>}
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 duration-300 hover:scale-105">
                                Đăng ký
                            </button>
                        </div>
                    </form>
                    <div className="mt-2">
                        <Link to="/login" className="text-gray-400 text-sm">Bạn đã có tài khoản? <span className='text-orange-400 hover:underline'>Nhấn vào đây để đăng nhập</span> </Link>
                    </div>
                </div>
            </div>
            <ShinyEffect left={0} top={0} size={1000} />
        </div>
        {alert && (
            <div className="absolute top-0 right-0 m-4">
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    closable
                    onClose={() => setAlert(null)}
                    className="animate-slide-in text-lg" // Thêm class cho animation và tăng kích thước chữ
                />
            </div>
        )}
        </BackgroundBeamsWithCollision>
    </>
    );
};

export default Register;