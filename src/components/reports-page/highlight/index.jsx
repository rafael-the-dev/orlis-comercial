import { Typography } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css"

const Highlight = ({ color, description, title }) => {

    return (
        <div
            style={{ backgroundColor: color }}
            className={classNames(classes.container, "px-3 py-4 xl:py-6")}>
            <Typography className='text-base text-white'>
                { title }<br/>
                <span className="font-bold text-xl xl:text-2xl">{ description }</span>
            </Typography>
        </div>
    );
};

export default Highlight;