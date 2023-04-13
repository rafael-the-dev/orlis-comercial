import * as React from "react";
import classNames from "classnames";

import SendIcon from "@mui/icons-material/Send"

import classes from "./styles.module.css";

import { getAuthorizationHeader } from "src/helpers/queries"
import { ExpensesContext, RegisterExpenseContext } from "src/context"

import AddItemButtom from "./components/add-button"
import Categories from "./components/categories";
import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import ListItem from "./components/list-item";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from "src/components/primary-button";
import TextField from "src/components/default-input"

const RegisterExpenseDialog  = ()  => {
    const { fetchExpensesData } = React.useContext(ExpensesContext);
    const { canISubmit, category, productsList, setProductsList, totalPrice } = React.useContext(RegisterExpenseContext);

    const [ loading, setLoading ] = React.useState(false);

    const hasResponseError = React.useRef(null);
    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);
    const setDialogMessage = React.useRef(null);

    const closeHandler = React.useCallback(() => {
        onClose.current?.();
        setProductsList([]);
    }, [ setProductsList ]);

    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const categoriesMemo = React.useMemo(() => <Categories />, []);

    const closeHelper = React.useCallback(() => {
        if(hasResponseError.current) return;

        closeHandler();
    }, [ closeHandler ])

    const messageDialog = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessage}
        />
    ), [ closeHelper ])

    const totalPriceInput = React.useMemo(() => (
        <TextField 
            className="input w12"
            inputProps={{ readOnly: true }}
            label="Total price"
            value={totalPrice}
        />
    ), [ totalPrice ]);

    const submitHandler = async () => {
        if(loading) return;

        setLoading(true);
        let responseMessage = null;
        hasResponseError.current = true;

        try {
            const options = {
                ...getAuthorizationHeader(),
                body: JSON.stringify(
                    {
                        category, 
                        products: productsList
                    }
                ),
                method: "POST"
            };

            const { status } = await fetch("/api/expenses", options);

            if(status >= 300 || status < 200) throw new Error("");

            hasResponseError.current = false;

            responseMessage = {
                description: "Expenses were successfully added.",
                type: "success",
                title: "Success"
            };

            await fetchExpensesData();
        }
        catch(e) {
            console.error(e);

            responseMessage = {
                description: "Expenses were not added.",
                type: "error",
                title: "Error"
            }
        }
        finally {
            Boolean(responseMessage) && setDialogMessage.current?.(responseMessage);

            setLoading(false);
        }
    };
    
    return (
        <>
            <PrimaryButton
                onClick={openHandler}>
                Add new expense
            </PrimaryButton>
            <Dialog
                classes={{ paper: classNames(classes.paper, 'm-0') }}
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
                            { totalPriceInput }
                            { categoriesMemo }
                        </div>
                        <div>
                            {
                                productsList.map(item => (
                                    <ListItem { ...item } key={item.id} />
                                ))
                            }
                        </div>
                        <div className="flex justify-center">
                            <AddItemButtom>Add new item</AddItemButtom>
                        </div>
                    </div>
                    <div className='flex justify-end mt-8'>
                        <PrimaryButton
                            endIcon={ loading ? <></> : <SendIcon /> }
                            onClick={submitHandler}
                            type={canISubmit ? "button" : "submit"}>
                            { loading ? "Loading...": "Submit" }
                        </PrimaryButton>
                    </div>
                </form>
            </Dialog>
            { messageDialog }
        </>
    );
};

export default RegisterExpenseDialog;