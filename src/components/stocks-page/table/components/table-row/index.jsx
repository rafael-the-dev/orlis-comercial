import moment from "moment";
import { useRouter } from "next/router";
import { TableCell, TableRow } from "@mui/material"

const TableRowContainer = ({ headers, invoice }) => {

    const getLabel = (header) => {
        const { key, value } = header;

        if(key) {
            return value === "date" ? moment(invoice[key][value]).format("DD/MM/YYYY HH:mm:ss") : invoice[key][value];
        } 

        return value === "date" ? moment(invoice[value]).format("DD/MM/YYYY HH:mm:ss") : invoice[value]
    };

    const router = useRouter();

    const clickHandler = () => {
        router.push(`/payments/${invoice.id}`)
    };

    return (
        <TableRow 
            className="hover:bg-stone-100"
            onClick={clickHandler}>
            {
                headers.current.map(header => (
                    <TableCell
                        align="center"
                        key={header.value}>
                        { getLabel(header) }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;