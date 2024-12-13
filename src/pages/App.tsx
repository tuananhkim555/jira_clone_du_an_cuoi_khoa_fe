import React, { useEffect } from 'react';
import RootRoute from '../routes/rootRoute';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/store';
import { RootState } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../redux/store';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const user = localStorage.getItem('user');
            
            if (!token || !user) {
                dispatch(clearUser());
                return;
            }

            try {
                const userData = JSON.parse(user);
                if (userData.tokenExpiration && Date.now() > userData.tokenExpiration) {
                    dispatch(clearUser());
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                dispatch(clearUser());
            }
        };

        checkAuth();
        
        // Check token expiration every minute
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <PersistGate loading={null} persistor={persistor}>
            <div>
                <RootRoute />
            </div>
        </PersistGate>
    );
};

export default App;
