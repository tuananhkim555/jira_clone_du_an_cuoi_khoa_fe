import axios from 'axios';

interface RegisterModel {
    email: string;
    passWord: string;
    name: string;
    phoneNumber: string;
}

export const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
    const regex = /^\d+$/;
    return regex.test(phoneNumber);
};

export const registerUser = async (model: RegisterModel) => {
    try {
        const response = await axios.post(
            'https://jiranew.cybersoft.edu.vn/api/Users/signup',
            model,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBETiAxMSIsIkhldEhhblN0cmluZyI6IjE3LzAyLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTczOTc1MDQwMDAwMCIsIm5iZiI6MTcwOTc0NDQwMCwiZXhwIjoxNzM5ODk4MDAwfQ.qvs2zsWDKR2CRt273FQIadSYJzZM-hCro_nsLVpa-Wg',
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data };
    }
};
