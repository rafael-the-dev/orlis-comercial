import * as React from "react";

import { ComponentsContext } from "../DefaultComponentsContext"

const BookingContext = React.createContext();
BookingContext.displayName = "BookingContext";

const BookingContextProvider = ({ children }) => {
    const { getPanel } = React.useContext(ComponentsContext)
    const [ roomId, setRoomId ] = React.useState(null);

    const bookedRoomsListRef = React.useRef(null);
    const roomsClassesListRef = React.useRef(null);
    const roomsListRef = React.useRef(null);


    React.useEffect(() => {
        if(getPanel()  !== "NEW_ROOM") {
            setRoomId(null);
        }
    }, [ getPanel ])

    return (
        <BookingContext.Provider
            value={{
                bookedRoomsListRef,
                roomId, roomsClassesListRef, roomsListRef,
                setRoomId
            }}>
            { children }
        </BookingContext.Provider>
    )
};

export {
    BookingContext,
    BookingContextProvider
}