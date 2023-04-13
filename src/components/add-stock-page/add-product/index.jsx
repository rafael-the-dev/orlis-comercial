import * as React from "react";
import classNames from "classnames";
import { Collapse, IconButton, Typography } from "@mui/material";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { AddStockContext } from "src/context"

import { fetchHelper } from "src/helpers/queries"
import Product from "src/models/client/Product"

import Content from "./components/content"

const AddProduct = () => {
    const { refreshProductsRef } = React.useContext(AddStockContext);

    const [ open, setOpen ] = React.useState(true);
    const [ productsList, setProductsList ] = React.useState([]);

    const contentMemo = React.useMemo(() => <Content productsList={productsList} />, [ productsList ])
    const legendMemo = React.useMemo(() => (
        <Typography 
            className="font-bold text-lg xl:text-xl" 
            component="legend">
            Adicionar produto
        </Typography>
    ), []);

    const toggleHandler = React.useCallback(() => setOpen(b => !b), []);

    const fetchData = React.useCallback(async () => {
        try {
            const options = {
                headers: {
                    "Authorization": JSON.parse(localStorage.getItem(process.env.LOCAL_STORAGE)).user.token
                }
            };
            
            const data = await fetchHelper({ url: "/api/stock", options });
            setProductsList(data.map(item => new Product(item)));
        } catch(e) {
            console.error(e)
        }
    }, [])

    React.useEffect(() => {
        refreshProductsRef.current = fetchData;
        fetchData();
    }, [ fetchData, refreshProductsRef ]);

    return (
        <fieldset
            className="border border-solid border-stone-200 px-3 py-4 w-full">
            <div className={classNames("flex items-center justify-between", { "mb-2": open })}>
                { legendMemo }
                <IconButton onClick={toggleHandler}>
                    { open ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                </IconButton>
            </div>
            <Collapse in={open}>
                { contentMemo }
            </Collapse>
        </fieldset>
    );
};

export default AddProduct;