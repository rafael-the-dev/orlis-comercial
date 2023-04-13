import { Typography } from "@mui/material"
import classNames from "classnames";

import SchoolIcon from '@mui/icons-material/School';

import classes from "./styles.module.css";

const HeroContainer = () => {

    return (
        <section
            className={classNames(classes.container, `rounded-xl relative w-full after:absolute after:h-full
            after:left-0 after:top-0 after:w-full`)}>
            <div className={classNames(classes.name, `pl-4 pt-8 text-white before:block before:mb-4 sm:pt-12 sm:pl-8
                md:pt-20 xl:pt-24`)}>
                <Typography
                    component="h2"
                    className={classNames("font-bold text-2xl sm:text-3xl md:text-4xl xl:text-5xl")}>
                    Rafael Tivane
                </Typography>
            </div>
            <SchoolIcon className={classNames(classes.icon, "absolute opacity-70 text-white")} />
        </section>
    );
};

export default HeroContainer;