import { useRouter } from "next/router";
import classNames from "classnames";

import classes from "./styles.module.css";

import ListItem from "src/components/list-item-button";

const Container = ({ children, href }) => {

    const { pathname } = useRouter();

    return (
        <ListItem classes={{ button: classNames(classes.listItem, "hover:text-amber-600",
            { [classNames(classes.listItemSelected, "bg-white relative")]: pathname === href },
            pathname === href ? "text-amber-600" : "text-neutral-700" ) }}
            href={href}>
            { children }
        </ListItem>
    );
};

export default Container;