import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../service/authService';
import Box from '@mui/material/Box';
import EssaCustomButton from '../components/Button/CustomButton';
import {useNavigate} from "react-router-dom"; // Import CustomButton
import CustomTextField from '../components/Input/CustomTextField';


function SignUp() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            nickname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            nickname: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required')
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await authService.register(values);
                window.location.href = '/'; // todo zobaczyc bo uzywanie navigage nie dziala bo nie loguje automatycznie
            } catch (error) {
                setErrors({ email: 'Email or nickname already exists' });
                setSubmitting(false);
            }
        }
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} autoComplete="off" id="custom-signup-form"  sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '25%', margin: "0 auto"}} >

            <CustomTextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
            />

            <CustomTextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
            />

            <CustomTextField
                fullWidth
                label="Nickname"
                name="nickname"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nickname}
                error={formik.touched.nickname && Boolean(formik.errors.nickname)}
                helperText={formik.touched.nickname && formik.errors.nickname}
            />

            <CustomTextField
                fullWidth
                label="Email"
                name="email" // Unikalna nazwa
                type="email"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                autoComplete="new-email" // Unikalna wartość dla autouzupełniania
            />

            <CustomTextField
                fullWidth
                label="Password"
                name="password" // Unikalna nazwa
                type="password"
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                autoComplete="new-password" // Unikalna wartość dla autouzupełniania
            />


            <EssaCustomButton type="submit" variant="contained" color="primary">
                Sign Up
            </EssaCustomButton>
        </Box>
    );
}

export default SignUp;
