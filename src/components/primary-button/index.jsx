import Button from "@mui/material/Button";
import classNames from "classnames";

import Link from "../link";

const PrimaryButton = ({ children, classes, href, variant, ...rest }) => {

    const newVariant = variant ?? "contained"
    
    const button = (
        <Button
            className={classNames("py-2", 
                newVariant === "contained" ? "bg-neutral-700 text-white hover:bg-neutral-900" : "border border-solid border-neutral-700 text-neutral-700 hover:bg-neutral-900 hover:border-neutral-700 hover:text-white", 
                classes?.button
            )}
            variant={newVariant}
            { ...rest }>
            { children }
        </Button>
    );

    return href ? <Link className={classes?.link} href={href}>{ button }</Link> : button;
};

export default PrimaryButton;