
import classNames from "classnames";
import { IconButton } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';

const ClientSearchField = ({ value, onChange, onClick }) => {

    return (
        <div className="flex border border-solid border-stone-300 items-center mb-4 py-2 pl-1 pr-2">
            <IconButton onClick={onClick}>
                <MoreHorizIcon />
            </IconButton>
            <input 
                className={classNames("border-0 grow outline-none py-1 sm:text-lg")}
                onChange={onChange}
                placeholder="Insert client's name"
                value={value}
            />
            <SearchIcon />
        </div>
    );
};

export default ClientSearchField;