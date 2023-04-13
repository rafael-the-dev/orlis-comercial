import * as React from "react";
import classNames from "classnames";

import SaveIcon from '@mui/icons-material/Save';

import classes from "./styles.module.css";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import CancelButton from "src/components/cancel-link";
import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from "src/components/primary-button";
import TextField from "src/components/default-input";

const isValidText = (text) => {
    const pattern = new RegExp("^[A-z]{2,}[0-9]*", "g");

    return pattern.test(text);
};

const CreateProvider = ({ onOpen, onSuccess, setSupplierIdRef }) => {
    const [ address, setAddress ] = React.useState("");
    const [ supplierId, setSupplierId ] = React.useState(null);
    const [ name, setName ] = React.useState("");
    const [ loading, setLoading ] = React.useState(false);

    const hasServerErrors = React.useRef(false);
    const loadingRef = React.useRef(false);
    const nuitRef = React.useRef(null);
    const onClose = React.useRef(null);
    
    const setDialogMessage = React.useRef(null);

    const closeHandler = React.useCallback(() => {
        if(loadingRef.current) return;

        onClose.current?.();
        setSupplierId(null);
    }, []);

    const changeHandler = React.useCallback(func => e => func(e.target.value), []);

    const closeDialogHelper = React.useCallback(() => {
        if(hasServerErrors.current) return;

        nuitRef.current.value = "";
        setAddress("");
        setName("");
        setSupplierId(null);
    }, [])

    const addressError = React.useMemo(() => !isValidText(address), [address]);

    const addressFieldMemo = React.useMemo(() => (
        <TextField 
            className="input"
            error={addressError}
            helperText={addressError ? "This field is requiered" : ""}
            label="Address"
            multiline
            minRows={6}
            onChange={changeHandler(setAddress)}
            required
            value={address}
        />
    ), [ address, addressError, changeHandler ]);

    const cancelButtonMemo = React.useMemo(() => <CancelButton classes={{ button: "mr-4" }} onClick={closeHandler} />, [ closeHandler ])

    const dialogHeaderMemo = React.useMemo(() => (
        <DialogHeader
            classes={{ root: "bg-neutral-800 pl-3 text-white" }}
            onClose={closeHandler}>
            Register new supplier
        </DialogHeader>
    ), [ closeHandler ]);

    const messageDialogMemo = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeDialogHelper}
            setDialogMessage={setDialogMessage}
        />
    ), [ closeDialogHelper ])

    const nameError = React.useMemo(() => !isValidText(name), [ name ])

    const nameFieldMemo = React.useMemo(() => (
        <TextField 
            className="input"
            error={nameError}
            helperText={nameError ? "This field is requiered" : ""}
            label="Name"
            onChange={changeHandler(setName)}
            required
            value={name}
        />
    ), [ changeHandler, name, nameError ])

    const nuitFieldMemo = React.useMemo(() => (
        <TextField 
            className="input"
            inputRef={nuitRef}
            label="NUIT"
        />
    ), []);

    const hasError = React.useMemo(() => (addressError || nameError), [ addressError, nameError ])

    const submitHandler = async (e) => {
        e.preventDefault();

        if(hasError || loading) return;

        hasServerErrors.current = true;

        loadingRef.current = true;
        setLoading(true);

        const options =  {
            ...getAuthorizationHeader(),
            body: JSON.stringify({
                address, name, nuit: nuitRef.current.value
            }),
            method: Boolean(supplierId) ? "PUT" : "POST"
        }

        try {
            const res = await fetch(`/api/stock-providers/${supplierId ?? ""}`, options);

            const { status } = res;

            if(status >= 300 || status < 200) throw new Error();

            hasServerErrors.current = false;

            Boolean(onSuccess) && onSuccess();

            setDialogMessage.current?.({
                description: `Supplier was successfully ${Boolean(supplierId) ? "updated" : "registered"}`,
                title: "Success",
                type: "success"
            });
        }
        catch(e) {
            console.error(e);
            setDialogMessage.current?.({
                description: `Supplier was not ${Boolean(supplierId) ? "updated" : "registered"}/n/n${e.message}`,
                title: "Error",
                type: "error"
            });
        }
        finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    const fetchData = React.useCallback(async () => {
        try {
            const options =  {
                ...getAuthorizationHeader()
            };

            const data = await fetchHelper({ options, url: `/api/stock-providers/${supplierId}`});
            const { address, name, nuit } = data;

            nuitRef.current.value = nuit;
            setAddress(address);
            setName(name);
        }
        catch(e) {
            console.error(e)
        }
    }, [ supplierId ]);

    React.useEffect(() => {
        if(Boolean(supplierId)) {
            fetchData();
        }
    }, [ fetchData, supplierId ]);

    React.useEffect(() => {
        if(setSupplierIdRef) {
            setSupplierIdRef.current = newId => setSupplierId(newId);
        }
    }, [ setSupplierIdRef ]);

    return (
        <>
            <Dialog
                classes={{ paper: classNames(classes.paper, `mx-auto rounded-none`)}}
                onClose={onClose}
                onOpen={onOpen}
                customClose={closeHandler}>
                { dialogHeaderMemo }
                <form 
                    className={classNames("flex flex-col justify-between py-4 px-5 xl:px-6")}
                    onSubmit={submitHandler}>
                    <div>
                        { nameFieldMemo }
                        { nuitFieldMemo }
                        { addressFieldMemo }
                    </div>
                    <div className="flex justify-end md:mt-6">
                        { cancelButtonMemo }
                        <PrimaryButton 
                            disabled={ hasError }
                            startIcon={<SaveIcon />}
                            type="submit">
                            { loading ? "Loading..." : ( Boolean(supplierId) ? "Update" : "Save" ) }
                        </PrimaryButton>
                    </div>
                </form>
                { messageDialogMemo }
            </Dialog>
        </>
    );
};

export default CreateProvider;