import * as React from "react";
import { Button, Paper, Typography } from "@mui/material"
import classNames from "classnames";

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SaveIcon from '@mui/icons-material/Save';

import classes from "./styles.module.css";

import { AddStockContext } from "src/context";

import Content from "src/components/scroll-container";
import CancelLink from "src/components/cancel-link";
import Input from "src/components/default-input";
import Link from "src/components/link";
import Main from "src/components/main";
import MessageDialog from "src/components/message-dialog";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button";


import { AddProduct, NewStockList, ReferenceCodeInput, StockProviders } from "src/components/add-stock-page";

const Container = () => {
    const { hasErrors, reset, refreshProductsRef, toLiteral } = React.useContext(AddStockContext);

    const [ loading, setLoading ] = React.useState(false);

    const hasErrorsRef = React.useRef(false);

    const addProductMemo = React.useMemo(() => <AddProduct />, []);
    const newStockListMemo = React.useMemo(() => <NewStockList />, []);
    const stockProvidersMemo = React.useMemo(() => <StockProviders />, []);

    const homeMemo = React.useMemo(() => <CancelLink href="/warehouse?tab=stock">Voltar</CancelLink>, []);
    
    const setMessageDialog = React.useRef(null);

    const closeHelper = React.useCallback(() => {
        if(hasErrorsRef.current) return;

        reset();
    }, [ reset ])

    const messageDialogMemo = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setMessageDialog}
        />
    ), [ closeHelper ])
    
    const clickHandler = async () => {
        if(loading) return;

        setLoading(true);
        hasErrorsRef.current = false;

        const options = {
            body: JSON.stringify(toLiteral),
            headers: {
                "Authorization": JSON.parse(localStorage.getItem(process.env.LOCAL_STORAGE)).user.token
            },
            method: "POST"
        };

        try {
            const res = await fetch("/api/stock-providers-invoices", options);
            const { status } = res;
            
            if(status >= 300 || status < 200) {
                throw new Error();
            }

            setMessageDialog.current?.({
                description: "Adicionado com successo",
                title: "Sucesso",
                type: "success"
            });
            setLoading(false);
            refreshProductsRef.current?.();
        } catch(e) {
            console.error(e);
            hasErrorsRef.current = true;
            setMessageDialog.current?.({
                description: "Error ao adicionar",
                title: "Error",
                type: "error"
            });
            setLoading(false);
        }
    };

    return (
        <Main>
            <Panel component="h1" title="Add new stock" />
            <Content component="form">
                <div>
                    <div className="flex flex-wrap justify-between">
                        <ReferenceCodeInput />
                        { stockProvidersMemo }
                        { addProductMemo }
                    </div>
                    { newStockListMemo }
                </div>
                <div className="flex flex-col items-end justify-between mt-12 xl:flex-row-reverse">
                    <Paper 
                        className={classNames(classes.paper, "bg-stone-200 py-4 px-3")}
                        elevation={0}>
                        <Typography
                            className="flex items-end justify-between mb-3">
                            <span className="font-semibold text-base uppercase">Iva</span>
                            <span className="font-bold text-xl xl:text32xl">{ toLiteral.products.stats.totalVAT } MT</span>
                        </Typography>
                        <Typography
                            className="flex items-end justify-between mb-3">
                            <span className="font-semibold text-base">subTotal</span>
                            <span className="font-bold text-xl xl:text32xl">{ toLiteral.products.stats.subTotal } MT</span>
                        </Typography>
                        <Typography
                            className="flex items-end justify-between">
                            <span className="font-semibold text-base">Total</span>
                            <span className="font-bold text-xl xl:text32xl">{ toLiteral.products.stats.total } MT</span>
                        </Typography>
                    </Paper>
                    <div className="flex items-stretch jsutify-between">
                        { homeMemo }
                        <PrimaryButton
                            classes={{ button: "ml-4" }}
                            disabled={hasErrors}
                            onClick={clickHandler}
                            startIcon={<SaveIcon />}>
                            { loading ? "Loading..." : "Guardar" }
                        </PrimaryButton>
                    </div>
                </div>
            </Content>
            { messageDialogMemo }
        </Main>
    );
};

export default Container;