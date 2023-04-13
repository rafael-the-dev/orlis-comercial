import classNames from "classnames";
import { Button, Chip, Paper, Typography } from "@mui/material";

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import classes from "./styles.module.css";

import Image from "src/components/default-image";
import Link from "src/components/link";
import PrimaryButton from "src/components/primary-button";

const Card = ({ category, firstName, image, lastName, username }) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Paper 
            className={classNames(classes.container, "border border-solid border-stone-200")}
            elevation={1}>
            <div className={classNames(classes.imageContainer, "border-b border-solid border-neutral-300 relative w-full")}>
                <Image 
                    alt={fullName}
                    layout='fill'
                    src={`/images/users/${image}`}
                />
            </div>
            <div className="flex flex-col justify-between px-3 py-4 sm:grow">
                <div>
                    <Typography
                        component="h2">
                        { fullName }
                    </Typography>
                </div>
                <div className="flex items-center justify-between mt-6 w-full">
                    <Chip 
                        label={category} 
                    />
                    <PrimaryButton 
                        classes={{ button: "normal-case" }}
                        endIcon={<ArrowRightAltIcon />}
                        href={`/users/${username}`}>
                        View profile
                    </PrimaryButton>
                </div>
            </div>
        </Paper>
    );
};

export default Card;