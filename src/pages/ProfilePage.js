import ProfileInfo from "../components/ProfileInfo";
import {Box, CircularProgress} from "@mui/material";
import {useCallback, useContext, useEffect, useState} from "react";
import {getCurrentUser, getUser, getUserAvatar, getUserPersonalInfo} from "../service/userService";
import {AvatarContext} from "../context/AvatarContext";
import Post from "../components/Post";
import {addReaction, getUserPosts, removeReaction} from "../service/postService";
import {useParams} from "react-router-dom";


const ProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [personalInfo, setPersonalInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);


    const fetchData = useCallback(async () => {
        try {
            const [userData, personalInfoData, postsData, avatarData] = await Promise.all([
                getUser(userId),
                getUserPersonalInfo(userId),
                getUserPosts(userId),
                getUserAvatar(userId)
            ]);
            setUser(userData);
            setPersonalInfo(personalInfoData);
            setPosts(postsData);
            setAvatar(avatarData)
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);



    useEffect(() => {
        const fetchCurrentUser = async () => {
            const currentUserData = await getCurrentUser();
            setCurrentUser(currentUserData);
        };
        fetchCurrentUser();
    }, []);

    const handleReaction = async (postId, shouldAdd) => {
        try {
            if (shouldAdd) {
                await addReaction(postId);
            } else {
                await removeReaction(postId);
            }
            // Update the posts state
            const updatedPosts = posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        reactedByCurrentUser: shouldAdd,
                        reactionCount: shouldAdd ? post.reactionCount + 1 : post.reactionCount - 1,
                    };
                }
                return post;
            });
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Failed to update reaction', error);
        }
    };

    const handleDataUpdate = useCallback(() => {
        fetchData();
    }, [fetchData]);

    if (loading || !user || !personalInfo) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }
    return (
        <Box sx={{display: 'flex', flexDirection:'column'}}>
            <ProfileInfo
                user={user}
                currentUser={currentUser}
                personalInfo={personalInfo}
                avatar={avatar}
                onDataUpdate={handleDataUpdate}
            />

            {posts.slice().reverse().map((post) => (
                <Post key={post.id} post={post} onReaction={handleReaction} />
            ))}
        </Box>
    );
};

export default ProfilePage;