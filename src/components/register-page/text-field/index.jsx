import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles"
import classNames from "classnames";

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: "#b45309"
        }
    }
});

const TextFieldContainer = (props) => {
    const { children, classes, ...others } = props;

    return (
        <div className={classNames(classes?.root)}>
            <CustomTextField 
                { ...others }
                fullWidth
                variant="outlined" 
            >
                { children } 
            </CustomTextField>
        </div>
    );
};

export default TextFieldContainer;