import {createTheme} from '@mui/material/styles';

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
            primary: '#ffffff',
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
        MuiTablePagination: {
            defaultProps: {
                labelDisplayedRows: ({from, to, count}) =>
                    `${from}-${to} z ${count !== -1 ? count : `więcej niż ${to}`}`,
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                },
            },
        },
        MuiPopper: {
            styleOverrides: {
                root: {
                    '& .MuiTypography-root': {
                        color: 'black',
                    },
                },
            },
        },
        MuiCardHeader: {
            styleOverrides: {
                subheader: {
                    color: '#FFFFFF'
                }
            }
        },
        MuiTableSortLabel: {
            styleOverrides: {
                icon: {
                    color: "white !important"
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: "white"
                },
                secondary: {
                    color: "white"
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginRight: "10px",
                    minWidth: "200px",
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "white",
                        },
                        "&:hover fieldset": {
                            borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "white",
                        },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&.Mui-focused": {
                        color: "white",
                    },
                    "&.MuiInputLabel-shrink": {
                        color: "white",
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: "white",
                },

            },
        },
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
                    props: {variant: "secondAction"},
                    style: {
                        backgroundColor: '#3f3f3f',
                        '&:hover': {
                            backgroundColor: '#383838',
                        },
                    }
                },

                {
                    props: {variant: 'google'},
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
        MuiPagination: {
            styleOverrides: {
                root: {
                    "& .MuiPaginationItem-root": {
                        color: 'white',
                    },
                    "& .Mui-selected": {
                        backgroundColor: 'rgba(80,80,80,0.8)',
                        color: 'red'
                    },
                    "& .MuiPaginationItem-root:hover": {
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    }
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#252525',
                }
            }
        },

        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    color: 'white',
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
                },
            },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
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
