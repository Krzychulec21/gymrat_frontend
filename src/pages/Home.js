import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import {Box, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import CustomButton from "../components/button/CustomButton";
import images from '../assets/mainPage';
import FeatureSection from "../components/FeatureSection";
import {motion} from 'framer-motion';
import {useTranslation} from 'react-i18next';


function Home() {
    const [user, setUser] = useState(null);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const {t} = useTranslation('home');


    const sectionIds = ['plans', 'community', 'stats', 'challenges'];

    const homeContent = sectionIds.map((id, index) => ({
        id,
        title : t(`sections.${id}.title`),
        content : t(`sections.${id}.content`),
        image : images[id],
        reverse: index % 2 === 1

    }));

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
                console.error("Błąd podczas pobierania danych użytkownika:", error);
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
                    <Box>
                        <motion.div
                            initial={{y: -200, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 2}}
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
                                {user ? `Witaj, ${user.firstName}!` : t('welcomeMessage')}
                            </Typography>

                            {!user && (
                                <CustomButton onClick={handleJoinClick}>
                                    {t('joinButtonUpper')}
                                </CustomButton>
                            )}
                        </motion.div>
                    </Box>
                </Container>
            </Box>

            {!isAuthenticated && (
                <>
                    {homeContent.map((item) => (
                        <Box id={item.id} key={item.id}>
                            <FeatureSection
                                title={item.title}
                                description={item.content}
                                image={item.image}
                                reverse={item.reverse}
                            />
                        </Box>
                    ))}
                </>
            )}
        </>
    );
}

export default Home;
