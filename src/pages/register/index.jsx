import * as React from "react";
import classNames from "classnames";

import classes from  "./styles.module.css";

import { RegisterContextProvider } from "src/context";

import { Form, Steps } from "src/components/register-page";

const Container = () => {
    const formMemo = React.useMemo(() => <Form />, [])

    return (
        <main className={classNames(classes.main, "px-5 pb-12 w-full xl:pt-8 xl:px-8")}>
            <div className="h-full justify-between xl:bg-stone-50 xl:flex xl:p-6 xl:rounded-xl">
                <Steps />
                <RegisterContextProvider>
                    { formMemo }
                </RegisterContextProvider>
            </div>
        </main>
    );
};

export default Container;