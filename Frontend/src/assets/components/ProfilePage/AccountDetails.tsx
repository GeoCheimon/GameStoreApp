import { useState, useEffect } from 'react';
//import { useAuth } from '../context/AuthContext'; // Θα το χρειαστούμε για το token

// Ορίζουμε το "σχήμα" των δεδομένων του χρήστη που περιμένουμε από το API
interface UserProfile {
    id: number;
    username: string;
    email: string;
}

const AccountDetails = () => {
    // State για να αποθηκεύσουμε τα δεδομένα του προφίλ
    const [profile, setProfile] = useState<UserProfile | null>(null);
    // State για τη διαχείριση του loading
    const [loading, setLoading] = useState<boolean>(true);
    // State για τα σφάλματα
    const [error, setError] = useState<string | null>(null);

    // states για την αλλαγή κωδικού
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Το useEffect θα τρέξει μία φορά όταν το component φορτώσει
    useEffect(() => {
        // Παίρνουμε το token από το localStorage
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            setError("You must be logged in to view this page.");
            setLoading(false);
            return;
        }

        // Κάνουμε την κλήση στο νέο μας endpoint
        fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
                // Αυτό είναι το πιο κρίσιμο σημείο!
                // Στέλνουμε το token στο backend για να αποδείξουμε ποιοι είμαστε.
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user profile.');
            }
            return response.json();
        })
        .then((data: UserProfile) => {
            setProfile(data); // Αποθηκεύουμε τα δεδομένα στο state
            setError(null);
        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setLoading(false); // Σταματάμε το loading σε κάθε περίπτωση
        });

    }, []); // Το κενό dependency array σημαίνει ότι θα τρέξει μόνο μία φορά

    // συνάρτηση για την υποβολή αλλαγής κωδικού
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('http://localhost:8080/api/users/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Failed to change password.');
            }

            setPasswordMessage({ type: 'success', text: responseText });
            // Καθαρίζουμε τα πεδία μετά την επιτυχία
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (err: any) {
            setPasswordMessage({ type: 'error', text: err.message });
        }
    };


    // --- Εμφάνιση περιεχομένου ανάλογα με την κατάσταση ---
    if (loading) {
        return <p className="text-light">Loading profile...</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!profile) {
        return <p className="text-light">No profile data found.</p>;
    }

    return (
        <div className="account-details-container">
            <h2 className="text-light mb-4">Account Settings</h2>
            <div className="account-info-card">
                <div className="info-group">
                    <label>Username</label>
                    <p>{profile.username}</p>
                </div>
                <div className="info-group">
                    <label>Email Address</label>
                    <p>{profile.email}</p>
                </div>
            </div>
            {/* φορμα αλλαγής κωδικού */}
            <div className="account-info-card mt-4">
                <h4 className="text-light mb-3">Change Password</h4>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                    </div>

                    {passwordMessage && (
                        <div className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    <button type="submit" className="btn btn-success w-100 mt-2">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default AccountDetails;