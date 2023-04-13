import * as React from "react";
import { useRouter } from "next/router"

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { BookingContext } from "src/context/BookingContext";
import { ComponentsContext } from "src/context/DefaultComponentsContext";

import CancelLink from "src/components/cancel-link";
import PrimaryButton from "src/components/primary-button";
import Table from "src/components/default-table";

import { RegisterClass } from "src/components/rooms-page"

const RoomsContainer = () => {
    const { setNewPanel } = React.useContext(ComponentsContext);
    const { roomsListRef, setRoomId } = React.useContext(BookingContext);

    const initialState = React.useCallback(() => {
        return roomsListRef.current ?? [];
    }, [ roomsListRef ]);

    const [ roomsList, setRoomsList ] = React.useState(initialState);

    const headers = React.useRef([
        { label: "Descricao", value: "description" },
        { label: "Numero", value: "number" },
        { label: "Preco por dia", value: "dailyPrice" },
        { label: "Preco por hora", value: "hourlyPrice" },
    ]);

    const router = useRouter();

    const clickHandler = React.useCallback(({ roomId }) => () => {
        setRoomId(roomId);
        setNewPanel("NEW_ROOM");
    }, [ setNewPanel, setRoomId ]);

    const registerClickHandler = React.useCallback(() => {
        setNewPanel("NEW_ROOM");
    }, [ setNewPanel ]);

    const fetchRooms = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();

            const { data } = await fetchHelper({ options, url: "/api/rooms" });
            roomsListRef.current = data;
            setRoomsList(data);
        }
        catch(e) {
            console.error(e)
        }
    }, [ roomsListRef ]);

    React.useEffect(() => {
        if(!roomsListRef.current) fetchRooms();
    }, [ fetchRooms, roomsListRef ])

    return (
        <>
            <Table 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                data={roomsList}
                headers={headers}
                onClickRow={clickHandler}
            />
            <div className="flex flex-col md:justify-start md:flex-row-reverse">
                <PrimaryButton 
                    classes={{ button: "w-full sm:w-auto" }}
                    onClick={registerClickHandler}>
                    Registar novo quarto
                </PrimaryButton>
                <RegisterClass />
                <CancelLink classes={{ button: "w-full" }} href="/" />
            </div>
        </>
    );
};

export default RoomsContainer;