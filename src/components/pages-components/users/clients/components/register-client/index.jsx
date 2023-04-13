import * as React from "react";
import classNames from "classnames";

import SendIcon from "@mui/icons-material/Send"

import classes from "./styles.module.css";

import { getAuthorizationHeader } from "src/helpers/queries"
import { ComponentsContext } from "src/context"

import DeleteButton from "src/components/cancel-link";
import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import DocumentsSelect from "src/components/documents-select";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from "src/components/primary-button";
import TextField from "src/components/default-input";

const defaultStateValue = { error: false, value: "" };

const RegisterClieDialog  = ({ refreshClientsData })  => {
    const { dialog, setDialog } = React.useContext(ComponentsContext);

    const [ address, setAddress ] = React.useState(defaultStateValue);
    const [ document, setDocument ] = React.useState(defaultStateValue);
    const [ documentNumber, setDocumentNumber ] = React.useState(defaultStateValue);
    const [ firstName, setFirstName ] = React.useState(defaultStateValue);
    const [ lastName, setLastName ] = React.useState(defaultStateValue);

    const [ deleteLoading, setDeleteLoading ] = React.useState(false);
    const [ loading, setLoading ] = React.useState(false);

    const hasResponseError = React.useRef(null);
    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);
    const setDialogMessage = React.useRef(null);

    const changeHandler = React.useCallback(fn => {
        return ({ target: { value }}) => {
            fn({ error: !Boolean(value.trim()), value })
        }
    }, [])

    const closeHandler = React.useCallback(() => {
        if(deleteLoading || loading) return;

        setDialog(null);
    }, [ deleteLoading, loading, setDialog ]);

    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const closeHelper = React.useCallback(() => {
        if(hasResponseError.current) return;

        closeHandler();
    }, [ closeHandler ]);

    const canISubmit = React.useMemo(() => {
        return !Boolean([ address, document, documentNumber, firstName, lastName ].find(item => item.error));
    }, [ address, document, documentNumber, firstName, lastName ])

    const messageDialog = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessage}
        />
    ), [ closeHelper ]);

    const addressInput = React.useMemo(() => (
        <TextField 
            { ...address }
            className="input"
            label="Address"
            multiline
            minRows={5}
            onChange={changeHandler(setAddress)}
        />
    ), [ address, changeHandler ])

    const documentInput = React.useMemo(() => (
        <DocumentsSelect
            { ...document }
            className="input w12"
            label="Document"
            onChange={changeHandler(setDocument)}
        />
    ), [ changeHandler, document ]);

    const documentNumberInput = React.useMemo(() => (
        <TextField 
            { ...documentNumber }
            className="input w12"
            label="Document Number"
            onChange={changeHandler(setDocumentNumber)}
            required={Boolean(document)}
        />
    ), [ document, documentNumber, changeHandler ])

    const firstNameInput = React.useMemo(() => (
        <TextField 
            { ...firstName }
            className="input w12"
            label="First name"
            onChange={changeHandler(setFirstName)}
            required
        />
    ), [ firstName, changeHandler ]);

    const lastNameInput = React.useMemo(() => (
        <TextField 
            { ...lastName }
            className="input w12"
            label="Last name"
            onChange={changeHandler(setLastName)}
            required
        />
    ), [ lastName, changeHandler ]);

    const isClient = React.useMemo(() => typeof dialog === "object", [ dialog ]);

    const deleteHandler = React.useCallback(async () => {
        // leave the function previous request is still processing
        try {
            setDeleteLoading(currentState => {
                if(currentState) throw new Error();

                return true;
            });
        }
        catch(e) {
            return;
        }

        let responseMessage = null;

        try {
            const options = {
                ...getAuthorizationHeader(),
                method: "DELETE"
            };

            const { status } = await fetch(`/api/clients/${dialog.id}`, options);

            if(status >= 300 || status < 200) throw new Error("");

            hasResponseError.current = false;

            responseMessage = {
                description: "Client was successfully deleted.",
                type: "success",
                title: "Success"
            };

            await refreshClientsData();
        }
        catch(e) {
            console.error(e);

            responseMessage = {
                description: "Client was not deleted.",
                type: "error",
                title: "Error"
            }
        }
        finally {
            Boolean(responseMessage) && setDialogMessage.current?.(responseMessage);

            setDeleteLoading(false);
        }
    }, [ dialog, refreshClientsData ])

    const deleteButtonMemo = React.useMemo(() => (
        <DeleteButton
            classes={{ button: "mr-3" }}
            hideIcon
            onClick={deleteHandler}
            variant="outlined">
            { deleteLoading ? "Deleting..." : "Delete"}
        </DeleteButton>
    ), [ deleteLoading, deleteHandler ])

    const submitHandler = async (e) => {
        e.preventDefault();

        if(loading) return;

        setLoading(true);
        let responseMessage = null;
        hasResponseError.current = true;

        try {
            const options = {
                ...getAuthorizationHeader(),
                body: JSON.stringify(
                    {
                        address: address.value,
                        document: document.value, 
                        documentNumber: documentNumber.value,
                        firstName: firstName.value,
                        lastName: lastName.value
                    }
                ),
                method: isClient ? "PUT" : "POST"
            };

            const { status } = await fetch(`/api/clients/${isClient ? dialog.id : ""}`, options);

            if(status >= 300 || status < 200) throw new Error("");

            hasResponseError.current = false;

            responseMessage = {
                description: "Client was successfully registered.",
                type: "success",
                title: "Success"
            };

            await refreshClientsData();
        }
        catch(e) {
            console.error(e);

            responseMessage = {
                description: "Client was not registered.",
                type: "error",
                title: "Error"
            }
        }
        finally {
            Boolean(responseMessage) && setDialogMessage.current?.(responseMessage);

            setLoading(false);
        }
    };

    React.useEffect(() => {
        openHandler();
    }, [ openHandler ]);

    React.useEffect(() => {
        if(isClient) {
            setAddress({ error: false, value: dialog.address });
            setDocument({ error: false, value: dialog.document });
            setDocumentNumber({ error: false, value: dialog.documentNumber });
            setFirstName({ error: false, value: dialog.firstName });
            setLastName({ error: false, value: dialog.lastName });
        }
    }, [ dialog, isClient ])
    
    return (
        <>
            <Dialog
                classes={{ paper: classNames(classes.paper, 'm-0') }}
                customClose={closeHandler}
                onClose={onClose}
                onOpen={onOpen}>
                <DialogHeader
                    classes={{ root: "bg-stone-700 pl-3 text-white" }}
                    onClose={closeHandler}>
                    Register Expense
                </DialogHeader>
                <form className={classNames(classes.form, `flex flex-col justify-between overflow-y-auto 
                    px-3 py-6 md:px-8 md:pt-12`)}>
                    <div>
                        <div className="flex flex-wrap justify-between">
                            { firstNameInput }
                            { lastNameInput }
                        </div>
                        <div className="flex flex-wrap justify-between">
                            { documentInput }
                            { documentNumberInput }
                        </div>
                        { addressInput }
                    </div>
                    <div className='flex justify-end mt-8'>
                        { isClient && deleteButtonMemo }
                        <PrimaryButton
                            disabled={!canISubmit}
                            endIcon={ loading ? <></> : <SendIcon /> }
                            onClick={submitHandler}
                            type={"submit"}>
                            { loading ? "Loading...": "Submit" }
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>
            { messageDialog }
        </>
    );
};

export default RegisterClieDialog;