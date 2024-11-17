import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import authService from '../service/authService';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import GoogleLoginButton from "./button/GoogleLoginButton";
import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {IconButton} from "@mui/material";


function SignIn() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
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

            <TextField
                fullWidth
                size="small"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
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
                    )
                }}
            />
            <Button type="submit" variant="contained" color="primary">
                Sign In
            </Button>
            <text>OR</text>
            <GoogleLoginButton></GoogleLoginButton>
        </Box>
    );
}

export default SignIn;
