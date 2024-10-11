import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import authService from '../service/authService';
import Box from '@mui/material/Box';
import GoogleLogin from "./button/GoogleLoginButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Grid} from "@mui/system";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function SignUp() {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            nickname: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthday: null
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            nickname: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password must match')
                .required('Required'),
            birthday: Yup.date().required('Required')
        }),
        onSubmit: async (values, {setSubmitting, setErrors}) => {
            try {
                await authService.register(values);
                window.location.href = '/';
            } catch (error) {
                setErrors({email: 'Email or nickname already exists'});
                setSubmitting(false);
            }
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                autoComplete="off"
                id="custom-signup-form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            size="small"
                            label="First Name"
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
                            label="Last Name"
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
                            label="Nickname"
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
                            autoComplete="new-email"
                            fullWidth
                            sx={{maxWidth: '300px'}}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            size="small"
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            autoComplete="new-password"
                            fullWidth
                            sx={{maxWidth: '300px'}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            size="small"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            variant="outlined"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            error={
                                formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
                            }
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            autoComplete="new-password"
                            fullWidth
                            sx={{maxWidth: '300px'}}
                        />
                    </Grid>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <DatePicker

                                label="Birthday"
                                value={formik.values.birthday}
                                onChange={(value) => formik.setFieldValue('birthday', value)}
                                slotProps={{
                                desktopPaper: {
                                        sx: {
                                            backgroundColor: '#363636',
                                        },
                                    },
                                    mobilePaper: {
                                        sx: {
                                            backgroundColor: '#363636',
                                        },
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        sx={{backgroundColor:'black'}}
                                        {...params}
                                        fullWidth
                                        error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                                        helperText={formik.touched.birthday && formik.errors.birthday}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                </Grid>

                <Button type="submit" variant="contained" color="primary">
                    Sign Up
                </Button>
                <div>OR</div>
                <GoogleLogin/>
            </Box>
        </LocalizationProvider>
    );
}


export default SignUp;
