import Paper from "@mui/material/Paper"
import classNames from "classnames";

import classes from "./styles.module.css";

const DefaultContainer = ({ children }) => (
    <div className="bg-stone-100 min-h-screen flex items-center justify-center w-full px-5 md:px-0">
        <Paper
            className={classNames(classes.loginContainer, `items-stretch rounded-2xl w-full md:flex`)}
            elavation={0}>
            { children }
        </Paper>
    </div>
);

export default DefaultContainer;
