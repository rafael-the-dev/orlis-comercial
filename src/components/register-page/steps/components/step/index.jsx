import * as React from "react";
import {Avatar, Button } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import { RegisterStepsContext } from "src/context";

const Step = ({ id, index, label }) => {
    const { step, setStep } = React.useContext(RegisterStepsContext);

    const clickHandler = React.useCallback(() => setStep(id), [ id, setStep ]);
    
    return (
        <Button
            className={classNames(classes.button, `capitalize flex items-center justify-between sm:py-2 xl:py-3`,
            step === id ? "bg-amber-600 text-white hover:bg-amber-600 sm:rounded-r-xl" : "text-amber-600" )}
            onClick={clickHandler}>
            { label } 
            <Avatar
                className={classNames(classes.avatar, { "bg-red-600 text-white": step === id})}>
                { index }
            </Avatar>
        </Button>
    );
};

export default Step;