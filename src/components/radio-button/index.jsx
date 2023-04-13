import { FormControlLabel, Radio } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomRadio = styled(Radio)({
    '&.Mui-checked': {
        color: "#d97706"
    }
});

const RadioButton = ({ checked, label, onChange, value }) => {

    return (
        <FormControlLabel 
            control={
                <CustomRadio 
                    checked={checked} 
                    onChange={onChange} 
                />
            } 
            label={label}
            value={value}
        />
    );
};

export default RadioButton;