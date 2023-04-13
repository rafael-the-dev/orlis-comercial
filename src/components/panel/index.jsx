import classNames from "classnames";

import Title from "../title"

const Panel = ({ children, className, title, titleComponent }) => {

    return (
        <div className={classNames("bg-neutral-700 px-5 py-6 text-white xl:py-8", className)}>
            { Boolean(title) && <Title component={titleComponent}>{ title }</Title> }
            { children }
        </div>
    );
};

export default Panel;