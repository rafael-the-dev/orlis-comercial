import classNames from "classnames";

import classes from "./styles.module.css";

const Main = ({ children, className }) => (
    <main className={classNames(classes.main, className, "w-full")}>
        { children }
    </main>
);

export default Main;