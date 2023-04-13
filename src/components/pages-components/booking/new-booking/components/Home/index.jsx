import * as React from "react";
import classNames from "classnames";
import currency from "currency.js"
import moment from "moment";

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Paper, Typography } from "@mui/material";

import classes from "./styles.module.css";

import { BookingContext } from "src/context"

import CancelButton from "src/components/cancel-link";
import ClientDetails from "../../pages-components/booking/new-booking/components/client-details";
import PrimaryButton from "src/components/primary-button";
import RoomSearchField from "./components/room-search-field"
import TextField from "src/components/default-input";
import Table from "src/components/default-table";

const initialDate = moment(Date.now());

const HomeContainer = () => {
    const { 
        addRoom,
        entranceDate, entranceHour,
        getRoom,
        leavingDate, leavingHour,
        setEntranceDate, setEntranceHour, setLeavingDate, setLeavingHour
    } = React.useContext(BookingContext);

    const headers = React.useRef([
        { label: "Descricao", value: "description" },
        { label: "Numero", value: "number" },
        { label: "Preco por dia", value: "dailyPrice" },
        { label: "Preco por hora", value: "hourlyPrice" },
        { label: "Remover", value: "delete" },
    ]);

    const hourlyPriceMemo = React.useMemo(() => {
        if(!getRoom()) return 0;

        let startHour = entranceHour.toDate();

        if(new Date(startHour) < Date.now()) {
            startHour = moment(Date.now());
        }

        const x = moment.duration(startHour).asMinutes();
        const y = moment.duration(leavingHour).asMinutes();

        return currency(getRoom().hourlyPrice).multiply(y - x).divide(60).value;
    }, [ entranceHour, getRoom, leavingHour ]);

    const dailyPriceMemo = React.useMemo(() => {
        if(!getRoom()) return 0;

        const x = moment.duration(entranceDate).asDays();
        const y = moment.duration(leavingDate).asDays();

        return currency(getRoom().dailyPrice).multiply(y - x).value;
    }, [ entranceDate, getRoom, leavingDate ]);
    
    const totalPrice = React.useMemo(() => {
        if(hourlyPriceMemo < 0) return 0;

        return hourlyPriceMemo + dailyPriceMemo;
    }, [ dailyPriceMemo, hourlyPriceMemo ])

    const changeHandler = React.useCallback(func => newHour => func(newHour), []);

    const clientDetailsMemo = React.useMemo(() => <ClientDetails />, []);

    const removeRoomHandler = React.useCallback(() => () => addRoom(null), [ addRoom ]);

    const dateTitleMemo = React.useMemo(() => (
        <Typography 
            component="h2"
            className="font-semibold mb-4">
            Data
        </Typography>
    ), [])

    const entranceDateInputMemo = React.useMemo(() => (
        <DesktopDatePicker
            className="input w12 md:mb-0"
            inputFormat="DD/MM/YYYY"
            label="Data de entrada"
            minDate={initialDate}
            mask="__/__/____"
            onChange={changeHandler(setEntranceDate)}
            renderInput={(params) => <TextField {...params} />}
            value={entranceDate}
        />
    ), [ changeHandler, entranceDate, setEntranceDate ])

    const entranceHourInputMemo = React.useMemo(() => (
        <TimePicker
            ampm={false}
            className="input w12 md:mb-0"
            openTo="hours"
            views={['hours', 'minutes', 'seconds']}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            minTime={initialDate}
            label="Hora de entrada"
            value={entranceHour}
            onChange={changeHandler(setEntranceHour)}
            renderInput={(params) => <TextField {...params} />}
        />
    ), [ changeHandler, entranceHour, setEntranceHour ]);

    const hourTitleMemo = React.useMemo(() => (
        <Typography 
            component="h2"
            className="font-semibold mb-4">
            Hora
        </Typography>
    ), [])

    const leavingDateInputMemo = React.useMemo(() => (
        <DesktopDatePicker
            className="input w12 md:mb-0"
            inputFormat="DD/MM/YYYY"
            label="Data de saida"
            minDate={initialDate}
            mask="__/__/____"
            onChange={changeHandler(setLeavingDate)}
            renderInput={(params) => <TextField {...params} />}
            value={leavingDate}
        />
    ), [ changeHandler, leavingDate, setLeavingDate ])

    const leavingHourInputMemo = React.useMemo(() => (
        <TimePicker
            ampm={false}
            className="input w12 md:mb-0"
            openTo="hours"
            views={['hours', 'minutes', 'seconds']}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            minTime={entranceHour}
            label="Hora de saida"
            value={leavingHour}
            onChange={changeHandler(setLeavingHour)}
            renderInput={(params) => <TextField {...params} />}
        />
    ), [ changeHandler, entranceHour, leavingHour, setLeavingHour ])

    const roomTableMemo = React.useMemo(() => (
        getRoom() ? (
            <Table 
                classes={{ root: "mb-4", tableFooter: "hidden" }}
                data={[ getRoom() ]}
                headers={headers}
                onRemove={removeRoomHandler}
            />
        ) : <></>
    ), [ getRoom, removeRoomHandler ]);

    const roomSearchFieldMemo = React.useMemo(() => <RoomSearchField />, [])

    return (
        <div className="flex flex-col grow justify-between">
            <div>
                { roomSearchFieldMemo }
                { roomTableMemo }
                <div className="flex flex-wrap justify-between">
                    <div className="border border-solid border-stone-200 w12">
                        <fieldset className="py-3 px-2 md:p-4">
                            { dateTitleMemo }
                            <div className="flex flex-wrap justify-between">
                                { entranceDateInputMemo }
                                { leavingDateInputMemo }
                            </div>
                        </fieldset>
                        <fieldset className="pb-3 px-2 md:p-4 md:pt-0">
                            { hourTitleMemo }
                            <div className="flex flex-wrap justify-between">
                                { entranceHourInputMemo }
                                { leavingHourInputMemo }
                            </div>
                        </fieldset>
                    </div>
                    { clientDetailsMemo }
                </div>
            </div>
            <div className="flex flex-col items-stretch mt-6 sm:items-end md:mt-20">
                <Paper
                    className={classNames(classes.checkout, "bg-gray-300 py-3 px-2 sm:p-4")}
                    elevation={0}>
                    <Typography className="flex justify-between ">
                        <span className="">Total preco por hora</span>
                        <span className="font-bold text-lg md:text-xl">{ hourlyPriceMemo } MT</span>
                    </Typography>
                    <Typography className="flex justify-between my-3">
                        <span className="">Preco por dia</span>
                        <span className="font-bold text-lg md:text-xl">{ dailyPriceMemo } MT</span>
                    </Typography>
                    <Typography className="flex justify-between">
                        <span className="">Total</span>
                        <span className="font-bold text-lg md:text-xl">{ totalPrice } MT</span>
                    </Typography>
                </Paper>
            </div>
        </div>
    );
};

export default HomeContainer;