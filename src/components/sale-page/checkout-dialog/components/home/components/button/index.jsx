import Button from "@mui/material/Button";
import classNames from "classnames";


const ButtonContainer = ({ children, onClick, tab, value }) => {

    return (
        <Button
            className={classNames("border-0 py-2 rounded-none w-1/2",
                value === tab ? "bg-stone-500 text-white" : "bg-stone-300 text-black")}
            onClick={onClick(value)}
            >
            { children }
        </Button>
    );
};

export default ButtonContainer;