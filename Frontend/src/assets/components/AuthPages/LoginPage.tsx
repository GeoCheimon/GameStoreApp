import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css'; // Χρησιμοποιούμε το ίδιο, κοινό CSS με τη σελίδα εγγραφής
import { apiUrl } from '../../../config/api';

const LoginPage = () => {
    // State για τα πεδία της φόρμας
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State για τη διαχείριση μηνυμάτων σφάλματος
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth(); // Παιρνω τη συνάρτηση login από το context

    // Συνάρτηση που καλείται όταν υποβάλλεται η φόρμα
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch(apiUrl('/api/authentication/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Login failed');
            }

            // Αν η σύνδεση είναι επιτυχής, παίρνουμε τα δεδομένα (το DTO με το token)
            const data = await response.json();
            

            // Καλώ τη συνάρτηση login για να ενημερωθεί όλη η εφαρμογή ---
            login(data.jwtToken);

            // Κάνουμε redirect στην αρχική σελίδα
            navigate('/');

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2 className="auth-title">Sign In</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className="mb-4">
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

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn auth-button w-100">SIGN IN</button>
                    
                    <p className="auth-switch-text">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
