import * as React from "react";
import moment from "moment";

import { getAuthorizationHeader } from "src/helpers/queries"

const NewBookingContext = React.createContext();
NewBookingContext.displayName = "NewBookingContext";

const initial = {
    error: false,
    value: ""
};

const initialDate = { error: false, value: moment(Date.now()) };

const NewBookingContextProvider = ({ children }) => {
    const [ errors, setErrors ] = React.useState({
        booking: false,
        home: false,
    });

    const [ firstName, setFirstName ] = React.useState(initial)
    const [ lastName, setLastName ] = React.useState(initial);
    const [ document, setDocument ] = React.useState("bi");
    const [ documentNumber, setDocumentNumber ] = React.useState(initial)
    const [ room, setRoom ] = React.useState(null);

    const [ entranceHour, setEntranceHour ] = React.useState(initialDate);
    const [ entranceDate, setEntranceDate ] = React.useState(initialDate);
    const [ leavingHour, setLeavingHour ] = React.useState(initialDate);
    const [ leavingDate, setLeavingDate ] = React.useState(initialDate);
    
    const getErrors = React.useCallback(() => errors, [ errors ]);

    const getRoom = React.useCallback(() => room, [ room ]);

    const hasErrors = () => {
        const isEntranceHourLessThanNow = new Date(entranceHour.value) < Date.now();
        const isLeavingHourLessThanEntranceHour = new Date(leavingHour.value) < new Date(entranceHour.value);
        const hasRoom = Boolean(room);
        const hasDocumentDetailsErrors = [ document, firstName, lastName, documentNumber ].find(item => item.error);

        return  hasDocumentDetailsErrors || !hasRoom || isEntranceHourLessThanNow ||isLeavingHourLessThanEntranceHour;
    };

    const addRoom = React.useCallback(newRoom => setRoom(newRoom), [])

    const addError = React.useCallback((key, value) => {
        setErrors(currentErrors => ({
            ...currentErrors,
            [key]: value
        }))
    }, []);

    const details = React.useMemo(() => {
        return {
            client: {
                document, 
                documentNumber: documentNumber.value,
                firstName: firstName.value,
                lastName: lastName.value
            },
            room: {
                id: room?.roomId
            },
            entrance: `${entranceDate.value.format("YYYY-MM-DD")} ${entranceHour.value.format("HH:mm:ss")}`,
            leaving: `${leavingDate.value.format("YYYY-MM-DD")} ${leavingHour.value.format("HH:mm:ss")}`
        }
    }, [ document, documentNumber, entranceDate, entranceHour, firstName, leavingDate, leavingHour, lastName, room ]);

    const reset = React.useCallback(() => {
        setFirstName(initial)
        setLastName(initial);
        setDocument("bi");
        setDocumentNumber(initial)
        setRoom(null)
        setEntranceHour(initialDate);
        setEntranceDate(initialDate);
        setLeavingHour(initialDate);
        setLeavingDate(initialDate);
    }, [])

    const submitHelper = async () => {

        const options = {
            body: JSON.stringify(details),
            headers: { ...getAuthorizationHeader() },
            method: "POST"
        }

        const res = await fetch("/api/rooms-uses", options);
        return res;
    };

    return (
        <NewBookingContext.Provider
            value={{
                addError, addRoom,
                document, documentNumber, 
                entranceDate, entranceHour,
                firstName, 
                getErrors, getRoom,
                hasErrors,
                lastName, leavingDate, leavingHour,
                reset,
                setDocument, setDocumentNumber, setFirstName, setLastName,
                setEntranceDate, setEntranceHour, setLeavingDate, setLeavingHour,
                submitHelper
            }}>
            { children }
        </NewBookingContext.Provider>
    )
};

export {
    NewBookingContext,
    NewBookingContextProvider
}