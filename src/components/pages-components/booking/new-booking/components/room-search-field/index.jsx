import * as React from "react";
import classNames from "classnames";
import { ClickAwayListener, IconButton, Paper } from "@mui/material";

import classes from "./styles.module.css";
import { BookingContext } from "src/context/BookingContext";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import { NewBookingContext } from "src/context"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import Table from "src/components/default-table";

const RoomSearchField = () => {
    const { roomsListRef } = React.useContext(BookingContext);
    const { addRoom } = React.useContext(NewBookingContext);

    const [ value, setValue ] = React.useState("");
    
    const roomsRef = React.useRef([]);

    const [ roomsList, setRoomsList ] = React.useState([]);

    const headers = React.useRef([
        { label: "Descricao", value: "description" },
        { label: "Numero", value: "number" },
        { label: "Preco por dia", value: "dailyPrice" },
        { label: "Preco por hora", value: "hourlyPrice" },
    ]);

    const filteredList = React.useMemo(() => (
        Boolean(value.trim()) ? roomsRef.current
            .filter(room => {
                const isIncludedInDescription = room.description.toLowerCase().includes(value.toLowerCase());
                const isIncludedInNumber = `${room.number}`.includes(value);

                return isIncludedInDescription || isIncludedInNumber;
            }) : []
    ), [ value ]);
    
    const hasItems = filteredList.length > 0 || roomsList.length > 0;

    const changeHandler = React.useCallback(({ target: { value } }) => {
        setValue(value);
        if(!value.trim()) setRoomsList([]);
    }, []);

    const clickHandler = React.useCallback(() => {
        setRoomsList(currentList => {
            return currentList.length > 0 ? [] : roomsRef.current;
        });
    }, [ roomsRef ]);

    const clickAwayHandler = React.useCallback(() => {
        setValue("");
        setRoomsList([]);
    }, [])

    const rowClickHandler = React.useCallback(row => () => {
        addRoom(row);
        clickAwayHandler();
    }, [ addRoom, clickAwayHandler ]);

    const fetchRooms = React.useCallback(async () => {
        try {
            const options = getAuthorizationHeader();
            const { data } = await fetchHelper({ options, url: "/api/rooms" });
            roomsListRef.current = data;
            roomsRef.current = data;
        } catch(e) {
            console.error(e);
        }
    }, [ roomsListRef ]);

    React.useEffect(() => {
        if(roomsListRef.current) roomsRef.current = roomsListRef.current;
        else fetchRooms();
    }, [ fetchRooms, roomsListRef ])

    return (
        <div className="relative">
            <div className={classNames(classes.container, `border border-solid border-stone-200 flex items-center 
                mb-4`)}>
                <IconButton onClick={clickHandler}>
                    { hasItems ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                </IconButton>
                <input 
                    className={classNames(classes.input, "border-0 grow outline-none")}
                    onChange={changeHandler}
                    placeholder="Insere o nome do quarto ou numero"
                    value={value}
                />
                <SearchIcon className="text-4xl" />
            </div>
            { hasItems && (
                <ClickAwayListener onClickAway={clickAwayHandler}>
                    <Paper 
                        className={classNames(classes.tableContainer, "absolute w-full z-10")}>
                        <Table 
                            classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                            data={filteredList.length > 0 ? filteredList : roomsList}
                            headers={headers}
                            onClickRow={rowClickHandler}
                        />
                    </Paper> 
                </ClickAwayListener>
            )}
        </div>
    );
};

export default RoomSearchField;