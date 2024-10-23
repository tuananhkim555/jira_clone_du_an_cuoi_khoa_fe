const adminEmail = import.meta.env.VITE_REACT_APP_ADMIN_EMAIL;
const adminPassword = import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD;

let isAdmin = false;

export const setAdminStatus = (email: string, password: string) => {
  if (email === adminEmail && password === adminPassword) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }
};

export const getAdminStatus = () => {
  return isAdmin;
};

export const checkAdminCredentials = (email: string, password: string) => {
  return email === adminEmail && password === adminPassword;
};
