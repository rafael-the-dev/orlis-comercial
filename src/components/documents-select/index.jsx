import MenuItem from "@mui/material/MenuItem";

import TextField from "../default-input";

const documentsList = [
    { label: "BI", value: "bi" },
    { label: "Driving Licence", value: "driving-licence" },
    { label: "Passport", value: "passport" },
    { label: "DIRE", value: "dire" }
]

const DocumentSelect = ({ onChange, value, ...rest }) => {
    return (
        <TextField
            onChange={onChange}
            select
            value={value}
            { ...rest }
        >
            {
                documentsList.map(item => (
                    <MenuItem
                        { ...item }
                        key={item.value}>
                        { item.label }
                    </MenuItem>
                ))
            }
        </TextField>
    )
};

export default DocumentSelect;