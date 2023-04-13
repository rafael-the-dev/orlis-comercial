import * as React from "react";
import MenuItem from "@mui/material/MenuItem";

import { BookingContext } from "src/context/BookingContext";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";

import Textfield from "src/components/default-input";

const RoomsSelect = ({ onChange, ...rest }) => {
    const { roomsClassesListRef } = React.useContext(BookingContext);

    const initialState = React.useCallback(() => {
        return roomsClassesListRef.current ?? [];
    }, [ roomsClassesListRef ]);

    const [ roomsClassesList, setRoomsClassesList ] = React.useState(initialState);

    const changeHandler = ({ target: { value }}) => {
        onChange(value, roomsClassesList)
    };

    const fetchRoomsClasses = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();

            const { data } = await fetchHelper({ options, url: "/api/rooms-classes" });
            roomsClassesListRef.current = data;
            setRoomsClassesList(data);
        } catch(e) {
            console.error(e)
        }
    }, [ roomsClassesListRef ])
    
    React.useEffect(() => {
        if(!roomsClassesListRef.current) fetchRoomsClasses();
    }, [ fetchRoomsClasses, roomsClassesListRef ])

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