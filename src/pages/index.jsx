import * as React from "react";
import { Typography } from "@mui/material"
import classNames from "classnames"

import classes from "./styles.module.css";

import WarehouseIcon from "public/images/icons/warehouse.svg"

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import GroupIcon from '@mui/icons-material/Group';
//import LiquorIcon from '@mui/icons-material/Liquor';
import Person2Icon from '@mui/icons-material/Person2';

import { LoginContext } from "src/context";

import { HightlightCard } from "src/components/dashboard-page";

const Home = () => {
    const { loggedUser } = React.useContext(LoginContext);
    
    const quoteRef = React.useRef(null);

    const fetchData = React.useCallback(async (props) => {
        try {
            const res = await fetch('https://api.quotable.io/quotes?limit=90');
            
            if(![ 0 , 200 ].includes(res.status)) throw new Error("Quote request error");

            const data = await res.json();
            const quotes =  data.results;

            const interval = setInterval(() => {
                if(props.isMounted && quoteRef.current) {
                    quoteRef.current.innerHTML = quotes[Math.floor(Math.random() * quotes.length)].content;
                } else {
                    clearInterval(interval)
                }
            }, 7000);
        } catch(e) {
            console.error(e);
        }
    }, []);

    React.useEffect(() => {
        const props = { isMounted: true };
        fetchData(props);

        return () => {
            props.isMounted = false;
        };

    }, [ fetchData ])

    return (
        <main>
            <section className={classes.main}>
                <div className="bg-neutral-700 px-5 pt-4 pb-12 sm:pt-8 sm:pb-16">
                    <Typography
                        component="h1"
                        className="font-bold text-2xl text-white">
                        Dashboard
                    </Typography>
                </div>
                <div className="relative">
                    <div className={classNames(classes.heroPanel, `absolute bg-white left-5 px-3 py-4 sm:px-4 sm:py-6`)}>
                        <Typography
                            component="h2"
                            className="">
                            Seja bem-vindo ao painel de gerenciamento
                        </Typography>
                        <div className="border-l-4 border-solid border-neutral-800 bg-gray-200 mt-4 py-3 px-2 md:py-4 md:px-3">
                            <Typography>
                                <span className="font-medium">Hello, { loggedUser.firstName } { loggedUser.lastName }</span><br/>
                                <span className={classes.quote} ref={quoteRef}>
                                    A vida e feita de escolhas...
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>
            </section>
            <div className={classNames(classes.highlightsContainer, "flex flex-wrap items-stretch justify-between px-5")}>
                <HightlightCard color="#fecaca" href="sale" icon={<AddShoppingCartIcon />} title="Sale"/>
                <HightlightCard color="#fde68a" href="/warehouse" icon={<WarehouseIcon />} title="Warehouse" />
                <HightlightCard color="#e9d5ff" href={`/booking`} icon={<BookmarkAddOutlinedIcon />} title="Agendar"/>
                <HightlightCard color="#a5f3fc" href="/users" icon={<GroupIcon />} title="Users"/>
            </div>
        </main>
    );
};

export default Home;