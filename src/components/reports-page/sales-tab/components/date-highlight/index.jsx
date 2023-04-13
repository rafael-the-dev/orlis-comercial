import Typography from "@mui/material/Typography";
import classNames from "classnames";

import classes from "./styles.module.css"

const DateHighlight = ({ children }) => (
    <Typography 
        component="h2"
        className={classNames(classes.date, "absolute font-bold md:text-xl right-5")}>
        { children }
    </Typography>
);

export default DateHighlight;