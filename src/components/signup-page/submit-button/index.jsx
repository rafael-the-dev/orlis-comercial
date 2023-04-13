import Button from "@mui/material/Button";
import classNames from "classnames";

import classes from "./styles.module.css";

import PrimaryButton from "src/components/primary-button";

const DefaultButton = ({ children, ...rest }) => (
    <PrimaryButton 
        classes={{ button: classNames(classes.button, "mt-6 rounded-2xl text-base w-full") }}
        type="submit"
        { ...rest }
    >
        { children }
    </PrimaryButton>
);

export default DefaultButton;