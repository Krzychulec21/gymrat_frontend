import React, {useContext, useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {getUserAvatar, updatePersonalInfo} from "../service/userService";
import axiosInstance from "../utils/axiosInstance";
import Slide from '@mui/material/Slide';
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {AvatarContext} from "../context/AvatarContext";
import {getFriendStatus, removeFriend, sendFriendRequest} from "../service/friendService";
import {useSnackbar} from "../context/SnackbarContext";

const SlideTransition = React.forwardRef((props, ref) => {
    return <Slide {...props} ref={ref} direction={props.direction || "down"} />;
});


const ProfileInfo = ({user, currentUser, personalInfo, avatar: initialAvatar, onDataUpdate}) => {
    const isCurrentUser = currentUser && user && currentUser.id === user.id;
    const [openDialog, setOpenDialog] = useState(false);
    const {updateAvatar} = useContext(AvatarContext);
    const [friendStatus, setFriendStatus] = useState(null);
    const { showSnackbar } = useSnackbar();

    const genderMapping = {
        MALE: "mężczyzna",
        FEMALE: "kobieta"
    };
    const validationSchema = Yup.object().shape({
        bio: Yup.string().max(500, 'O mnie nie może przekraczać 500 znaków'),
        weight: Yup.number()
            .min(30, 'Waga musi wynosić co najmniej 30 kg')
            .max(400, 'Waga nie może przekraczać 400 kg')
            .required('Waga jest wymagana'),
        height: Yup.number()
            .min(50, 'Wzrost musi wynosić co najmniej 50 cm')
            .max(300, 'Wzrost nie może przekraczać 300 cm')
            .required('Wzrost jest wymagany'),
        gender: Yup.string().required('Płeć jest wymagana'),
    });


    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                await axiosInstance.patch('/personal-info/avatar', formData);

                const updatedAvatar = await getUserAvatar();

                updateAvatar(updatedAvatar);
                if (onDataUpdate) {
                    onDataUpdate();
                }
                showSnackbar('Avatar został pomyślnie zaktualizowany!', 'success');
            } catch (error) {
                showSnackbar('Niepoprawny format pliku!', 'error');
                console.error("Failed to update avatar:", error);
            }
        }
    };

    const handleButtonClick = () => {
        setOpenDialog(true);
    };
    const handleSave = async (values, {setSubmitting}) => {
        try {
            await updatePersonalInfo(values);
            setOpenDialog(false);
            onDataUpdate();
            showSnackbar('Dane zostały pomyślnie zmienione!', 'success');
        } catch (error) {
            showSnackbar('Wystąpił błąd podczas zapisywania danych!', 'error');
            console.error('Error updating personal info:', error);
        }

    };

    useEffect(() => {
        const fetchFriendStatus = async () => {
            try {
                const status = await getFriendStatus(user.id);
                setFriendStatus(status);
            } catch (error) {
                console.error("Failed to fetch friend status", error);
            }
        };
        if (!isCurrentUser && user) {
            fetchFriendStatus();
        }
    }, [isCurrentUser, user]);

    const handleAddFriend = async () => {
        try {
            await sendFriendRequest(user.email);
            setFriendStatus('PENDING');
            showSnackbar('Zaproszenie do znajomychh zostało wysłane!', 'success');
        } catch (error) {
            showSnackbar('Wystąpił błąd podczas wysyłania zaproszennia', 'error');
            console.error("Failed to send friend request:", error);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            await removeFriend(user.email);
            setFriendStatus('NOT_FRIEND');
            showSnackbar('Pomyślnie usunięto znajomego', 'success');
        } catch (error) {
            showSnackbar('Błąd podczas usuwania znajomego', 'error');
            console.error("Failed to remove friend:", error);
        }
    };


    return (
        <Box
            sx={{
                position: 'relative',
                backgroundColor: '#2C2C2C',
                borderRadius: '8px',
                padding: '20px',
                margin: '0 auto',
                color: 'white',
                minWidth: {xs: '80%', lg: '55%'},
                maxWidth: {xs: '90%', lg: '70%'},
                mb: 5
            }}
        >
            {isCurrentUser && (
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
            )}
            {!isCurrentUser && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1
                    }}
                >
                    {friendStatus === 'NOT_FRIEND' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddFriend}
                        >
                            Dodaj znajomego
                        </Button>
                    )}
                    {friendStatus === 'FRIEND' && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleRemoveFriend}
                        >
                            Usuń znajomego
                        </Button>
                    )}
                    {friendStatus === 'PENDING' && (
                        <Box sx={{border: "1px solid white", padding: 1, borderRadius: "5px"}}>
                            <Typography variant="body2">Zaproszenie wysłane</Typography>
                        </Box>
                    )}
                </Box>
            )}

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
                    mb: 2
                }}
                >
                    <Avatar
                        sx={{width: 120, height: 120}}
                        src={initialAvatar}
                    />
                    {isCurrentUser && (
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
                    )}
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

            {/*user properties*/
            }
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                mb: 2,
                ml: 3
            }}>
                {personalInfo && typeof personalInfo === 'object' && (
                    <Box>
                        <Typography variant="body1">Waga: {personalInfo.weight}</Typography>
                        <Typography variant="body1">Wzrost: {personalInfo.height}</Typography>
                        {personalInfo.gender !== null && personalInfo.gender !== "OTHER" &&
                            <Typography variant="body1">Płeć: {genderMapping[personalInfo.gender]}</Typography>
                        }
                    </Box>
                )}
            </Box>

            {/*bio*/
            }
            <Box sx={{ml: 3, mt: 3}}>
                <Typography sx={{textAlign: 'center'}} variant="h5">O mnie</Typography>
                <Box sx={{border: "1px solid white", padding: 2, borderRadius: "5px", mt: 2}}>
                    <Typography variant="body1">{personalInfo.bio}</Typography>
                </Box>
            </Box>
            <Dialog
                open={openDialog}
                TransitionComponent={SlideTransition}
                TransitionProps={{ direction: "up" }}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>
                    Edytuj Informacje
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenDialog(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Formik
                        initialValues={{
                            bio: personalInfo.bio || '',
                            weight: personalInfo.weight || '',
                            height: personalInfo.height || '',
                            gender: personalInfo.gender || '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}
                    >
                        {({errors, touched, isSubmitting}) => (
                            <Form>
                                {/* Bio */}
                                <Field
                                    as={TextField}
                                    name="bio"
                                    label="O mnie"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    margin="normal"
                                    error={touched.bio && !!errors.bio}
                                    helperText={touched.bio && errors.bio}
                                />

                                {/* Weight */}
                                <Field
                                    as={TextField}
                                    name="weight"
                                    label="Waga (kg)"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    error={touched.weight && !!errors.weight}
                                    helperText={touched.weight && errors.weight}
                                />

                                {/* Height */}
                                <Field
                                    as={TextField}
                                    name="height"
                                    label="Wzrost (cm)"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    error={touched.height && !!errors.height}
                                    helperText={touched.height && errors.height}
                                />

                                {/* Gender */}
                                <Typography variant="subtitle1" sx={{mt: 2}}>
                                    Płeć
                                </Typography>
                                <Field name="gender">
                                    {({field}) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel value="MALE" control={<Radio/>} label="Mężczyzna"/>
                                            <FormControlLabel value="FEMALE" control={<Radio/>} label="Kobieta"/>
                                            <FormControlLabel value="OTHER" control={<Radio/>}
                                                              label="Nie chcę podawać"/>
                                        </RadioGroup>
                                    )}
                                </Field>
                                {touched.gender && errors.gender && (
                                    <Typography color="error">{errors.gender}</Typography>
                                )}

                                <DialogActions>
                                    <Button onClick={() => setOpenDialog(false)} color="primary">
                                        Anuluj
                                    </Button>
                                    <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                                        Zapisz
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </Box>

    )
        ;
};

export default ProfileInfo;
