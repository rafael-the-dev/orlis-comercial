import * as React from "react";

import { RegisterExpenseContext } from "src/context";

import PrimaryButton from "src/components/primary-button";

const Button = ({ children }) => {
    const { addNewProduct } = React.useContext(RegisterExpenseContext);

    return (
        <PrimaryButton
            onClick={addNewProduct}>
            { children }
        </PrimaryButton>
    );
};

export default Button;