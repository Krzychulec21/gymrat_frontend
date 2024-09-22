import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import FriendsList from '../components/friends/FriendsList';
import PendingRequestsList from '../components/friends/PendingRequestsList';
import SendFriendRequestForm from '../components/friends/SendFriendRequestForm';
import ChatRoom from '../components/chat/ChatRoom'; // Komponent czatu
import {
    getFriends,
    getPendingRequests,
    removeFriend,
    respondToFriendRequest,
    sendFriendRequest
} from '../service/friendService';
import CustomButton from '../components/button/CustomButton';
import {getChatRoomId} from "../service/chatService";

const FriendsPage = () => {
    const [selectedTab, setSelectedTab] = useState('friends');  // Zakładki
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState(null);  // Wybrany znajomy do czatu
    const [chatRoomId, setChatRoomId] = useState(null);  // ID pokoju czatu
    // const [currentUserId, setCurrentUserId] = useState(null);  // Aktualny zalogowany użytkownik
    //
    //
    // // Pobranie ID aktualnego użytkownika po załadowaniu komponentu
    // useEffect(() => {
    //     const fetchCurrentUserId = async () => {
    //         const userId = await getCurrentUserId();
    //         setCurrentUserId(userId);
    //     };
    //
    //     fetchCurrentUserId();
    // }, []);

    const currentUserId = localStorage.getItem("id");

    useEffect(() => {
        loadFriends();
        loadPendingRequests();
    }, [selectedTab]);

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
        loadPendingRequests();
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

    const startChatWithFriend = async (friendId) => {
        console.log("obecnie id kolejno user i zanjomy: "+  currentUserId +"  "+ friendId);

        const roomId = await getChatRoomId(currentUserId, friendId);
        console.log("id pokoju: "+ roomId);
        setSelectedFriendId(friendId);
        setChatRoomId(roomId);
        setSelectedTab('chat');
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'friends':
                return <FriendsList friends={friends} onRemoveFriend={handleRemoveFriend} onChatStart={startChatWithFriend} />;
            case 'pending':
                return <PendingRequestsList requests={pendingRequests} onAccept={handleAcceptRequest} onReject={handleRejectRequest} />;
            case 'add':
                return <SendFriendRequestForm onSendRequest={handleSendRequest} />;
            case 'chat':
                return <ChatRoom currentUserId={currentUserId} friendId={selectedFriendId} chatRoomId={chatRoomId} />;  // Przekazuje ID użytkowników i chatRoomId
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '60%', height: '80vh', border: '2px solid red', display: 'flex', margin: 'auto', backgroundColor: 'transparent' }}>

            <Box sx={{ width: '20%', borderRight: '2px solid red', padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom>Znajomi</Typography>

                <CustomButton
                    onClick={() => setSelectedTab('friends')}
                    variant="contained"
                    sx={{
                        width: '100%',
                        backgroundColor: selectedTab === 'friends' ? 'darkgray' : 'gray',
                        '&:hover': { backgroundColor: 'darkgray' }
                    }}>
                    Znajomi {friends.length}
                </CustomButton>

                <CustomButton
                    onClick={() => setSelectedTab('pending')}
                    variant="contained"
                    sx={{
                        width: '100%',
                        backgroundColor: selectedTab === 'pending' ? 'darkgray' : 'gray',
                        '&:hover': { backgroundColor: 'darkgray' }
                    }}>
                    Oczekujące {pendingRequests.length}
                </CustomButton>

                <CustomButton
                    onClick={() => setSelectedTab('add')}
                    variant="contained"
                    sx={{ width: '100%', '&:hover': { backgroundColor: 'darkgray' } }}>
                    Dodaj znajomego
                </CustomButton>
            </Box>


            <Box sx={{ width: '80%', padding: 3 }}>
                {renderContent()}
            </Box>
        </Box>
    );
};

export default FriendsPage;
