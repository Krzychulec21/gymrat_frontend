import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#C50000',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#757575',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#000000',
        },
    },
    typography: {
        fontSize: 14,
        button: {
            textTransform: 'none',
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: 0,
                    padding: '8px 24px',
                },

                contained: {
                    backgroundColor: 'red',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'darkred',
                    },
                },
                outlined: {
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        borderBottom: '2px solid darkred',
                    },
                },
            },
            defaultProps: {
                disableRipple: true,
                variant: 'contained',
            },
            variants: [
                {
                    props: { variant: 'google' },
                    style: {
                        textTransform: 'none',
                        color: '#757575',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2)',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    },
                },
            ],
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: 'white',
                    },
                    '& .MuiFormLabel-root': {
                        color: 'white',
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: 'white',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF', // Set icons color to white
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF', // Set SVG icons (like AddIcon, RemoveIcon) to white
                },
            },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF', // Color for calendar icon in date fields
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                // Custom scrollbar styles
                '::-webkit-scrollbar': {
                    width: '8px',
                },
                '::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                    borderRadius: '10px',
                    outline: '1px solid white',
                },
                '::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                },
            },
        },

    },

});

export default theme;
