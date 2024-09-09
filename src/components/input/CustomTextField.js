import {styled} from "@mui/material";
import TextField from '@mui/material/TextField';

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white', // Białe obramowanie
        },
        '&:hover fieldset': {
            borderColor: 'white', // Białe obramowanie podczas najechania myszką
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white', // Białe obramowanie podczas fokusu
        },
    },
    '& .MuiInputBase-input': {
        color: 'white', // Biały tekst
    },
    '& .MuiFormLabel-root': {
        color: 'white', // Biała etykieta
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: 'white', // Biała etykieta podczas fokusu
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px black inset',
            WebkitTextFillColor: 'white', // Kolor tekstu podczas autouzupełniania
            caretColor: 'white', // Kolor kursora
            borderColor: 'white',
    },
}));

export default function StyledTextField(props) {
    return (
        <CustomTextField
            {...props}
        />
    );
}
