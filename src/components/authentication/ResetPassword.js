import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../../service/authService';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

function ResetPassword({ onBackToSignIn }) {
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const token = searchParams.get('token');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'Hasło musi zawierać przynajmniej 8 znaków')
                .required('Wymagane'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Hasła nie mogą się różnić')
                .required('Wymagane'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await authService.resetPassword(token, values.password);
                setMessage('Hasło zostało pomyślnie zresetowane.');
            } catch (error) {
                setMessage('Token stracił ważność. Wygeneruj nowy token.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
            }}
        >
            <TextField
                size="small"
                label="Nowe hasło"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'hide password' : 'show password'}
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                fullWidth
            />
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
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'hide password' : 'show password'}
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Przetwarzanie...' : 'Zresetuj hasło'}
            </Button>
            {message && <p>{message}</p>}
            <Button onClick={onBackToSignIn} variant="text" color="secondary">
                Wróć do logowania
            </Button>
        </Box>
    );
}

export default ResetPassword;
