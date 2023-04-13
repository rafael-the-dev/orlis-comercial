import * as React from "react";
import classNames from "classnames";
import { ClickAwayListener, IconButton, Paper } from "@mui/material";

import classes from "./styles.module.css";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import { BookingContext } from "src/context"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import Table from "src/components/default-table";

const RoomSearchField = () => {
    const { addRoom } = React.useContext(BookingContext);

    const [ value, setValue ] = React.useState("");
    const [ roomsList, setRoomsList ] = React.useState([]);

    const headers = React.useRef([
        { label: "Descricao", value: "description" },
        { label: "Numero", value: "number" },
        { label: "Preco por dia", value: "dailyPrice" },
        { label: "Preco por hora", value: "hourlyPrice" },
    ]);

    const roomsListRef = React.useRef([]);

    const filteredList = React.useMemo(() => (
        Boolean(value.trim()) ? roomsListRef.current
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
            return currentList.length > 0 ? [] : roomsListRef.current;
        });
    }, []);

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
        } catch(e) {
            console.error(e);
        }
    }, []);

    React.useEffect(() => {
        fetchRooms();
    }, [ fetchRooms ])

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