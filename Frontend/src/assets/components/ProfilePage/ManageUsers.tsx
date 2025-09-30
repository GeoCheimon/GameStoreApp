import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

// Interface που αντιστοιχεί στο UserManagementDTO του backend
interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('jwtToken');
            try {
                const response = await fetch('http://localhost:8080/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch users.');
                const data = await response.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: number) => {

        // --- ΑΛΛΑΓΗ: Προσθέτουμε τον έλεγχο για τον ρόλο του Admin ---

        // 1. Βρίσκουμε τον χρήστη που πρόκειται να διαγραφεί από τη λίστα μας.
        const userToDelete = users.find(user => user.id === userId);

        // 2. Ελέγχουμε αν ο χρήστης υπάρχει και αν ο ρόλος του είναι 'ROLE_ADMIN'.
        if (userToDelete && userToDelete.role === 'ROLE_ADMIN') {
            alert("You cannot delete an admin account.");
            return; // Σταματάμε την εκτέλεση της συνάρτησης.
        }
        
        // 3. Αν ο χρήστης δεν είναι admin, συνεχίζουμε με τη διαγραφή.
        // Απλή επιβεβαίωση πριν την οριστική διαγραφή
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }
        
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to delete user.');
            
            // Ενημερώνουμε το UI άμεσα, αφαιρώντας τον χρήστη από τη λίστα
            setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
            alert("User deleted successfully.");

        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-light">Loading users...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="text-light mb-4">Manage Users</h2>
            <div className="admin-list-container">
                {/* Header Λίστας */}
                <div className="admin-list-header">
                    <span>ID</span>
                    <span>Username</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Actions</span>
                </div>
                {/* Items Λίστας */}
                {users.map(user => (
                    <div key={user.id} className="admin-list-item">
                        <div>{user.id}</div>
                        <div>{user.username}</div>
                        <div>{user.email}</div>
                        <div>
                            <span className={`badge ${user.role === 'ROLE_ADMIN' ? 'bg-success' : 'bg-secondary'}`}>
                                {user.role.replace('ROLE_', '')}
                            </span>
                        </div>
                        <div>
                            <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => handleDeleteUser(user.id)}
                                title="Delete User"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageUsers;