import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Interface για τα δεδομένα ενός παιχνιδιού
interface Game {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
}

const ManageGames = () => {
    // State Management
    const [games, setGames] = useState<Game[]>([]); // Η λίστα όλων των παιχνιδιών
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State για τη φόρμα επεξεργασίας ενός υπάρχοντος παιχνιδιού
    const [editingGameId, setEditingGameId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Game>>({});

    // State για τη φόρμα προσθήκης νέου παιχνιδιού
    const [isAdding, setIsAdding] = useState(false);
    const [newGameData, setNewGameData] = useState<Partial<Game>>({
        name: '',
        category: '',
        price: 0,
        imageUrl: '',
        originalPrice: undefined
    });

    // Data Fetching
    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/games');
            if (!response.ok) throw new Error('Failed to fetch games.');
            const data = await response.json();
            setGames(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    // Handlers για τις Ενέργειες του Admin

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
        setter((prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    // Ενεργοποίηση της επεξεργασίας για μια γραμμή
    const handleStartEdit = (game: Game) => {
        setEditingGameId(game.id);
        setEditFormData(game);
    };

    // Ακύρωση της επεξεργασίας
    const handleCancelEdit = () => {
        setEditingGameId(null);
        setEditFormData({});
    };

    // Υποβολή αλλαγών (Update)
    const handleUpdateGame = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/games/${editingGameId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editFormData),
            });
            if (!response.ok) throw new Error('Failed to update game.');
            
            await fetchGames(); // Ανανέωση της λίστας
            handleCancelEdit(); // Έξοδος από τη λειτουργία επεξεργασίας
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Διαγραφή παιχνιδιού
    const handleDeleteGame = async (gameId: number) => {
        if (!window.confirm("Are you sure you want to permanently delete this game?")) return;
        
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/games/${gameId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to delete game.');
            
            setGames(currentGames => currentGames.filter(game => game.id !== gameId));
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Συνάρτηση που ανοίγει/κλείνει και καθαρίζει τη φόρμα
    const handleToggleAddForm = () => {
        setIsAdding(!isAdding); // Αλλάζει την ορατότητα της φόρμας
        if (isAdding) {
            // Αν η φόρμα πρόκειται να κλείσει, την καθαρίζουμε
            setNewGameData({ name: '', category: '', price: 0, imageUrl: '', originalPrice: undefined });
        }
    };

    // Προσθήκη νέου παιχνιδιού
    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('http://localhost:8080/api/admin/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newGameData),
            });
            if (!response.ok) throw new Error('Failed to add new game.');
            
            await fetchGames(); // Ανανέωση της λίστας
            handleToggleAddForm(); // Κλείνει και καθαρίζει τη φόρμα μετά την επιτυχία
        } catch (err: any) {
            alert(err.message);
        }
    };


    if (loading) return <p className="text-light">Loading games...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-light">Manage Games</h2>
                <button className="btn btn-success" onClick={handleToggleAddForm}>
                    <FaPlus className="me-2"/>{isAdding ? 'Close Form' : 'Add Game'}
                </button>
            </div>

            {/* Φόρμα Προσθήκης Νέου Παιχνιδιού */}
            {isAdding && (
                <div className="add-game-form-container mt-5">
                    <h3 className="text-light">Add New Game</h3>
                    <form onSubmit={handleAddGame}>
                        <div className="row g-3 mb-5">
                            <div className="col-md-6"><input type="text" name="name" placeholder="Game Name" value={newGameData.name} onChange={(e) => handleInputChange(e, setNewGameData)} className="form-control" required /></div>
                            <div className="col-md-6"><input type="text" name="category" placeholder="Category" value={newGameData.category} onChange={(e) => handleInputChange(e, setNewGameData)} className="form-control" required /></div>
                            <div className="col-12"><input type="text" name="imageUrl" placeholder="Image URL" value={newGameData.imageUrl} onChange={(e) => handleInputChange(e, setNewGameData)} className="form-control" required /></div>
                            <div className="col-md-6"><input type="number" step="0.01" name="price" placeholder="Price" value={newGameData.price} onChange={(e) => handleInputChange(e, setNewGameData)} className="form-control" required /></div>
                            <div className="col-md-6"><input type="number" step="0.01" name="originalPrice" placeholder="Original Price (for discounts)" value={newGameData.originalPrice || ''} onChange={(e) => handleInputChange(e, setNewGameData)} className="form-control" /></div>
                            <div className="col-12"><button type="submit" className="btn btn-primary w-100">Submit New Game</button></div>
                        </div>
                    </form>
                </div>
            )}

            {/* Λίστα Παιχνιδιών */}
            <div className="admin-games-list-container">
                {/* Header */}
                <div className="admin-games-list-header">
                    <span>Image</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Original Price</span>
                    <span>Actions</span>
                </div>
                {/* Items */}
                {games.map(game => (
                    editingGameId === game.id ? (
                        // --- Γραμμή σε Edit Mode ---
                        <form key={game.id} className="admin-games-list-item edit-mode-row" onSubmit={handleUpdateGame}>
                            <div><input type="text" name="imageUrl" value={editFormData.imageUrl || ''} onChange={(e) => handleInputChange(e, setEditFormData)} className="form-control form-control-sm" /></div>
                            <div><input type="text" name="name" value={editFormData.name || ''} onChange={(e) => handleInputChange(e, setEditFormData)} className="form-control form-control-sm" /></div>
                            <div><input type="text" name="category" value={editFormData.category || ''} onChange={(e) => handleInputChange(e, setEditFormData)} className="form-control form-control-sm" /></div>
                            <div><input type="number" step="0.01" name="price" value={editFormData.price || 0} onChange={(e) => handleInputChange(e, setEditFormData)} className="form-control form-control-sm" /></div>
                            <div><input type="number" step="0.01" name="originalPrice" value={editFormData.originalPrice || ''} onChange={(e) => handleInputChange(e, setEditFormData)} className="form-control form-control-sm" placeholder="e.g., 29.99" /></div>
                            <div>
                                <button type="submit" className="btn btn-sm btn-primary me-2">Submit</button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        // --- Κανονική Γραμμή ---
                        <div key={game.id} className="admin-games-list-item">
                            <div><img src={game.imageUrl} alt={game.name} style={{width: '60px', borderRadius: '4px'}}/></div>
                            <div>{game.name}</div>
                            <div>{game.category}</div>
                            <div>{game.price.toFixed(2)} €</div>
                            <div>{game.originalPrice ? `${game.originalPrice.toFixed(2)} €` : '-'}</div>
                            <div>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleStartEdit(game)} title="Update Game"><FaEdit /></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteGame(game.id)} title="Delete Game"><FaTrash /></button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default ManageGames;