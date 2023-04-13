import * as React from "react";
import Button from "@mui/material/Button";
import classNames from "classnames";

import classes from "./styles.module.css";

import { SaleContext, SalesContext } from "src/context"

import BarmenList from "./components/barmen-list";
import CancelButton from "src/components/cancel-link"
import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import PrimaryButton from "src/components/primary-button";
import Tables from "./components/tables-list"

const AddTable = () => {
    const { getTable } = React.useContext(SaleContext);
    const { setSelectedTable } = React.useContext(SalesContext)

    const [ barman, setBarman ] = React.useState(null);
    const [ table, setTable ] = React.useState(null);
    
    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);

    const closeHandler = React.useCallback(() => onClose.current?.(), []);
    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const addHandler = React.useCallback(() => {

        setTable(currentTable => {
            getTable().id = currentTable.id;
            getTable().name = currentTable.description;
            setSelectedTable(tables => [ ...tables, currentTable.id ]);
            return null
        });

        setBarman(currentBarman => {
            getTable().waiter = currentBarman;
            return null
        });

        closeHandler()
    }, [ closeHandler, getTable, setSelectedTable ])

    const cancelButtonMemo = React.useMemo(() => (
        <CancelButton
            classes={{ button: "mr-3" }}
            onClick={closeHandler}>
            Cancelar
        </CancelButton>
    ), [ closeHandler ])

    return (
        <>
            <Button
                className="bg-blue-500 mr-3 hover:bg-blue-700"
                onClick={openHandler}
                variant="contained">
                Avancado
            </Button>
            <Dialog
                classes={{ paper: classes.paper }}
                onClose={onClose}
                onOpen={onOpen}>
                <DialogHeader
                    classes={{ root: "bg-neutral-700 text-white pl-3" }}
                    onClose={closeHandler}>
                    Adicionar mesa
                </DialogHeader>
                <div className={classNames("py-4 px-4")}>
                    <div className="flex flex-wrap justify-between">
                        <Tables table={table} setTable={setTable} />
                        <BarmenList 
                            barman={barman}
                            setBarman={setBarman}
                        />
                    </div>
                    <div className="flex justify-end mt-8">
                        { cancelButtonMemo }
                        <PrimaryButton
                            disabled={!Boolean(barman) || !Boolean(table)}
                            onClick={addHandler}>
                            Adicionar
                        </PrimaryButton>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default AddTable;