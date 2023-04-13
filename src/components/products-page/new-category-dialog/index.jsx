import * as React from "react";
import classNames from "classnames";

import classes from "./styles.module.css";

import { getCategories } from "src/helpers/queries"

import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from "src/components/primary-button";
import TextField from "src/components/default-input";

const CategoryDialog = ({ setCategories }) => {
    const [ description, setDescription ] = React.useState("");
    const [ loading, setLoading ] = React.useState(false);
    const [ type, setType ] = React.useState("");

    const descriptionRef = React.useRef(null);
    const setDialogMessage = React.useRef(null);
    const typeRef = React.useRef(null);

    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);
    
    const closeHandler = React.useCallback(() => {
        if(loading) return;

        onClose.current?.();
    }, [ loading ]);
    const clickHandler = React.useCallback(() => onOpen.current?.(), []);

    const changeHandler = React.useCallback(func => e => func(e.target.value), []);

    const submitHandler = React.useCallback(e => {
        e.preventDefault();

        try {
            setLoading(isLoading => {
                if(isLoading) throw new Error();

                return true;
            });

            const headers = {
                "Authorization": JSON.parse(localStorage.getItem(process.env.LOCAL_STORAGE)).user.token
            };

            const options = {
                body: JSON.stringify({ description: descriptionRef.current.value, type: typeRef.current.value }),
                headers,
                method: "POST"
            }

            fetch("/api/categories", options)
                .then(async res => {
                    const { status } = res;
                    if((status >= 300) || (status < 200)) throw new Error();

                    setDialogMessage.current?.({ 
                        description: `Category was successfully registered.`,
                        type: "success",
                        title: "Success"
                    });

                    await getCategories({ options: { headers }})
                        .then(data => setCategories(data));

                        
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setDialogMessage.current?.({ 
                        description: `Category was not registered.`,
                        type: "error",
                        title: "Error"
                    });
                    setLoading(false);
                })
        } catch(e) {

        }
    }, [ setCategories ])

    const buttonMemo = React.useMemo(() => (
        <PrimaryButton
            classes={{ button: "mr-3 w-full sm:w-auto" }}
            onClick={clickHandler}
            variant="outlined">
            Add new category
        </PrimaryButton>
    ), [ clickHandler ]);

    const headerMemo = React.useMemo(() => (
        <DialogHeader 
            classes={{ root: "bg-neutral-700 pl-2 text-white" }}
            onClose={closeHandler}>
            Add new category
        </DialogHeader>
    ), [ closeHandler ]);

    const messageDialogCloseHelper = React.useCallback(() => {
        setDescription("");
        setType("");
        onClose.current?.();
    }, [])

    const messageDialogMemo = React.useMemo(() => (
        <MessageDialog 
            closeHelper={messageDialogCloseHelper} 
            setDialogMessage={setDialogMessage}
        />
    ), [ messageDialogCloseHelper ])


    return (
        <>
            { buttonMemo }
            <Dialog
                classes={{ paper: classNames(classes.paper, `m-0`) }}
                customClose={closeHandler}
                onClose={onClose}
                onOpen={onOpen}>
                { headerMemo }
                <form 
                    className="px-4 py-6"
                    onSubmit={submitHandler}>
                    <div className="flex flex-wrap justify-between">
                        <TextField 
                            className="input w12"
                            inputRef={typeRef}
                            label="Type"
                            onChange={changeHandler(setType)}
                            required
                            value={type}
                            variant='outlined'
                        />
                        <TextField 
                            className="input w12"
                            inputRef={descriptionRef}
                            label="Description"
                            onChange={changeHandler(setDescription)}
                            required
                            value={description}
                            variant='outlined'
                        />
                    </div>
                    <div className="flex justify-end">
                        <PrimaryButton
                            disabled={description.length ===  0 || type.length === 0}
                            type="submit">
                            { loading ? "Loading..." : "Submit" }
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>
            { messageDialogMemo }
        </>
    );
};

export default CategoryDialog;