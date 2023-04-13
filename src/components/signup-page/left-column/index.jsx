import Typography from "@mui/material/Typography";
import classNames from "classnames";
import { useRouter } from "next/router";

import classes from "./styles.module.css";

import SchoolIcon from '@mui/icons-material/School';

const Column = () => {
    const { pathname } = useRouter();

    return (
        <div className={classNames(classes.content, {[classes.contentSignup]: pathname === "/sign-up"},
            "flex-col hidden items-center justify-center rounded-l-2xl text-white")}>
            <SchoolIcon className={classNames(classes.icon)} />
            <Typography
                className="mt-2">
                Welcome back!
            </Typography>
        </div>
    );
};

export default Column;