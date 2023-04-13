import { Button, Typography } from "@mui/material";
import classNames from "classnames";

import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

import classes from "./styles.module.css"

import Link from "src/components/link"

const Highlight = ({ icon, href, title }) => (
    <div className={classNames(classes.container, 'flex justify-between px-4 py-6 rounded-xl')}>
        <div>
            <Typography
                component="h2">
                { title ?? "Lorem ipsum" }
            </Typography>
            <Link className="inline-block mt-3" href={ href ?? "/register" }>
                <Button
                    className={classNames("capitalize text-amber-600 hover:bg-transparent")}
                    startIcon={<TrendingFlatIcon />}>
                    View
                </Button>
            </Link>
        </div>
        { icon ?? <ImportContactsIcon /> }
    </div>
);

export default Highlight;