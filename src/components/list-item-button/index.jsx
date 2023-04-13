import { Button, Typography } from "@mui/material"
import classNames from "classnames";

import Link from "src/components/link";

const Container = ({ children, classes, className, disabled, href, onClick }) => {

    return (
        <li className={classNames("", classes?.root)}>
            <Typography 
                component={ href ? Link : Button }
                className={classNames(`flex items-center justify-between py-3 px-3 rounded-none w-full 
                hover:bg-stone-100`, classes?.button)}
                disabled={Boolean(disabled)}
                href={href}
                onClick={onClick}>
                { children }
            </Typography>
        </li>
    );
};

export default Container;