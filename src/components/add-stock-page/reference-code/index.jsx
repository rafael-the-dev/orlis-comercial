import * as React from "react";

import { AddStockContext } from "src/context";

import Input from "src/components/default-input";

const TextField = () => {
    const { addError, addInvoiceReference } = React.useContext(AddStockContext);

    const [ value, setValue ] = React.useState("");

    const valueRef = React.useRef("");

    const checkErrors = React.useCallback(newValue => newValue.trim().length >= 1, [])

    const blurHandler = React.useCallback(() => {
        addInvoiceReference(valueRef.current);
        addError("reference-code", !Boolean(checkErrors(valueRef.current)))
    }, [ addError, addInvoiceReference, checkErrors ])
    
    const changeHandler = React.useCallback(e => {
        const { value } = e.target;

        valueRef.current = value;
        setValue(value);
    }, []);

    const hasText = React.useMemo(() => checkErrors(value), [ checkErrors, value ]);

    return (
        <Input 
            className="input w12"
            error={!hasText}
            helperText={ hasText ?  "" : "This field is required"}
            label="Insert invoice reference"
            onBlur={blurHandler}
            onChange={changeHandler}
            value={value}
        />
    );
};

export default TextField;