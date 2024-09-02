import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useAuth} from "../context/AuthContext";

function Home() {
    const [user, setUser] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:8080/api/v1/user', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
        };

        fetchUserData();

    }, [isAuthenticated]);

    return (
        <div>
            <h1 style={{ color: 'white' }}>Home Page</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.firstName} {user.lastName}!</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>You are not logged in. Please log in or register.</p>
            )}
        </div>
    );
}

export default Home;
