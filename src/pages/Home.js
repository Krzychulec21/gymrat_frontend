import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {Box, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import CustomButton from "../components/button/CustomButton";
import images from '../assets/mainPage';
import FeatureSection from "../components/FeatureSection";
import {motion} from 'framer-motion';


function Home() {
    const [user, setUser] = useState(null);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();


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

        if (isAuthenticated) {
            fetchUserData();
        }

    }, [isAuthenticated]);

    const handleJoinClick = () => {
        navigate('/auth');
    };

    return (
        <>
            <Box id="home" sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundImage: `
                    radial-gradient(circle at top, 
                    rgba(0, 0, 0, 0) 20%, 
                    rgba(0, 0, 0, 0.5) 63%, 
                    #C50000 100%), 
                    url(${images.gym})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',

            }}>
                <Container id="home">
                    <Box >
                        <motion.div
                            initial={{ y: -200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 2 }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: {
                                        xs: '1.5rem',
                                        sm: '2rem',
                                        md: '3rem',
                                        lg: '4.5rem',
                                    },
                                    mb: 3,
                                }}
                            >
                                {user ? `Hello, ${user.firstName}!` : 'Train, compete, inspire — push your limits!'}
                            </Typography>

                        {!user && (
                            <CustomButton onClick={handleJoinClick}>
                                JOIN NOW
                            </CustomButton>
                        )}
                        </motion.div>
                    </Box>
                </Container>
            </Box>


            <Box id="plans">
                <FeatureSection
                id="plans"
                title="Plans"
                description="Discover tailor-made workout plans designed to fit your individual fitness goals.
                Whether you aim to build muscle, lose weight, or improve endurance, our comprehensive plans will guide you every step of the way."
                image={images.plans}
                reverse={false}
            />
            </Box>

            <Box id="community">
                <FeatureSection
                    id="community"
                    title="Community"
                    description="Connect with like-minded fitness enthusiasts, share your progress, get advice, and find motivation from our supportive community. Engage in discussions, join groups, and stay inspired on your fitness journey."
                    image={images.social}
                    reverse={true}
                />
            </Box>

            <Box id="stats">
                <FeatureSection
                    id="stats"
                    title="Stats"
                    description="Monitor your workout progress with detailed statistics and visual graphs. Analyze your performance, track your gains, and stay motivated by seeing how far you've come."
                    image={images.stats}
                    reverse={false}
                />
            </Box>

            <Box id="challenges">
                <FeatureSection
                id="challenges"
                title="Challenges"
                description="Push your limits and join exciting fitness challenges. Compete with others, earn badges, and rise up the leaderboard. Whether you are a beginner or a seasoned athlete, there's a challenge for everyone."
                image={images.challenges}
                reverse={true}
            />
            </Box>

        </>

    );
}

export default Home;
