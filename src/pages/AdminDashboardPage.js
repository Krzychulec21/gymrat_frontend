import React, {useState} from "react";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import FitnessIcon from "@mui/icons-material/FitnessCenter";
import {useNavigate} from "react-router-dom";
import authService from "../service/authService";
import AdminExercise from "../components/admin/AdminExercise";
import UsersManagement from "../components/admin/UsersManagement";

const AdminDashboard = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [activeView, setActiveView] = useState('users');
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleMenuItemClick = (view) => {
        setActiveView(view);
        handleCloseNavMenu();
    };

    const handleLogout = () => {
        authService.logout();
        navigate("/auth");
    };

    const renderActiveView = () => {
        switch (activeView) {
            case "users":
                return <UsersManagement/>;
            case "trainings":
                return <AdminExercise/>;
            default:
                return <Typography variant="h6">Wybierz opcję z menu</Typography>;
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <AppBar position="static" sx={{backgroundColor: '#252525'}}>
                <Toolbar sx={{position: 'relative'}}>
                    {isMobile ? (
                        <>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleOpenNavMenu}
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'center'}}>
                                Admin Dashboard
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                                sx={{position: 'absolute', right: 16}}
                            >
                                Wyloguj
                            </Button>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                            >
                                <MenuItem onClick={() => handleMenuItemClick('users')}>
                                    <IconButton color="inherit">
                                        <PeopleIcon/>
                                    </IconButton>
                                    <Typography textAlign="center">Użytkownicy</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => handleMenuItemClick('trainings')}>
                                    <IconButton color="inherit">
                                        <FitnessIcon/>
                                    </IconButton>
                                    <Typography textAlign="center">Treningi</Typography>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                                <Button
                                    startIcon={<PeopleIcon/>}
                                    variant="text"
                                    color="inherit"
                                    sx={{backgroundColor: 'transparent', mx: 1}}
                                    onClick={() => setActiveView('users')}
                                >
                                    Użytkownicy
                                </Button>
                                <Button
                                    startIcon={<FitnessIcon/>}
                                    variant="text"
                                    color="inherit"
                                    sx={{backgroundColor: 'transparent', mx: 1}}
                                    onClick={() => setActiveView('trainings')}
                                >
                                    Treningi
                                </Button>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                                sx={{position: 'absolute', right: 16}}
                            >
                                Wyloguj
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{flexGrow: 1, p: 3, maxWidth: '1000px', margin: 'auto', width: '100%'}}>
                {renderActiveView()}
            </Box>
        </Box>
    );
};

export default AdminDashboard;
