import Typography from "@mui/material/Typography"
import classNames from "classnames";

import classes from "./styles.module.css";

import Link from "src/components/link"

const Card = ({ color, href, icon, title }) => {

    return (
        <Link
            className={classNames(classes.card, "mb-4")}
            href={href}>
            <div 
                className="bg-stone-100 flex flex-col h-full items-center justify-center px-4 relative hover:bg-stone-200"
                style={{ backgroundcolor: color }}>
                <Typography
                    component="h2"
                    className="font-bold text-lg text-neutral-700 sm:text-xl">
                    { title }
                </Typography>
                { icon }
            </div>
        </Link>
    );
};

export default Card;

/**
 * <div 
                className="flex h-full items-center justify-between px-4 relative"
                style={{ backgroundColor: color }}>
                <Typography
                    component="h2"
                    className="font-bold text-lg text-white sm:text-xl">
                    { title }
                </Typography>
                { icon }
            </div>
 */