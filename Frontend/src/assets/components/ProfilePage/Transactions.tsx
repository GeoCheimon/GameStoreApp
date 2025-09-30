import { useState, useEffect } from 'react';

interface Transaction {
    gameName: string;
    purchasePrice: number;
    transactionDate: string; // Θα έρθει ως string, θα το μορφοποιήσουμε
}

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("Please log in to view your transactions.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/transactions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch transaction history.');
                
                const data = await response.json();
                setTransactions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Συνάρτηση για μορφοποίηση της ημερομηνίας
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) return <p className="text-light">Loading transaction history...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="text-light mb-4">Transactions</h2>
            {transactions.length === 0 ? (
                <p className="text-secondary">You have no transactions yet.</p>
            ) : (
                // --- ΑΛΛΑΓΗ: Χρησιμοποιούμε τις σωστές κλάσεις για το Grid ---
                <div className="transactions-list">
                    <div className="transaction-list-header">
                        <span>Date</span>
                        <span>Description</span>
                        <span>Price</span>
                    </div>
                    {transactions.map((tx, index) => (
                        <div key={index} className="transaction-list-item">
                           <span>{formatDate(tx.transactionDate)}</span>
                           <span>{tx.gameName}</span>
                           <span className="fw-bold">€{tx.purchasePrice.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Transactions;