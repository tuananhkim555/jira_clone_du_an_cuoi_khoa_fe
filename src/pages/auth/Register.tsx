import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaLock, FaEye, FaEyeSlash, FaUser, FaPhoneAlt} from 'react-icons/fa'; 
import logoLogin from "../../assets/Logo Jira 5.png";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./auth.module.css";
import ShinyEffect from '../../components/ShinyEffect';
import { BackgroundBeamsWithCollision } from '../../components/ui/Background-beams-with-collision';
import Reveal from '../../components/Reveal';
import axios from 'axios';
import { Alert } from 'antd';
import TextAnimation from '../../components/ui/TextAnimation';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [fullName, setFullName] = useState<string>('');
    const [fullNameError, setFullNameError] = useState<string>('');
    const [fullNameValid, setFullNameValid] = useState<boolean | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');
    const [phoneNumberValid, setPhoneNumberValid] = useState<boolean | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
            setEmailError('Email is required');
        } else if (!isValid) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    };

    const handleEmailBlur = () => {
        if (!email) {
            setEmailError('Email is required');
        } else if (!validateEmail(email)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        if (value === '') {
            setIsPasswordValid(false);
            setPasswordError('Password is required');
        } else {
            setIsPasswordValid(true);
            setPasswordError('');
        }
    };

    const handlePasswordBlur = () => {
        if (password === '') {
            setIsPasswordValid(false);
            setPasswordError('Password is required');
        }
    };

    const handleEmailFocus = () => {
        setIsEmailValid(null);
    };

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFullName(value);

        if (value === '') {
            setFullNameValid(false);
            setFullNameError('Full name is required');
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
            setPhoneNumberError('Phone number is required');
        } else if (!isValid) {
            setPhoneNumberValid(false);
            setPhoneNumberError('Phone number must be numeric');
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
        e.preventDefault();

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
            setAlert({ message: 'Registration successful!', type: 'success' });

            setTimeout(() => {
                navigate('/login');
            }, 800);
        } catch (error: any) {
            console.error('Signup error:', error.response?.data);
            setAlert({ message: 'Registration failed! Email already exists', type: 'error' });
        }
    };

    const onClose = () => {
        setAlert(null);
    };

    return (
        <div className={`${styles.bgAuth} relative overflow-hidden`}>
        <BackgroundBeamsWithCollision className="absolute inset-0 z-0">
        <div className="flex flex-col md:flex-row justify-center items-center h-screen mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <Reveal>
            <div className="mb-8 md:mb-0 md:mr-12">
                <div className="flex items-center justify-center flex-col lg:flex-row md:space-x-4">
                    <img src={logoLogin} alt="Logo" className="w-40 sm:w-40 md:w-52 lg:w-60 xl:w-80 h-auto object-contain mb-4 md:mb-0" />
                    <TextAnimation text="Software" className="text-gray-200 hidden md:block text-4xl md:text-5xl lg:text-6xl text-center font-semibold" />
                </div>   
            </div>
            </Reveal>
            <div className="flex flex-col w-full max-w-md p-6 bg-opacity-70 backdrop-blur-lg rounded-lg shadow-2xl z-50 bg-[gray]/5">
                <div className="flex flex-col">
                    <div className="flex justify-center">
                      <TextAnimation text="Register" className="text-2xl font-semibold text-gray-200 mb-6 text-center" />
                    </div>
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
                                    placeholder="Enter your email..."
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
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
                                    placeholder="Enter your password"
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
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-400">Full Name</label>
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
                                <input type="text" name="fullName" id="fullName" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm" placeholder="Enter your name" value={fullName} onChange={handleFullNameChange} onBlur={handleFullNameFocus} />
                            </div>
                            <div className="min-h-[20px] mt-1">
                                {fullNameError && <p className="text-orange-400 text-sm">{fullNameError}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">Phone Number</label>
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
                                <input type="tel" name="phoneNumber" id="phoneNumber" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/50 focus:border-orange-500/50 sm:text-sm" placeholder="Enter your phone number" value={phoneNumber} onChange={handlePhoneNumberChange} onBlur={handlePhoneNumberFocus} />
                            </div>
                            <div className="min-h-[20px] mt-1">
                                {phoneNumberError && <p className="text-orange-400 text-sm">{phoneNumberError}</p>}
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 duration-300 hover:scale-105">
                                Register
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 flex justify-center">
                        <Link to="/login" className="text-gray-400 text-sm">Already have an account? <span className='text-orange-400 hover:underline'>Click here to login</span> </Link>
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
                    className="animate-slide-in text-lg"
                />
            </div>
        )}
        </BackgroundBeamsWithCollision>
    </div>
    );
};

export default Register;