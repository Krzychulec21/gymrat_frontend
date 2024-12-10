import {useLocation, useNavigate} from "react-router-dom";
import {MenuItem} from "@mui/material";
import { Link as ScrollLink } from 'react-scroll';
import Button from "@mui/material/Button";

const MenuItemComponent = ({ item, isMobile, handleClose, ...props }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = item.type === "navigate" ? location.pathname === item.to : false;

    const handleClick= () => {
        if (item.type === 'navigate') {
            navigate(item.to);
        }
        if (handleClose) handleClose();
    };

    if (isMobile) {
        return (
            <MenuItem onClick={handleClick} key={item.label} {...props}>
                {item.type === 'scroll' ? (
                    <ScrollLink to={item.to} smooth duration={500}>
                        {item.label}
                    </ScrollLink>
                ) : (
                    item.label
                )}
            </MenuItem>
        );
    } else {
        return item.type === 'scroll' ? (
            <ScrollLink to={item.to} smooth duration={500} key={item.label}>
                <Button color="inherit" variant="text" sx={{ fontSize: { md: '1rem',lg: '1.2rem', xl:'1.4rem'} }}>
                    {item.label}
                </Button>
            </ScrollLink>
        ) : (
            <Button
                variant="text"
                color={isActive ? "primary" : "inherit"}
                sx={{
                    fontSize: { md: '1rem', lg: '1.2rem', xl: '1.4rem' },
                    '&:hover': {
                        textDecoration: 'underline', // Add underline on hover
                    },
                    ...(isActive && {
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                    }),
                }}
                onClick={handleClick}
                key={item.label}
            >
                {item.label}
            </Button>
        );
    }
};

export default MenuItemComponent;