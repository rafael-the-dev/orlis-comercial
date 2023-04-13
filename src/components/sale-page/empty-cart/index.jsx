import Typography from "@mui/material/Typography";

import classes from "./styles.module.css";

import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const EmptyCart = () => {

    return (
        <div className="flex flex-col items-center pt-12">
            <RemoveShoppingCartIcon className={classes.icon} />
            <Typography
                className="font-semibold mt-6 text-xl md:text-2xl"
                component="h2">
                Nenhum produto adicionado ao carrinho
            </Typography>
        </div>
    );
};

export default EmptyCart;