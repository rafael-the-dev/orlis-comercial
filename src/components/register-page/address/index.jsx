import * as React from "react";

import { RegisterContext } from "src/context";

import BirthPlace from "./components/birth-place";
import TextField from "src/components/register-page/text-field";

const Address = () => {
    const { address, setAddress } = React.useContext(RegisterContext);

    const addressChangeHandler = React.useCallback(e => setAddress(e.target.value), [ setAddress ]);

    const addressMemo = React.useMemo(() => (
        <TextField 
            label="Address"
            multiline
            minRows={7}
            onChange={addressChangeHandler}
            value={address}
        />
    ), [ address, addressChangeHandler ])

    const birthPlaceMemo = React.useMemo(() => <BirthPlace />, []);
    
    return (
        <div className="flex flex-col">
            { birthPlaceMemo }
            { addressMemo }
        </div>
    );
};

export default Address;