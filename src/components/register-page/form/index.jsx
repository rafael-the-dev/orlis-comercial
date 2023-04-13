import * as React from "react";
import { Button } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import { RegisterStepsContext } from "src/context"

import { Address, BasicDetails, Identification, Steps } from "src/components/register-page";
import Link from "src/components/link";

const Form = () => {
    const { step } = React.useContext(RegisterStepsContext);

    const address = React.useMemo(() => <Address />, []);
    const basicDetails = React.useMemo(() => <BasicDetails />, []);
    const identification = React.useMemo(() => <Identification />, []);

    const componentsRef = React.useRef({
        address,
        "identification-document": identification,
        "personal-details": basicDetails
    });

    const leaveLink = React.useMemo(() => (
        <Link href="/dashboard">
            <Button
                className={classNames("border-red-600 mr-8 text-red-600 px-8 py-2 hover:text-white hover:bg-red-600 hover:border-red-600")}
                variant="outlined">
                Cancel
            </Button>
        </Link>
    ), []);

    return (
        <form className={classNames(classes.form, "flex flex-col items-stretch justify-between pt-8 xl:pt-0")}>
            {
                componentsRef.current[step]
            }
            <div className='flex justify-end mt-8'>
                { leaveLink }
                <Button
                    className={classNames("bg-amber-600 px-8 py-2 text-white hover:bg-amber-800")}
                    variant="contained">
                    Next
                </Button>
            </div>
        </form>
    );
};

export default Form;