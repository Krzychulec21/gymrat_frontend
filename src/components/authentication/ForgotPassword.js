import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../../service/authService';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function ForgotPassword({ onBackToSignIn }) {
    const [message, setMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Wymagane')
                .email('Nieprawidłowy adres email'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                await authService.forgotPassword(values.email);
                setMessage('Na Twój adres e-mail wysłano link do resetowania hasła.');
            } catch (error) {
                setMessage('Nie znaleziono konta z podanym adresem e-mail.');
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            margin: "0 auto",
            alignItems: 'center',
        }}>
            <TextField
                fullWidth
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
            />
            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
                Wyślij
            </Button>
            {message && <p>{message}</p>}
            <Button variant="text" onClick={onBackToSignIn}>
                Wróć do logowania
            </Button>
        </Box>
    );
}

export default ForgotPassword;
