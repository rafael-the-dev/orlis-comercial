import Button from "@mui/material/Button";
import classNames from "classnames";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ButtonContainer = ({ children, id, onClick, selectedKey }) => {
    const selected = id === selectedKey;

    return (
        <Button 
            className={classNames("mr-2", selected ? "text-red-500" : "text-black" )}
            endIcon={selected ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={onClick(id)}>
            { children }
        </Button>
    );
};

export default ButtonContainer;