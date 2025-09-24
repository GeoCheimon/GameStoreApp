import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css'; // Το νέο, κοινό CSS

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8080/api/authentication/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Registration failed');
            }
            
            setSuccess('Registration successful! Redirecting to login...');
            
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2 className="auth-title">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control auth-input"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control auth-input"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control auth-input"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control auth-input"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <button type="submit" className="btn auth-button w-100">SIGN UP</button>
                    
                    <p className="auth-switch-text">
                        Already have an account? <Link to="/signin">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;