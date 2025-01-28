import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import Sidebar from '../components/friends/Sidebar';
import FriendsList from '../components/friends/FriendsList';
import PendingRequestsList from '../components/friends/PendingRequestsList';
import SendFriendRequestForm from '../components/friends/SendFriendRequestForm';
import ChatRoom from '../components/chat/ChatRoom';
import {
    getFriends,
    getPendingRequests,
    removeFriend,
    respondToFriendRequest,
    sendFriendRequest,
} from '../service/friendService';
import {getChatRoomId} from '../service/chatService';
import {useMediaQuery, useTheme} from "@mui/system";
import Button from "@mui/material/Button";

const FriendsPage = () => {
    const [selectedTab, setSelectedTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const [selectedFriendName, setSelectedFriendName] = useState('');
    const [chatRoomId, setChatRoomId] = useState(null);
    const currentUserId = localStorage.getItem('id');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('latestMessage');
    const [sortDir, setSortDir] = useState('desc');
    const [totalFriends, setTotalFriends] = useState(0);
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(50);


    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    useEffect(() => {
        loadFriends();
        loadPendingRequests();
    }, [currentPage, sortBy, sortDir, minAge, maxAge]);

    const loadFriends = async () => {
        const friendsData = await getFriends(currentPage, pageSize, sortBy, sortDir, minAge, maxAge);
        setFriends(friendsData.content);
        setTotalPages(friendsData.totalPages);
        setTotalFriends(friendsData.totalElements)
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

    const startChatWithFriend = async (friendId, firstName, lastName) => {
        const roomId = await getChatRoomId(currentUserId, friendId);
        setSelectedFriendId(friendId);
        setChatRoomId(roomId);
        setSelectedFriendName(firstName + ' ' + lastName);
        setSelectedTab('chat');
    };

    const handleAgeChange = (event, newValue) => {
        setMinAge(newValue[0]);
        setMaxAge(newValue[1]);
    };


    const renderContent = () => {
        switch (selectedTab) {
            case 'friends':
                return (
                    <FriendsList
                        friends={friends}
                        onRemoveFriend={handleRemoveFriend}
                        onChatStart={startChatWithFriend}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setSortBy={setSortBy}
                        setSortDir={setSortDir}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        minAge={minAge}
                        maxAge={maxAge}
                        onAgeChange={handleAgeChange}
                    />
                );
            case 'pending':
                return (
                    <PendingRequestsList
                        requests={pendingRequests}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                    />
                );
            case 'add':
                return <SendFriendRequestForm onSendRequest={handleSendRequest}/>;
            case 'chat':
                return (
                    <ChatRoom
                        currentUserId={currentUserId}
                        friendId={selectedFriendId}
                        chatRoomId={chatRoomId}
                        friendName={selectedFriendName}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                width: '90%',
                margin: 'auto',
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                justifyContent: 'center',
                my: 'auto',
                borderRadius: '8px',
                backgroundColor: '#2C2C2C',
                mb: 3
            }}
        >
            {!isMdUp && (
                <Button size="small" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
                </Button>
            )}

            {(isSidebarOpen || isMdUp) && (
                <Sidebar
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    friendsCount={totalFriends}
                    pendingCount={pendingRequests.length}
                />
            )}

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );

};

export default FriendsPage;
