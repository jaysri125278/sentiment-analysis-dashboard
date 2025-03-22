import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/styles.css';  

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async() => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                username, password
            });
            localStorage.setItem('token', response.data.access_token);
            navigate('/');
        }
        catch(err) {
            setError('Invalid Username or password');
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>

            <p>Don't have an account? <a href='/Register'>Register</a></p>
        </div>
    );
}

export default Login;
