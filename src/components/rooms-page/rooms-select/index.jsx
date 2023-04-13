import * as React from "react";
import MenuItem from "@mui/material/MenuItem";

import Textfield from "src/components/default-input";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";

const RoomsSelect = ({ onChange, ...rest }) => {
    const [ roomsClassesList, setRoomsClassesList ] = React.useState([]);

    const changeHandler = ({ target: { value }}) => {
        onChange(value, roomsClassesList)
    };

    const fetchRoomsClasses = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();

            const { data } = await fetchHelper({ options, url: "/api/rooms-classes" });
            setRoomsClassesList(data);
        } catch(e) {
            console.error(e)
        }
    }, [])
    
    React.useEffect(() => {
        fetchRoomsClasses();
    }, [ fetchRoomsClasses ])

    return (
        <Textfield 
            className="input w13"
            label="Classe"
            onChange={changeHandler}
            select
            { ...rest }
        >
            {
                roomsClassesList
                    .filter(({ state }) => state === "ACTIVO")
                    .map(({ description, id }) => (
                        <MenuItem 
                            key={id}
                            value={id}>
                            { description }
                        </MenuItem>
                    )
                )
            }
        </Textfield>
    );
};

export default RoomsSelect;