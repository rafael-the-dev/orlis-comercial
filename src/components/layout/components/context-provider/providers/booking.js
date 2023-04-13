import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined';

import { BookingContextProvider, ComponentsContextProvider, NewBookingContextProvider } from "src/context";

import BookedRooms from "src/components/pages-components/booking/booked-rooms"
import NewBooking from "src/components/pages-components/booking/new-booking";
import NewRoom from "src/components/pages-components/booking/register-room";
import RoomsList from "src/components/pages-components/booking/rooms";

const tabsList = [
    {
        id: "NEW_ROOM",
        icon: <AddOutlinedIcon />,
        title: "Novo quarto",
    },
    {
        id: "ROOMS_LIST",
        icon: <ReorderOutlinedIcon />,
        title: "Quartos",
    },
    {
        id: "NEW_BOOKING",
        icon: <BookmarkAddOutlinedIcon />,
        title: "Nova marcacao",
    },
    {
        id: "BOOKED_ROOMS",
        icon: <BookmarkAddedOutlinedIcon />,
        title: "Quartos agendados",
    }
];

const containersMap = {
    "BOOKED_ROOMS": <BookedRooms />,
    "NEW_BOOKING": <NewBookingContextProvider><NewBooking /></NewBookingContextProvider>,
    "NEW_ROOM": <NewRoom />,
    "ROOMS_LIST": <RoomsList />
}

const props = {
    containersMap,
    defaultContainerId: "NEW_BOOKING",
    tabsList
};

export const getBookingContext = children => (
    <ComponentsContextProvider { ...props }>
        <BookingContextProvider>
            { children }
        </BookingContextProvider>
    </ComponentsContextProvider>
)