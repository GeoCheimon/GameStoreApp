import { useState, useEffect } from 'react';
import { apiUrl } from '../../../config/api';

// Χρησιμοποιούμε το ίδιο interface Game που έχουμε και στο GamesPage
interface Game {
    id: number;
    name: string;
    imageUrl: string;
}

const MyGames = () => {
    const [myGames, setMyGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyGames = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("Please log in to view your games.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(apiUrl('/api/library'), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch your games.');
                
                const data = await response.json();
                setMyGames(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyGames();
    }, []); // Το κενό array σημαίνει ότι θα τρέξει μόνο μία φορά

    if (loading) return <p className="text-light">Loading your library...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="text-light mb-4">My Games</h2>
            {myGames.length === 0 ? (
                <p className="text-secondary">You don't own any games yet.</p>
            ) : (
                // Χρησιμοποιούμε το ίδιο grid system με το GamesPage για ομοιομορφία
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {myGames.map(game => (
                        <div key={game.id} className="col">
                            <div className="game-card card h-100 border-0 text-light bg-dark">
                                <img src={game.imageUrl} className="card-img-top" alt={game.name} style={{aspectRatio: '16/9', objectFit: 'cover'}} />
                                <div className="card-body p-2">
                                    <div className="game-name">{game.name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyGames;
