import * as React from "react";

import SearchIcon from '@mui/icons-material/Search';

import { BookingContext } from "src/context/BookingContext";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import Schedule from "./components/scheduler";
import Table from "src/components/default-table";

const BookedRoomsContainer = () => {
    const { bookedRoomsListRef } = React.useContext(BookingContext);
    const [ value, setValue ] = React.useState("");

    // return stored booked rooms list if it is not null
    const initialState = React.useCallback(() => {
        return bookedRoomsListRef.current ?? [];
    }, [ bookedRoomsListRef ])

    const [ bookedRooms, setBookedRooms ] = React.useState(initialState);

    const headers = React.useRef([
        { label: "Nome", key: "room", value: "description" },
        { label: "Class", key: "room", value: "classe", subValue: "description" },
        { label: "Numero", key: "room", value: "details", subValue: "number" },
        { label: "Entrada", value: "entrance" },
        { label: "Saida", value: "leaving" }
    ]);

    const filteredRooms = React.useMemo(() => {
        if(value.trim()) {
            return bookedRooms.filter(({ room }) => {
                const hasDescription = room.description.toLowerCase().includes(value.toLowerCase());
                const hasNumber = room.number.includes(value);

                return hasDescription || hasNumber;
            })
        }

        return bookedRooms;
    }, [ bookedRooms, value ])

    const changeHandler = React.useCallback((e) => setValue(e.target.value), []);

    const fetchBookedRooms = React.useCallback(async () => {
        try {
            const { data } = await fetchHelper({ 
                options: getAuthorizationHeader(), 
                url: "/api/rooms-uses"
            });
            
            bookedRoomsListRef.current = data;
            setBookedRooms(data);
        }
        catch(e) {
            console.error(e)
        }
    }, [ bookedRoomsListRef ]);

    //fetch data if bookedRoomsListRef is null
    React.useEffect(() => {
        if(!bookedRoomsListRef.current) fetchBookedRooms();
    }, [ bookedRoomsListRef, fetchBookedRooms ])

    return (
        <div>
            <div className="border border-solid border-stone-200 flex items-center mb-4 px-3 py-2">
                <input 
                    className="border-0 grow outline-none py-2 text-base"
                    onChange={changeHandler}
                    placeholder="Insere o nome do quarto ou numero"
                    value={value}
                />
                <SearchIcon />
            </div>
            <Schedule data={filteredRooms} />
            {/*<Table 
                data={filteredRooms}
                headers={headers}
            />*/}
        </div>
    );
};

export default BookedRoomsContainer;