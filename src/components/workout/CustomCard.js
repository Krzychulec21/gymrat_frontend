import {Box, Card, CardContent, Typography} from "@mui/material";

const CustomCard = ({value, title}) => {
    return (
        <Card
            sx={{
                width: 200,
                height: 130,
                textAlign: 'center',
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.10)',
                    boxShadow: 6,
                },
                backgroundColor: '#252525'
            }}
        >
            <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{gap: 1}}>
                    <Typography variant="h4" component="span" color="text.secondary"
                                sx={{fontWeight: 'bold', color: 'white'}}>
                        {value}
                    </Typography>
                    <Typography variant="subtitle1" color="text.main" sx={{mt: 'auto'}}>
                        {title}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default CustomCard;