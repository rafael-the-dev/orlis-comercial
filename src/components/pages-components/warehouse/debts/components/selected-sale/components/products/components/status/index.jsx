import { Chip } from "@mui/material";
import classNames from "classnames"

const Status = ({ status }) => {
    const isPaid = status === "PAID";

    return (
        <div className="flex h-full items-center justify-center w-100">
            <Chip
                className={classNames("text-white", isPaid ? "bg-green-600" : "bg-red-700")}
                label={ isPaid ? "Paid" : "Not paid" } 
            />
        </div>
    )
};

export default Status;