import classNames from "classnames";
import moment from "moment";
import { v4 as uuidV4 } from "uuid"
import { IconButton, TableCell, TableRow } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

const concatValues = ({ obj, value }) => {
    if(Array.isArray(value)) {
        return value.map(field => obj[field]).join(" ")
    }

    return obj[value];
};

const TableRowContainer = ({ headers, onClick, row, onRemove }) => {
    const getKey = (header) => {
        const { customComponent, key, subValue, value } = header;

        if(customComponent || Array.isArray(value)) {
            return uuidV4();
        }

        return value;
    };
    
    const getLabel = (header) => {
        const { customComponent, key, subValue, value } = header;

        if(customComponent) {
            return customComponent({ item: row, key });
        }

        if(key) {
            return value === "date" ? moment(row[key][value]).format("DD/MM/YYYY HH:mm:ss") : (
                subValue ? concatValues({ obj: row[key][value], value: [subValue] }) : concatValues({ obj: row[key], value })
            );
        } 

        const result = {
            "date":  moment(row[value]).format("DD/MM/YYYY HH:mm:ss"),
            "delete": <div><IconButton className="hover:text-red-600" onClick={onRemove && onRemove(row)}><DeleteIcon /></IconButton></div>,
        }[value];
        
        return result ?? concatValues({ obj: row, value });
    };

    return (
        <TableRow 
            className={classNames({ "cursor-pointer hover:bg-stone-100": Boolean(onClick) })}
            onClick={onClick && onClick(row)}>
            {
                headers.current.map(header => (
                    <TableCell
                        align="center"
                        key={getKey(header)}>
                        { getLabel(header) }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;