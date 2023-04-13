import * as React from "react";
import currency from "currency.js";
import { Typography } from "@mui/material";
import { useRouter } from "next/router"

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { BookingContext } from "src/context"

import CancelLink from "src/components/cancel-link";
import Form from "src/components/scroll-container";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from 'src/components/primary-button';
import RoomsClassesSelect from "./components/rooms-select"
import Textfield from "src/components/default-input";

const initial = { error: false, value: "" };

const getErrorMessage = error => error ? "Este campo e obrigatorio" : "";

const Container = () => {
    const { roomId, roomsListRef } = React.useContext(BookingContext);

    const [ description, setDescription ] = React.useState(initial);
    const [ dailyPrice, setDailyPrice ] = React.useState(initial);
    const [ hourlyPrice, setHourlyPrice ] = React.useState(initial);
    const [ loading, setLoading ] = React.useState(false);
    const [ number, setNumber ] = React.useState(initial);
    const [ roomClass, setRoomClass ] = React.useState({ descripition: "", error: true, id: "" });

    const router = useRouter();
    //const { query: { roomId } } = router;

    const hasResponseError = React.useRef(null);
    const loadingRef = React.useRef(null);
    const setDialogMessage = React.useRef(null);

    const roomClassChangeHandler = React.useCallback((id, list) => {
        const result = list.find(item => item.id === id);
        
        if(result) setRoomClass({ ...result, error: false });
    }, []);

    const closeHelper = React.useCallback(() => {
        setLoading(false);

        if(hasResponseError.current) return;

        if(roomId) router.push("/rooms")

        setDescription(initial);
        setDailyPrice(initial);
        setHourlyPrice(initial);
        setNumber(initial)
        setRoomClass({ descripition: "", error: true, id: "" })
    }, [ router, roomId ])

    const changeHandler = React.useCallback((func, isNumber) => ({ target: { value }}) => {
        const error = isNumber ? currency(value).value < 0 : !Boolean(value.trim());
        func({ error, value });
    }, []);

    const hasErrors = () => {
        return Boolean([ 
            description, dailyPrice, 
            hourlyPrice, hourlyPrice,
            number
        ].find(item => item.error))
    };

    const cancelLinkMemo = React.useMemo(() => (
        <CancelLink 
            classes={{ button: "mr-4" }} 
            href={ loading ? null : "/" } 
        />
    ), [ loading ])

    const descriptionInputMemo = React.useMemo(() => (
        <Textfield 
            className="input w13"
            error={description.error}
            helperText={getErrorMessage(description.error)}
            label="Descricao"
            onChange={changeHandler(setDescription)}
            required
            value={description.value}
        />
    ), [ description, changeHandler ]);

    const dailyPriceInputMemo = React.useMemo(() => (
        <Textfield 
            className="input w13 md:mb-0"
            error={dailyPrice.error}
            helperText={getErrorMessage(dailyPrice.error)}
            label="Preco por dia"
            onChange={changeHandler(setDailyPrice, true)}
            required
            value={dailyPrice.value}
        />
    ), [ changeHandler, dailyPrice ]);

    const hourlyPriceInputMemo = React.useMemo(() => (
        <Textfield 
            className="input w13 md:mb-0"
            error={hourlyPrice.error}
            helperText={getErrorMessage(hourlyPrice.error)}
            label="Preco por hora"
            onChange={changeHandler(setHourlyPrice, true)}
            required
            value={hourlyPrice.value}
        />
    ), [ changeHandler, hourlyPrice ]);

    const messageDialog = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessage}
        />
    ), [ closeHelper ])

    const numberInputMemo = React.useMemo(() => (
        <Textfield 
            className="input w13"
            error={number.error}
            helperText={getErrorMessage(number.error)}
            label="Numero"
            onChange={changeHandler(setNumber, true)}
            required
            value={number.value}
        />
    ), [ changeHandler, number ])

    const roomsClassesSelectMemo = React.useMemo(() => (
        <RoomsClassesSelect 
            error={roomClass.error}
            helperText={getErrorMessage(roomClass.error)}
            onChange={roomClassChangeHandler}
            value={ roomClass.id } 
        />
    ), [ roomClass, roomClassChangeHandler ]);

    //const titleMemo = React.useMemo(() => <Panel title="Cadastro de quarto" />, [])

    const submitHandler = async e => {
        e.preventDefault();

        if(loading) return;

        setLoading(true);
        hasResponseError.current = true;

        try {
            const options = {
                ...getAuthorizationHeader(),
                body: JSON.stringify({
                    description: description.value,
                    dailyPrice: dailyPrice.value,
                    hourlyPrice: currency(hourlyPrice.value).value,
                    number: currency(number.value).value,
                    roomClassId: roomClass.id
                }),
                method: roomId ? "PUT" : "POST"
            };

            const { status } = await fetch(`/api/rooms/${ roomId ?? "" }`, options);

            if(status >= 300 || status < 200) throw new Error();

            hasResponseError.current = false;

            //add null to rooms list, so it can refresh on rooms component mounted
            roomsListRef.current = null;

            setDialogMessage.current?.({
                description: `Quarto ${ roomId ? "atualizado" : "registado" } com sucesso`,
                type: "success",
                title: 'Success'
            })

        } catch(e) {
            console.error(e)
            setDialogMessage.current?.({
                description: `Erro ao ${ roomId ? "atualizar" : "registar" } quarto`,
                type: "error",
                title: 'Error'
            })
        }
    };

    const fetchRoom = React.useCallback(async id => {
        try {
            const options = getAuthorizationHeader();

            const result = await fetchHelper({ options, url: `/api/rooms/${id}` });
            
            setDescription({ ...initial, value: result.description });
            setDailyPrice({ ...initial, value: result.dailyPrice });
            setHourlyPrice({ ...initial, value: result.hourlyPrice });
            setNumber({ ...initial, value: result.number })
            setRoomClass({ descripition: "", error: false, id: result.classId })
        }
        catch(e) {
            console.error(e)
        }
    }, [])

    React.useEffect(() => {
        if(roomId) {
            fetchRoom(roomId)
        }
    }, [ fetchRoom, roomId ])

    return (
        <>
            <form
                className="flex flex-col h-full justify-between"
                onSubmit={submitHandler}>
                <div>
                    <div className="flex flex-wrap justify-between">
                        { descriptionInputMemo }
                        { numberInputMemo }
                        { roomsClassesSelectMemo }
                    </div>
                    <fieldset className="border border-solid border-stone-200 px-4 py-6">
                        <Typography
                            className="font-bold text-lg mb-4">
                            Precario
                        </Typography>
                        <div className="flex flex-wrap justify-between">
                            { dailyPriceInputMemo }
                            { hourlyPriceInputMemo }
                            <Textfield 
                                className="input w13 mb-0"
                                label="Hora de saida"
                                required
                            />
                        </div>
                    </fieldset>
                </div>
                <div
                    className="flex justify-end">
                    { cancelLinkMemo }
                    <PrimaryButton
                        disabled={hasErrors()}
                        type="submit">
                        { loading ? "Loading..." : ( roomId ? "Atualizar" : "Submeter" ) }
                    </PrimaryButton>
                </div>
            </form>
            { messageDialog }
        </>
    );
};

export default Container;