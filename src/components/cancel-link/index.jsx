import Button from "@mui/material/Button";
import classNames from "classnames";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Link from "../link";

const CancelLink = ({ children, classes, href, hideIcon, variant, ...rest }) => {

    const newVariant = variant ?? "outlined";
    
    const button = (
        <Button
            className={classNames("py-2", 
                newVariant === "contained" ? "bg-red-500 text-white hover:bg-red-700" : "border border-solid border-red-500 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white", 
                classes?.button
            )}
            variant={newVariant}
            startIcon={<ArrowBackIcon className={classNames({ "hidden": Boolean(hideIcon)})} />}
            { ...rest }>
            { children ?? "Cancel" }
        </Button>
    );

    return href ? <Link className={classes?.link} href={href}>{ button }</Link> : button;
};

export default CancelLink;