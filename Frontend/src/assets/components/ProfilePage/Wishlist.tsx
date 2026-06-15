import { useState, useEffect } from 'react';
import { apiUrl } from '../../../config/api';

// Ορίζουμε το interface για τα δεδομένα που περιμένουμε
interface WishlistItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    originalPrice?: number;
}

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("Please log in to view your wishlist.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(apiUrl('/api/wishlist'), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch wishlist.');
                }

                const data: WishlistItem[] = await response.json();
                setWishlistItems(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    // Συνάρτηση για τη διαγραφή από το Wishlist ---
    const handleRemove = async (gameId: number) => {
        const token = localStorage.getItem('jwtToken');
        // Δεν χρειάζεται έλεγχος για token εδώ, αφού η σελίδα δεν θα φόρτωνε καν αν δεν υπήρχε.

        try {
            const response = await fetch(apiUrl(`/api/wishlist/${gameId}`), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from wishlist.');
            }

            // Ενημερώνουμε το state για να αφαιρεθεί το item από την οθόνη ΑΜΕΣΩΣ,
            // χωρίς να χρειάζεται refresh της σελίδας.
            setWishlistItems(currentItems =>
                currentItems.filter(item => item.id !== gameId)
            );

        } catch (err: any) {
            // Εδώ θα μπορούσαμε να δείξουμε ένα μήνυμα σφάλματος
            console.error(err.message);
        }
    };

    const handleAddToCart = async (gameId: number) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            // Αλλάζουμε το URL για να καλέσουμε το νέο, ειδικό endpoint
            const response = await fetch(apiUrl(`/api/cart/from-wishlist/${gameId}`), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to move item to cart.");
            }
            
            // Ενημερώνουμε το UI, αφαιρώντας το παιχνίδι από τη λίστα του wishlist
            setWishlistItems(currentItems =>
                currentItems.filter(item => item.id !== gameId)
            );

        } catch (error: any) {
            console.error("Error moving item to cart:", error);
            alert(error.message);
        }
    };

    if (loading) return <p className="text-light">Loading wishlist...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="text-light mb-4">My Wishlist</h2>
            {wishlistItems.length === 0 ? (
                <p className="text-secondary">Your wishlist is empty.</p>
            ) : (
                <div className="wishlist-container">
                    {wishlistItems.map(item => (
                        // Χρησιμοποιούμε τη σωστή κλάση .wishlist-item
                        <div key={item.id} className="wishlist-item">
                            <div className="d-flex align-items-center">
                                <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '56px', objectFit: 'cover', marginRight: '1rem', borderRadius: '4px' }} />
                                <span>{item.name}</span>
                            </div>
                            <div className="wishlist-item-actions">
                                <span className="fw-bold">€{item.price.toFixed(2)}</span>
                                <button className="btn btn-success" onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
                                <button className="btn btn-danger" onClick={() => handleRemove(item.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
