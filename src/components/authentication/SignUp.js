import React from 'react';
import {Field, useFormik} from 'formik';
import * as Yup from 'yup';
import authService from '../../service/authService';
import Box from '@mui/material/Box';
import GoogleLogin from "../button/GoogleLoginButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Grid} from "@mui/system";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import InputAdornment from "@mui/material/InputAdornment";
import {CircularProgress, IconButton} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import 'dayjs/locale/pl';
import {plPL} from "@mui/x-date-pickers/locales";
import {date} from "yup";

dayjs.locale('pl');


function SignUp() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            nickname: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthday: dayjs('2010-10-10')
        }, validationSchema: Yup.object({
            firstName: Yup.string().required('Wymagane'),
            lastName: Yup.string().required('Wymagane'),
            nickname: Yup.string().required('Wymagane'),
            email: Yup.string().email('Invalid email address').required('Wymagane'),
            password: Yup.string()
                .min(8, 'Hasło musi zawierać przynajmniej 8 znaków')
                .required('Wymagane'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Hasła nie mogą się różnić')
                .required('Wymagane'),
            birthday: Yup.date().required('Wymagane').max(dayjs().subtract(1, 'day').toDate(), "Niepoprawna data")
        }),

        onSubmit: async (values, {setErrors}) => {
            setIsSubmitting(true);
            try {
                await authService.register(values);
                setRegistrationSuccess(true);
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    const errorCode = error.response.data.errorCode;

                    if (errorCode === "EMAIL_TAKEN") {
                        setErrors({email: 'Email zajęty'});
                    }
                    if (errorCode === "NICKNAME_TAKEN") {
                        setErrors({nickname: 'Ta nazwa jest już zajęta'});
                    }
                }

            } finally {
                setIsSubmitting(false);
            }
        }

    });

    return (<LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pl">
        {registrationSuccess ? (<Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <h2>Pomyślnie zarejestrowano</h2>
            <p>Sprawdź swojego maila by zweryfikować konto</p>
        </Box>) : (<Box
            component="form"
            onSubmit={formik.handleSubmit}
            id="custom-signup-form"
            sx={{
                display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        size="small"
                        label="Imię"
                        name="firstName"
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        fullWidth
                        sx={{maxWidth: '300px'}}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        size="small"
                        label="Nazwisko"
                        name="lastName"
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        fullWidth
                        sx={{maxWidth: '300px'}}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        size="small"
                        label="Nazwa użytkownika"
                        name="nickname"
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nickname}
                        error={formik.touched.nickname && Boolean(formik.errors.nickname)}
                        helperText={formik.touched.nickname && formik.errors.nickname}
                        fullWidth
                        sx={{maxWidth: '300px'}}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        size="small"
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        fullWidth
                        sx={{maxWidth: '300px'}}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        size="small"
                        label="Hasło"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{
                            endAdornment: (<InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'hide password' : 'show password'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>)
                        }}
                        fullWidth
                        sx={{maxWidth: '225px'}}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        size="small"
                        label="Powtórz hasło"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        fullWidth
                        sx={{maxWidth: '225px'}}
                        InputProps={{
                            endAdornment: (<InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'hide password' : 'show password'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>)
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="Data urodzenia"
                        value={formik.values.birthday}
                        onChange={(value) => {
                            formik.setFieldValue('birthday', value);
                            formik.setFieldTouched('birthday', true);
                        }}
                        maxDate={dayjs().subtract(1, 'day')}
                        onOpen={() => {
                            formik.setFieldTouched('birthday', true);
                        }}
                        sx={{}}
                        slotProps={{
                            layout: {
                                sx: {
                                    '& .MuiDayCalendar-weekDayLabel': {
                                        color: 'white',

                                    },
                                }
                            },
                            textField: {
                                error: formik.touched.birthday && Boolean(formik.errors.birthday),
                                helperText: formik.touched.birthday && formik.errors.birthday,
                                fullWidth: true,
                                sx: {
                                    maxWidth: '300px',

                                }
                            },
                        }}

                    />

                </Grid>

            </Grid>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? (<CircularProgress size={24} color="inherit"/>
                ) : ('Zarejestruj się')}
            </Button>
            <div>LUB</div>
            <GoogleLogin/>
        </Box>)}
    </LocalizationProvider>);
}


export default SignUp;
