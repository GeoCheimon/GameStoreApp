import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../config/api';

interface CartItem {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("Please log in to view your cart.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(apiUrl('/api/cart'), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch cart.');
                const data: CartItem[] = await response.json();
                
                setCartItems(data);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Συνάρτηση για διαγραφή από το Cart
    const handleRemoveFromCart = async (gameId: number) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch(apiUrl(`/api/cart/${gameId}`), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart.');
            }
            
            // Ενημερώνουμε το UI άμεσα, χωρίς refresh
            setCartItems(currentItems =>
                currentItems.filter(item => item.id !== gameId)
            );

        } catch (error: any) {
            console.error("Error removing from cart:", error);
            alert(error.message);
        }
    };

    const handlePurchase = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch(apiUrl('/api/cart/checkout'), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Purchase failed.');
            }

            alert("Your transaction was completed!");

            setCartItems([]);
            
            navigate('/profile/games');

        } catch (err: any) {
            setError(err.message);
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (loading) return <p className="text-light">Loading cart...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="text-light mb-4">My Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-secondary">Your cart is empty.</p>
            ) : (
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <ul className="list-group mb-4">
                            {cartItems.map(item => (
                                <li key={item.id} className="list-group-item bg-dark text-light mb-2 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '45px', objectFit: 'cover', marginRight: '1rem', borderRadius: '4px' }} />
                                        <span>{item.name}</span>
                                    </div>
                                    {/* --- ΑΛΛΑΓΗ: Προσθέτουμε το κουμπί "X" --- */}
                                    <div className="d-flex align-items-center gap-3">
                                        <span>{item.price.toFixed(2)} €</span>
                                        <button 
                                            className="cart-item-remove-btn" 
                                            onClick={() => handleRemoveFromCart(item.id)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="p-3 bg-dark rounded">
                            <h5 className="text-light">Summary</h5>
                            <hr className="text-secondary"/>
                            <div className="d-flex justify-content-between text-light">
                                <span>Subtotal</span>
                                <span>€{totalPrice.toFixed(2)}</span>
                            </div>
                            <hr className="text-secondary"/>
                            <div className="d-flex justify-content-between text-light h4">
                                <span>Total</span>
                                <span>€{totalPrice.toFixed(2)}</span>
                            </div>
                            <button 
                                className="btn btn-success btn-lg w-100 mt-4"
                                onClick={handlePurchase}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
