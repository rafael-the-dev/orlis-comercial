import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomCheckbox = styled(Checkbox)({
    '&.Mui-checked': {
        color: "#dc2626"
    }
});

const CheckboxContainer = ({ checked, label, onChange }) => (
    <FormControlLabel 
        control={<CustomCheckbox checked={checked} onChange={onChange} />} 
        label={label}
    />
);

export default CheckboxContainer;