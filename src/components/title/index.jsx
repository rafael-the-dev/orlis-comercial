import Typography from "@mui/material/Typography";
import classNames from "classnames"

const Title = ({ children, className, component }) => (
    <Typography
        component={ component ?? "h1" }
        className={classNames("capitalize text-center text-xl text-white xl:text-2xl", className)}>
        { children }
    </Typography>
);

export default Title;