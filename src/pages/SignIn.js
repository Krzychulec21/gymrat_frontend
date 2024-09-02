import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../service/authService';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CustomButton from '../components/Button/CustomButton';
import CustomTextField from '../components/Input/CustomTextField';
import GoogleLoginButton from "../components/Button/GoogleLoginButton";
function SignIn() {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required')
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await authService.login(values);
                window.location.href = '/';
            } catch (error) {
                setErrors({ password: 'Invalid email or password' });
                setSubmitting(false);
            }
        }
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '25%', margin: "0 auto", alignItems: 'center'}}>
            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white', // Białe obramowanie
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Białe obramowanie podczas najechania myszką
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white', // Białe obramowanie podczas fokusu
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: 'white', // Biały tekst
                    },
                    '& .MuiFormLabel-root': {
                        color: 'white', // Biała etykieta
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: 'white', // Biała etykieta podczas fokusu
                    },
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px black inset',
                        WebkitTextFillColor: 'white', // Kolor tekstu podczas autouzupełniania
                        caretColor: 'white', // Kolor kursora
                        borderColor: 'white',
                    },
                }}
            />

            <CustomTextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}


            />

            <CustomButton type="submit" variant="contained" color="primary">
                Sign In
            </CustomButton>
            <text>OR</text>
            <GoogleLoginButton></GoogleLoginButton>
        </Box>
    );
}

export default SignIn;
