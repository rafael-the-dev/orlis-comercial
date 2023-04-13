import * as React from "react";
import classNames from "classnames";

import classes from "./styles.module.css";

import { getAuthorizationHeader } from "src/helpers/queries";

import CancelButton from "src/components/cancel-link";
import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from "src/components/primary-button";
import TextField from "src/components/default-input";

const RegisterClass = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ value, setValue ] = React.useState("");

    const hasResposeError = React.useRef(false);
    const loadingRef = React.useRef(false);
    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);
    const setDialogMessageRef = React.useRef(null);

    const closeHandler = React.useCallback(() => {
        if(loadingRef.current) return;
        onClose.current?.();
    }, []);
    const changeHandler = React.useCallback(({ target: { value }}) => setValue(value), []);
    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const closeHelper = React.useCallback(() => {
        loadingRef.current = false;
        setLoading(false);

        if(hasResposeError.current) return;

        setValue("");
    }, []);

    const activeTextfield = React.useMemo(() => (
        <TextField 
            className="input w12"
            inputProps={{ readOnly: true }}
            label="Estado"
            value="ACTIVO"
        />
    ), [])

    const cancelButtonMemo = React.useMemo(() => (
        <CancelButton classes={{ button: "mr-3" }} onClick={closeHandler} />
    ), [ closeHandler ])

    const dialogHeader = React.useMemo(() => (
        <DialogHeader 
            classes={{ root: "bg-neutral-700 pl-3 text-white" }}
            onClose={closeHandler}
            >
            Cadastrar nova classe
        </DialogHeader>
    ), [ closeHandler ])

    const registerButton = React.useMemo(() => (
        <PrimaryButton
            classes={{ button: "my-4 md:my-0 md:mx-4" }}
            onClick={openHandler}
            variant="outlined">
            Registar nova classe
        </PrimaryButton>
    ), [ openHandler ])

    const messageDialogMemo = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessageRef}
        />
    ), [ closeHelper ]);

    const submitHandler = e => {
        e.preventDefault();

        if(loading) return;

        hasResposeError.current = true;
        loadingRef.current = true;
        setLoading(true);

        const options = {
            ...getAuthorizationHeader(),
            body: JSON.stringify({ description: value }),
            method: "POST"
        };

        fetch('/api/rooms-classes', options)
            .then(({ status }) => {
                if((status >= 300) || ( status < 200)) throw new Error();

                hasResposeError.current = false;
                setDialogMessageRef.current?.({
                    description: "Classe registado com sucesso",
                    title: "Success",
                    type: "success"
                });
            })
            .catch(err => {
                console.error(err);

                setDialogMessageRef.current?.({
                    description: "Error ao registar a classe",
                    title: "Error",
                    type: "error"
                });
            })
    }

    return (
        <>
            { registerButton }
            <Dialog
                classes={{ paper: classNames(classes.dialogPaper, "m-0") }}
                customClose={closeHandler}
                onClose={onClose}
                onOpen={onOpen}>
                { dialogHeader }
                <form
                    className="px-5 py-6"
                    onSubmit={submitHandler}>
                    <div className="flex flex-wrap justify-between">
                        <TextField 
                            className="input w12"
                            label="Descricao"
                            onChange={changeHandler}
                            required
                            value={value}
                        />
                        { activeTextfield }
                    </div>
                    <div className="flex justify-end mt-4">
                        { cancelButtonMemo }
                        <PrimaryButton 
                            disabled={!Boolean(value.trim())}
                            type="submit">
                            { loading ? "Loading..." : "Submeter" }
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>
            { messageDialogMemo }
        </>
    );
};

export default RegisterClass;