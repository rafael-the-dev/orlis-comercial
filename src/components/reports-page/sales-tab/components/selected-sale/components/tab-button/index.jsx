import Button from "@mui/material/Button";
import classNames from "classnames";


const ButtonContainer = ({ children, id, onClick, selectedTab }) => {

    return (
        <Button
            className={classNames("border-0 py-2 rounded-none w-1/3",
                id === selectedTab ? "bg-stone-500 text-white" : "bg-stone-300 text-black")}
            onClick={onClick(id)}
            >
            { children }
        </Button>
    );
};

export default ButtonContainer;