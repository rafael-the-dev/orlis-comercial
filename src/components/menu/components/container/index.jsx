import * as React from "react";
import { Avatar, Button, IconButton, Typography} from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';

import Link from "src/components/link";
import ListItem from "../list-item";

const Container = () => {
    const [ open, setOpen ] = React.useState(false);

    const toggle = React.useCallback(() => setOpen(b => !b), []);

    React.useEffect(() => {
        if(open) {
            document.querySelector("body").classList.add("open-side-bar");
        } else {
            document.querySelector("body").classList.remove("open-side-bar");
        }
    }, [ open ])

    return (
        <aside 
            className={classNames(classes.container, "bg-stone-100 flex flex-col h-screen justify-between overflow-hidden pl-5 pb-6 xl:pl-4",
            { [classes.containerOpen]: open })}>
            <div>
                <div className="pr-5 py-4 rounded-full lg:py-3">
                    <Link 
                        className="text-lg sm:text-xl md:text-2xl text-white uppercase"
                        href="/">
                        <Avatar
                            className={classNames(classes.avatar, "bg-stone-800")}>
                            <NightShelterIcon />
                        </Avatar>
                    </Link>
                </div>
                <ul className="py-3 lg:pt-6">
                    <ListItem 
                        classes={{ button: "text-black" }} href="/">
                        <HomeIcon /> <span className={classNames(classes.label, { [classes.labelOpen]: open })}>Home</span>
                    </ListItem>
                    <ListItem 
                        classes={{ button: "text-black" }} href="/sales">
                        <ShoppingCartIcon /> <span className={classNames(classes.label, { [classes.labelOpen]: open })}>Vendas</span>
                    </ListItem>
                    <ListItem 
                        classes={{ button: "text-black" }} href="/warehouse?tab=stock">
                        <ReceiptLongIcon /> <span className={classNames(classes.label, { [classes.labelOpen]: open })}>Stock</span>
                    </ListItem>
                    <ListItem 
                        classes={{ button: "text-black" }} href="/payments">
                        <PaidIcon /> <span className={classNames(classes.label, { [classes.labelOpen]: open })}>Pagamentos</span>
                    </ListItem>
                    <ListItem 
                        classes={{ button: "text-black" }}>
                        <TimelineIcon /> <span className={classNames(classes.label, { [classes.labelOpen]: open })}>Home</span>
                    </ListItem>
                </ul>
            </div>
            <div >
                <Button
                    className={classNames(classes.button, "bg-slate-300 hidden xl:flex hover:bg-slate-400", { [classes.buttonOpen]: open})}
                    onClick={toggle}>
                    { open ? <ArrowBackIcon /> : <ArrowForwardIcon /> }
                </Button>
            </div>
        </aside>
    );
};

export default Container;