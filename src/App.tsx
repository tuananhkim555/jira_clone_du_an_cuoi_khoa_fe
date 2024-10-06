import React from 'react';
import { BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
            </Switch>
        </Router>
    );
};

export default App;
