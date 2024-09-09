import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import FriendsList from '../components/friends/FriendsList';
import PendingRequestsList from '../components/friends/PendingRequestsList';
import SendFriendRequestForm from '../components/friends/SendFriendRequestForm';
import { getFriends, getPendingRequests, sendFriendRequest, respondToFriendRequest, removeFriend } from '../service/friendService';
import CustomButton from '../components/button/CustomButton';

const FriendsPage = () => {
    const [selectedTab, setSelectedTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const renderContent = () => {
        switch (selectedTab) {
            case 'friends':
                return <FriendsList friends={friends} onRemoveFriend={handleRemoveFriend} />;
            case 'pending':
                return <PendingRequestsList requests={pendingRequests} onAccept={handleAcceptRequest} onReject={handleRejectRequest} />;
            case 'add':
                return <SendFriendRequestForm onSendRequest={handleSendRequest} />;
            default:
                return null;
        }
    };

    const loadFriends = async () => {
        const friends = await getFriends();
        setFriends(friends);
    };

    const loadPendingRequests = async () => {
        const requests = await getPendingRequests();
        setPendingRequests(requests);
    };

    const handleSendRequest = async (email) => {
        await sendFriendRequest(email);
        loadPendingRequests();  // Odświeżenie listy oczekujących zaproszeń
    };

    const handleAcceptRequest = async (requestId) => {
        await respondToFriendRequest(requestId, true);
        loadFriends();
        loadPendingRequests();
    };

    const handleRejectRequest = async (requestId) => {
        await respondToFriendRequest(requestId, false);
        loadPendingRequests();
    };

    const handleRemoveFriend = async (friendId) => {
        await removeFriend(friendId);
        loadFriends();
    };

    return (
        <Box sx={{
            width: '60%',
            height: '80vh',
            border: '2px solid red',
            display: 'flex',
            margin: 'auto',
            backgroundColor: 'transparent'
        }}>
            {/* Lewa kolumna z zakładkami */}
            <Box sx={{
                width: '20%',
                borderRight: '2px solid red',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography variant="h6" gutterBottom>Znajomi</Typography>

                <CustomButton
                    onClick={() => setSelectedTab('friends')}
                    variant="contained"
                    sx={{
                        width: '100%',
                        backgroundColor: selectedTab === 'friends' ? 'darkgray' : 'gray',
                        '&:hover': { backgroundColor: 'darkgray' }
                    }}>
                    Znajomi
                </CustomButton>

                <CustomButton
                    onClick={() => setSelectedTab('pending')}
                    variant="contained"
                    sx={{
                        width: '100%',
                        backgroundColor: selectedTab === 'pending' ? 'darkgray' : 'gray',
                        '&:hover': { backgroundColor: 'darkgray' }
                    }}>
                    Oczekujące
                </CustomButton>

                <CustomButton
                    onClick={() => setSelectedTab('add')}
                    variant="contained"
                    sx={{
                        width: '100%',

                        '&:hover': { backgroundColor: 'darkgray' }
                    }}>
                    Dodaj znajomego
                </CustomButton>
            </Box>

            {/* Prawa kolumna z zawartością */}
            <Box sx={{
                width: '80%',
                padding: 3
            }}>
                {renderContent()}
            </Box>
        </Box>
    );
};

export default FriendsPage;
