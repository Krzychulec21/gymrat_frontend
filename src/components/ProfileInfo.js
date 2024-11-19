import React, {useContext, useState} from 'react';
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileInfo = ({user, personalInfo, avatar:initialAvatar, onDataUpdate}) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const {updateAvatar} = useContext(AvatarContext);


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


    const handleSave = async (values, {setSubmitting}) => {
        try {
            await updatePersonalInfo(values);
            setOpenDialog(false);
            onDataUpdate();
        } catch (error) {
            console.error('Error updating personal info:', error);
        }
        setSubmitting(false);
    };


    return (
        <Box
            sx={{
                position: 'relative',
                backgroundColor: '#2C2C2C',
                borderRadius: '8px',
                maxWidth: {xs: '90%', lg: '70%'},
                padding: '20px',
                margin: '0 auto',
                color: 'white',
                minWidth: {xs: '80%', lg: '55%'},
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
                    mb: 2
                }}
                >
                    <Avatar
                        sx={{width: 120, height: 120}}
                        src={initialAvatar}
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
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                mb: 2,
                ml: 3
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
            <Box sx={{ml: 3}}>
                <Typography variant="h6" sx={{mb: 2}}>
                    O mnie:
                </Typography>
                <Typography sx={{maxWidth: {xs: '85%', wordBreak: 'break-word'}}}>
                    {personalInfo.bio}
                </Typography>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{
                vertical: 'top', horizontal: 'center'
            }}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    Niepoprawny format pliku!
                </Alert>
            </Snackbar>
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
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
                                            <FormControlLabel value="OTHER" control={<Radio/>} label="Inna"/>
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

    );
};

export default ProfileInfo;
