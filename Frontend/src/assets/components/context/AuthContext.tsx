import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Η νέα βιβλιοθήκη

// --- ΝΕΟ: Ορίζουμε το ακριβές "σχήμα" των δεδομένων που περιμένει το αποκωδικοποιημένο token ---
// Αυτό λέει στο TypeScript ότι εκτός από το 'sub' (email), περιμένουμε να βρούμε και ένα 'username'.
interface DecodedToken {
    sub: string;      // Το email του χρήστη (το standard "subject" του JWT)
    username: string; // Το username που προσθέσαμε εμείς στο backend
    iat: number;      // Issued At timestamp
    exp: number;      // Expiration timestamp
}

// Ορίζουμε το σχήμα του αντικειμένου 'user' που θα αποθηκεύουμε στο state.
interface User {
    username: string;
}

// 1. Ορίζουμε το "σχήμα" των δεδομένων που θα αποθηκεύει το Context
interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

// 2. Δημιουργούμε το Context με μια προεπιλεγμένη τιμή
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Δημιουργούμε τον "Πάροχο" (Provider). Αυτό το component θα "αγκαλιάσει" όλη την εφαρμογή.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Αυτό το useEffect τρέχει μία φορά όταν φορτώνει η εφαρμογή για να ελέγξει αν ο χρήστης είναι ήδη συνδεδεμένος.
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                // --- ΑΛΛΑΓΗ: Αποκωδικοποιούμε το token χρησιμοποιώντας το νέο, πιο ακριβές interface. ---
                const decodedToken: DecodedToken = jwtDecode(token);
                // Παίρνουμε το 'username' από το token και το αποθηκεύουμε στο state.
                setUser({ username: decodedToken.username });
            } catch (error) {
                console.error("Invalid token found in localStorage", error);
                localStorage.removeItem('jwtToken');
            }
        }
    }, []);

    // Συνάρτηση για να κάνει login
    const login = (token: string) => {
        localStorage.setItem('jwtToken', token);
        // --- ΑΛΛΑΓΗ: Και εδώ, διαβάζουμε το 'username' από το token που μόλις λάβαμε. ---
        const decodedToken: DecodedToken = jwtDecode(token);
        setUser({ username: decodedToken.username });
    };

    // Η συνάρτηση που καλείται από το Header για την αποσύνδεση.
    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Δημιουργούμε ένα custom hook για να χρησιμοποιούμε εύκολα το Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};