import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles"

const Input = styled(TextField)({
    '&': {
        marginBottom: "1rem"
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#00748f"
    }
});

export default Input;