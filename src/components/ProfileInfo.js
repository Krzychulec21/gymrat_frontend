import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio, Snackbar, Alert, Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {getUserAvatar, updatePersonalInfo} from "../service/userService";
import axiosInstance from "../utils/axiosInstance";

const ProfileInfo = ({user, personalInfo}) => {
    const [avatar, setAvatar] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const bio = personalInfo.bio || '';

    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        bio: user.bio || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
    });

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const avatarData = await getUserAvatar();
                setAvatar(avatarData);
            } catch (error) {
                console.error("Failed to load avatar", error);
            }
        };

        fetchAvatar();
    }, []);
    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                await axiosInstance.patch('/avatar', formData);

                const updatedAvatar = await getUserAvatar();
                setAvatar(updatedAvatar);
            } catch (error) {
                setOpenSnackbar(true);
                console.error("Failed to update avatar:", error);
            }
        }
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleButtonClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await updatePersonalInfo(formData);
            setOpenDialog(false);
        } catch (error) {
            console.error('Error updating personal info:', error);
        }
    };



    return (
        <Box
            sx={{
                position: 'relative',
                backgroundColor: '#2C2C2C',
                borderRadius: '8px',
                maxWidth: {xs: '85%', lg: '60%'},
                padding: '20px',
                margin: '0 auto',
                color: 'white',
                minWidth: {xs: '80%', lg: '55%'} ,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1
                }}
            >
                <Button
                    variant="text"
                    color="primary.secondary"
                    onClick={handleButtonClick}
                    startIcon={<EditIcon/>}
                    sx={{
                        backgroundColor: '#555',
                    }}
                >
                    Edytuj
                </Button>
            </Box>

            {/*Avatar and name*/}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    position: 'relative',
                }}
            >
                {/*Avatar with upload photo icon*/}
                <Box sx={{
                    position: 'relative',
                    mb:2
                }}
                >
                    <Avatar
                        sx={{width: 120, height: 120}}
                        src={avatar}
                        alt={user.firstName}
                    />
                    <IconButton
                        component="label"
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            bottom: -10,
                            right: -5,
                            width: 35,
                            height: 35,
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            },
                        }}
                    >
                        <AddPhotoAlternateIcon/>
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleAvatarChange}
                            hidden
                        />
                    </IconButton>
                </Box>

                {/*Name and email*/}
                <Box sx={{textAlign: {xs: 'center', sm: 'left'}}}>
                    < Typography variant="h5" sx={{fontWeight: 'bold'}}>
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body1"
                    sx={{color: 'rgba(255,255,255,0.7)'}}>
                        {user.email}
                    </Typography>
                </Box>
            </Box>

        {/*user properties*/}
            <Box sx={{
                display:'flex',
                flexWrap:'wrap',
                gap:3,
                mb:2,
                ml:3
            }}>
                {personalInfo && typeof personalInfo === 'object' && (
                    <Box>
                        <Typography variant="body2">Waga: {personalInfo.weight}</Typography>
                        <Typography variant="body2">Wzrost: {personalInfo.height}</Typography>
                        <Typography variant="body2">Płeć: {personalInfo.gender}</Typography>
                    </Box>
                )}
            </Box>

        {/*bio*/}
            <Box sx={{ml:3}}>
                <Typography variant="h6" sx={{mb:2}}>
                    O mnie:
                </Typography>
                <Typography sx={{maxWidth: {lg:'70%'}}}>
                    {bio}
                </Typography>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{
                vertical: 'top', horizontal: 'center'
            }}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    Niepoprawny format pliku!
                </Alert>
            </Snackbar>
            <Dialog open={openDialog} PaperProps={{style: {
                backgroundColor:'grey'
                }}} onClose={handleDialogClose}>
                <DialogTitle>
                    Edytuj Informacje
                    <IconButton
                        aria-label="close"
                        onClick={handleDialogClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {/* Bio */}
                    <TextField
                        name="bio"
                        label="O mnie"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={formData.bio}
                        onChange={handleInputChange}
                    />
                    {/* Weight */}
                    <TextField
                        name="weight"
                        label="Waga (kg)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.weight}
                        onChange={handleInputChange}
                    />
                    {/* Height */}
                    <TextField
                        name="height"
                        label="Wzrost (cm)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.height}
                        onChange={handleInputChange}
                    />
                    {/* Gender */}
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Płeć
                    </Typography>
                    <RadioGroup
                        row
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                    >
                        <FormControlLabel value="MALE" control={<Radio />} label="Mężczyzna" />
                        <FormControlLabel value="FEMALE" control={<Radio />} label="Kobieta" />
                        <FormControlLabel value="OTHER" control={<Radio />} label="Inna" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>

    );
};

export default ProfileInfo;
