import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/auth/user', {
                    withCredentials: true, // Zakładając, że token jest w ciasteczkach
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Przekazujemy token JWT w nagłówku
                    }
                });
                setUser(response.data); // Ustawiamy dane użytkownika po pomyślnym pobraniu
            } catch (error) {
                console.error('There was an error!', error); // Obsługa błędów
            }
        };

        fetchUserData(); // Wywołujemy funkcję pobierającą dane użytkownika
    }, []);

    return (
        <div>
            <h2>Home</h2>
            {user ? (
                <div>
                    <p>Name: {user.password}</p>
                    <p>Email: {user.email}</p>
                    <p>Inne: {user.family_name}</p>
                </div>
            ) : (
                <p>Loading...</p> // Wyświetlamy komunikat podczas ładowania danych
            )}
        </div>
    );
};

export default Home;
