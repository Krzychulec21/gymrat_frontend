import {styled} from "@mui/material";
import TextField from '@mui/material/TextField';

const CustomTextField = styled(TextField)(({theme}) => ({
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
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px black inset',
        WebkitTextFillColor: 'white',
        caretColor: 'white',
        borderColor: 'white',
    },
    minWidth: '200px'
}));

export default function StyledTextField(props) {
    return (
        <CustomTextField
            {...props}
        />
    );
}
