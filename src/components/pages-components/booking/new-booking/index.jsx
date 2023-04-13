import * as React from "react";
import classNames from "classnames";
import currency from "currency.js"
import moment from "moment";

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Paper, Typography } from "@mui/material";

import classes from "./styles.module.css";

import { BookingContext } from "src/context/BookingContext";
import { NewBookingContext } from "src/context/BookingContext/context/NewBookingContext";
import { 
    isEndDateValid,
    isEndHourValid, 
    isStartDateValid,
    isStartHourValid 
} from "src/context/BookingContext/context/NewBookingContext/validation"

import Content from "src/components/scroll-container";
import CancelButton from "src/components/cancel-link";
import ClientDetails from "./components/client-details";
import MessageDialog from "src/components/message-dialog"
import PrimaryButton from "src/components/primary-button";
import RoomSearchField from "./components/room-search-field"
import TextField from "src/components/default-input";
import Table from "src/components/default-table";

const initialDate = moment(Date.now());

const toDateTime = ({ date, time }) => {
    return moment(`${date.format("YYYY-MM-DD")} ${time.format("HH:mm")}`);
};

const HomeContainer = () => {
    const { bookedRoomsListRef } = React.useContext(BookingContext);
    const { 
        addRoom,
        entranceDate, entranceHour,
        getRoom,
        hasErrors,
        leavingDate, leavingHour,
        reset,
        setEntranceDate, setEntranceHour, setLeavingDate, setLeavingHour, submitHelper
    } = React.useContext(NewBookingContext);

    const [ loading, setLoading ] = React.useState(false)

    const headers = React.useRef([
        { label: "Descricao", value: "description" },
        { label: "Numero", value: "number" },
        { label: "Preco por dia", value: "dailyPrice" },
        { label: "Preco por hora", value: "hourlyPrice" },
        { label: "Remover", value: "delete" },
    ]);

    const hasResponseError = React.useRef(null);
    const setDialogMessageRef = React.useRef(null);
    
    const hourlyPriceMemo = React.useMemo(() => {
        if(!getRoom()) return 0;

        let endDateTime = leavingHour.value;
        let startDateTime = entranceHour.value;

        const formatDate = date => date.format("YYYY/MM/DD");
        
        // this will use same date to get hourly price if the dates are different 
        if(formatDate(entranceDate.value) !== formatDate(leavingDate.value)) {
            endDateTime = moment(`2023/02/22 ${endDateTime.format("HH:mm")}`);
            startDateTime = moment(`2023/02/22 ${startDateTime.format("HH:mm")}`);
        }

        const x = moment.duration(startDateTime).asMinutes();
        const y = moment.duration(endDateTime).asMinutes();

        const minutes = currency(y).subtract(x).value;
        return currency(getRoom().hourlyPrice).multiply(minutes).divide(60).value;
    }, [ entranceDate, entranceHour, getRoom, leavingDate, leavingHour ]);

    const dailyPriceMemo = React.useMemo(() => {
        if(!getRoom()) return 0;

        const x = moment.duration(entranceDate.value).asDays();
        const y = moment.duration(leavingDate.value).asDays();

        const days = currency(y).subtract(x).value;

        return currency(getRoom().dailyPrice).multiply(days).value;
    }, [ entranceDate, getRoom, leavingDate ]);
    
    const totalPrice = React.useMemo(() => {
        if(hourlyPriceMemo < 0) return 0;

        return hourlyPriceMemo + dailyPriceMemo;
    }, [ dailyPriceMemo, hourlyPriceMemo ]);

    // event handlers

    const entranceHourChangeHandler = React.useCallback((newDate) => {
        const datetime = toDateTime({ date: entranceDate.value, time: newDate });
        
        setEntranceHour({ error: !isStartHourValid(datetime), value: datetime });
    }, [ entranceDate, setEntranceHour ]);

    const entranceDateChangeHandler = React.useCallback((newDate) => {
        setEntranceDate({ error: !isStartDateValid(newDate), value: newDate });
        
        // re-validate start hour if start date changes
        setEntranceHour(currentHour => {
            const datetime = toDateTime({ date: newDate, time: currentHour.value });

            return { 
                error: !isStartHourValid(datetime),
                value: datetime
            };
        });
    }, [ setEntranceDate, setEntranceHour ]);
    
    const endDateChangeHandler = React.useCallback(newDate => {
        setLeavingDate({ error: !isEndDateValid({ endDate: newDate, startDate: entranceDate.value }), value: newDate });
        
        // re-validate end hour if end date changes
        setLeavingHour(currentHour => {
            const datetime = toDateTime({ date: newDate, time: currentHour.value });

            return { 
                error: !isEndHourValid({ endHour: datetime, startHour: entranceHour.value }),
                value: datetime
            };
        })
    }, [ entranceDate, entranceHour, setLeavingDate, setLeavingHour ]);

    const endHourChangeHandler = React.useCallback((endHour) => {
        const datetime = toDateTime({ date: leavingDate.value, time: endHour });

        setLeavingHour({ error: !isEndHourValid({ endHour: datetime, startHour: entranceHour.value }), value: datetime })
    }, [ entranceHour, leavingDate, setLeavingHour ])

    const closeHelper = React.useCallback(() => {
        if(hasResponseError.current) return;

        reset();
    }, [ reset ])

    const clientDetailsMemo = React.useMemo(() => <ClientDetails />, []);

    const removeRoomHandler = React.useCallback(() => () => addRoom(null), [ addRoom ]);

    const dateTitleMemo = React.useMemo(() => (
        <Typography 
            component="h2"
            className="font-semibold mb-4">
            Data
        </Typography>
    ), []);
    
    const entranceDateInputMemo = React.useMemo(() => (
        <DesktopDatePicker
            { ...entranceDate }
            className="input w12 md:mb-0"
            inputFormat="DD/MM/YYYY"
            label="Data de entrada"
            minDate={initialDate}
            mask="__/__/____"
            onChange={entranceDateChangeHandler}
            renderInput={(params) => <TextField {...params} error={entranceDate.error} />}
        />
    ), [ entranceDateChangeHandler, entranceDate ]);

    const entranceHourInputMemo = React.useMemo(() => (
        <TimePicker
            { ...entranceHour }
            ampm={false}
            className="input w12 md:mb-0"
            openTo="hours"
            views={['hours', 'minutes']}
            inputFormat="HH:mm"
            mask="__:__"
            label="Hora de entrada"
            onChange={entranceHourChangeHandler}
            renderInput={(params) => <TextField {...params} error={entranceHour.error} />}
        />
    ), [ entranceHour, entranceHourChangeHandler ]);

    const hourTitleMemo = React.useMemo(() => (
        <Typography 
            component="h2"
            className="font-semibold mb-4">
            Hora
        </Typography>
    ), []);

    const messageDialog = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessageRef}
        />
    ), [ closeHelper ]);

    const leavingDateInputMemo = React.useMemo(() => (
        <DesktopDatePicker
            { ...leavingDate }
            className="input w12 md:mb-0"
            inputFormat="DD/MM/YYYY"
            label="Data de saida"
            minDate={entranceDate.value}
            mask="__/__/____"
            onChange={endDateChangeHandler}
            renderInput={(params) => <TextField {...params} error={leavingDate.error} />}
        />
    ), [ endDateChangeHandler, entranceDate, leavingDate ]);

    const leavingHourInputMemo = React.useMemo(() => (
        <TimePicker
            { ...leavingHour }
            ampm={false}
            className="input w12 md:mb-0"
            openTo="hours"
            views={['hours', 'minutes']}
            inputFormat="HH:mm"
            mask="__:__"
            minTime={entranceHour.value}
            label="Hora de saida"
            onChange={endHourChangeHandler}
            renderInput={(params) => <TextField {...params} error={leavingHour.error} />}
        />
    ), [ endHourChangeHandler, entranceHour, leavingHour ])

    const roomTableMemo = React.useMemo(() => (
        getRoom() ? (
            <Table 
                classes={{ root: "mb-4", tableFooter: "hidden", tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                data={[ getRoom() ]}
                headers={headers}
                onRemove={removeRoomHandler}
            />
        ) : <></>
    ), [ getRoom, removeRoomHandler ]);

    const roomSearchFieldMemo = React.useMemo(() => <RoomSearchField />, []);

    const submitHandler = async (e) => {
        e.preventDefault();

        setLoading(true);
        hasResponseError.current = true;

        try {
            const { status } = await submitHelper();

            if(status >= 300 || status < 200) throw new Error();

            hasResponseError.current = false;

            setDialogMessageRef.current?.({
                description: "Quarto ocupado com sucesso",
                title: "Sucesso",
                type: "success"
            });
            
            //add null to booked rooms list, so it can refresh on booked-rooms component mounted
            bookedRoomsListRef.current = null;
        }
        catch(e) {
            console.error(e);

            setDialogMessageRef.current?.({
                description: "Error ao ocupar o quarto",
                title: "Erro",
                type: "error"
            })
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <form 
            className="flex flex-col h-full justify-between"
            onSubmit={submitHandler}>
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
            <div className="flex justify-end mt-6">
                <PrimaryButton
                    classes={{ button: "ml-3" }}
                    disabled={hasErrors()}
                    type="submit">
                    { loading ? "Loading..." : "Submeter" }
                </PrimaryButton>
            </div>
            { messageDialog }
        </form>
    );
};

export default HomeContainer;