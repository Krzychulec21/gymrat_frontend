import {Box, Card, CardMedia, Typography} from '@mui/material';
import CustomButton from "../components/button/CustomButton";
import {useNavigate} from "react-router-dom";

const FeatureSection = ({title, description, image, reverse}) => {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/auth');
    };
    return (
        <Box
            sx={{
                my: 20,
                display: 'flex',
                flexDirection: {xs: 'column', md: reverse ? 'row-reverse' : 'row'},
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                maxWidth: {xs: '100%', md: '100%', xl: '80%'},
                mx: 'auto',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" sx={{color: '#C50000', mb: 2, fontWeight: 'bold'}}>
                    {title}
                </Typography>
                <Typography variant="h6" sx={{mb: 2, maxWidth: '80%'}}>
                    {description}
                </Typography>
                <CustomButton variant="contained" color="primary" onClick={handleButtonClick}>
                    Dołącz teraz
                </CustomButton>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Card sx={{boxShadow: 'none', backgroundColor: 'transparent', maxWidth: '80%'}}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt={`${title} Image`}
                        sx={{
                            borderRadius: '8px',
                            width: '100%',
                        }}
                    />
                </Card>
            </Box>
        </Box>
    );
}

export default FeatureSection;
