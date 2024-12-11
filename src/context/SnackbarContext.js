import React, {createContext, useContext, useState} from "react";
import {Alert, Slide, Snackbar} from "@mui/material";

const SnackbarContext = createContext();

export const SnackbarProvider = ({children}) => {
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'success',
        direction: 'down',
    });

    const showSnackbar = (message, severity = 'success', direction = 'down') => {
        setSnackbarState({open: true, message, severity, direction});
    };

    const closeSnackbar = () => {
        setSnackbarState((prevState) => ({...prevState, open: false}));
    };

    return (
        <SnackbarContext.Provider value={{showSnackbar}}>
            {children}
            {snackbarState.open && (
                <Snackbar
                    open={snackbarState.open}
                    autoHideDuration={3000}
                    onClose={closeSnackbar}
                    TransitionComponent={(props) => (
                        <Slide {...props} direction={snackbarState.direction}/>
                    )}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    TransitionProps={{
                        onExited: () => {
                            setSnackbarState(prev => ({...prev, open: false}));
                        }
                    }}
                >
                    <Alert
                        onClose={closeSnackbar}
                        severity={snackbarState.severity}
                        variant="filled"
                    >
                        {snackbarState.message}
                    </Alert>
                </Snackbar>
            )}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => useContext(SnackbarContext);