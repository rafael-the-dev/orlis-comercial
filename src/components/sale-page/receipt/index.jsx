import * as React from "react";
import { Typography } from "@mui/material";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";
import classNames from "classnames";

const ReceiptContainer = ({ products, productsHeaders, paymentMethods, stats }) => {
    const innerHeaders = React.useRef([
        { label: "Name", value: "description" },
        { label: "Qty", value: "quantity" },
        { label: "Price", value: "price" },
        { label: "Total", value: "totalAmount" }
    ]);

    const headers = productsHeaders ?? innerHeaders;
    
    const paymentMethodHeaders = React.useRef([
        { label: "Name", value: "description" },
        { label: "Amount", value: "amount" },
        { label: "Received", value: "received" },
        { label: "Change", value: "change" }
    ]);

    const getHeader = (list) => (
        <thead>
            <tr>
                {
                    list.current.map(header => (
                        <th 
                            key={header.value}
                            style={{ fontSize: ".8rem", textAlign: [ "description" ].includes(header.value) ? "left" : "center" }}>
                            { header.label }
                        </th>
                    ))
                }
            </tr>
        </thead>
    );

    const getTableBody = (headersList, rows) => (
        <tbody>
            {
                rows.map(row => (
                    <tr key={uuidV4()}>
                        {
                            headersList.current.map(header => (
                                <td
                                    key={header.value}
                                    style={
                                        { fontSize: ".8rem", padding: ".35rem 0", textAlign: [ "description" ].includes(header.value) ? "left" : "center" }
                                    }>
                                    <span 
                                        style={ header.value === "description" ? {
                                            display: "block",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%",
                                            whiteSpace: "nowrap"
                                        }: {}}>
                                        { row[header.value] }
                                    </span>
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
        </tbody>
    );
        
    return (
        <div 
            style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <main style={{ flexGrow: "grow" }}>
                <div>
                    <Typography
                        component="h2"
                        style={{ fontSize: ".95rem", fontWeight: 600, marginBottom: ".5rem" }}>
                        Items
                    </Typography>
                    <div>
                        <table style={{ width: "100%" }}>
                            { getHeader(headers) }
                            { getTableBody(headers, products) }
                        </table>
                    </div>
                </div>
                { Boolean(paymentMethods) && <div className="mt-3">
                    <Typography
                        component="h2"
                        style={{ fontSize: ".95rem", fontWeight: 600, marginBottom: ".5rem" }}>
                        Payment method
                    </Typography>
                    <div>
                        <table style={{ width: "100%"}}>
                            { getHeader(paymentMethodHeaders) }
                            { getTableBody(paymentMethodHeaders, paymentMethods) }
                        </table>
                    </div>
                </div> }
                <ul style={{ alignItems: "flex-end", display: "flex", flexDirection: "column", marginTop: "1rem" }}>
                    <Typography
                        component="h3"
                        style={{ display: 'flex', fontWeight: "normal", justify: "flex-end", marginBottom: ".5rem" }}>
                        total Vat <span style={{ fontSize: "1.2rem", fontWeight: "bold", marginLeft: ".75rem", textAlign: "right", width: "90px" }}>{ stats.totalVAT }MT</span>
                    </Typography>
                    <Typography
                        component="h3"
                        style={{ display: 'flex', fontWeight: "normal", justify: "flex-end", marginBottom: ".5rem" }}>
                        subTotal <span style={{ fontSize: "1.2rem", fontWeight: "bold", marginLeft: ".75rem", textAlign: "right", width: "90px" }}>{ stats.totalAmount  }MT</span>
                    </Typography>
                    <Typography
                        component="h3"
                        style={{ display: 'flex', fontWeight: "normal", justify: "flex-end" }}>
                        Total <span style={{ fontSize: "1.2rem", fontWeight: "bold", marginLeft: ".75rem", textAlign: "right", width: "90px" }}>{ stats.subTotal }MT</span>
                    </Typography>
                </ul>
            </main>
            <footer style={{ alignItems: "center", display: "flex", flexDirection: 'column' }}>
                <Typography style={{ fontSize: ".8rem", margin: ".3rem 0" }}>*** Thank you ***</Typography>
                <Typography style={{ fontSize: ".8rem" }}>Developed by Cybersys, Lda</Typography>
            </footer>
            <style jsx>
                {
                    `
                        .column--name {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            width: 100%;
                            white-space: nowrap;
                        }
                    `
                }
            </style>
        </div>
    );
};

export default ReceiptContainer;