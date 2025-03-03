import React, { useState } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { getWorkoutSessionById } from '../../service/workoutService';
import {useTranslation} from 'react-i18next';

const Post = ({ post, onReaction }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [workoutDetails, setWorkoutDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const {t} = useTranslation('profilePage');

    const handleDialogOpen = async () => {
        setOpenDialog(true);
        setLoadingDetails(true);
        try {
            const details = await getWorkoutSessionById(post.workoutSessionId);
            setWorkoutDetails(details);
        } catch (error) {
            console.error('Failed to load workout session details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleImageClick = () => {
        setOpenImageDialog(true);
    };

    const handleImageDialogClose = () => {
        setOpenImageDialog(false);
    };

    const handleReaction = () => {
        onReaction(post.id, !post.reactedByCurrentUser);
    };

    return (
        <Card
            sx={{
                margin: 'auto',
                marginBottom: 2,
                backgroundColor: '#1f1f1f',
                minWidth: { xs: '80%', lg: '50%' },
                maxWidth: { xs: '80%', lg: '55%' },
            }}
        >
            <CardHeader
                title={t('post.title')}
                subheader={new Date(post.timestamp).toLocaleDateString()}
            />
            <CardContent>
                <Typography variant="body1">{post.description}</Typography>
                <Typography
                    variant="body2"
                    sx={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        marginTop: 1,
                    }}
                    onClick={handleDialogOpen}
                >
                    {t('post.workoutDetails')}
                </Typography>
            </CardContent>
            {post.imageUrl && (
                <Box
                    sx={{
                        margin: '0 20%',
                        cursor: 'pointer',
                    }}
                    onClick={handleImageClick}
                >
                    <CardMedia
                        component="img"
                        image={post.imageUrl}
                        alt="Post Image"
                        sx={{ maxHeight: 400, borderRadius: 2 , objectFit:'cover', width:'100%'}}
                    />
                </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: 2 }}>
                <Tooltip title={t('post.postReaction')} placement="top">
                    <IconButton onClick={handleReaction}>
                        <FitnessCenterIcon
                            style={{
                                color: post.reactedByCurrentUser ? 'gold' : 'white',
                            }}
                            fontSize="large"
                        />
                    </IconButton>
                </Tooltip>
                <Typography variant="body1">{post.reactionCount}</Typography>
            </Box>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{t('postDetails.title')}</DialogTitle>
                <DialogContent>
                    {loadingDetails ? (
                        <Box
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : workoutDetails ? (
                        <>
                            <Typography variant="subtitle1">
                                {t('postDetails.date')} {workoutDetails.date}
                            </Typography>
                            {workoutDetails.note &&
                            <Typography variant="subtitle1">
                                {t('postDetails.note')} {workoutDetails.note}
                            </Typography>
                            }
                            <Typography variant="subtitle1">{t('postDetails.exercises')}</Typography>
                            {workoutDetails.exerciseSessions.map((session, index) => (
                                <Box key={index} marginBottom={2}>
                                    <Typography variant="body2">{session.exerciseName}</Typography>
                                    <ul>
                                        {session.sets.map((set, idx) => (
                                            <li key={idx}>
                                                {t('postDetails.sets', {count:set.reps, weight: set.weight})}
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            ))}
                        </>
                    ) : (
                        <Typography color="error">
                            Nie udało się załadować szczegółów treningu.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={openImageDialog} onClose={handleImageDialogClose} maxWidth="lg">
                <DialogContent>
                    <CardMedia
                        component="img"
                        image={post.imageUrl}
                        alt="Full Post Image"
                        sx={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto' }}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default Post;
