
const fs = require('fs');
const moment = require("moment")
const path = require("path")
const PDFDocument = require('pdfkit');

const getInvoicePath = name => {
    const { sep } = path;
    return path.join(path.resolve("."), `${sep}public${sep}invoices${sep}sales${sep}${name}`);
};

const deleteInvoice = name => {
    const pathname = getInvoicePath(name);

    fs.unlink(pathname, error => {
        if(error) console.error("error while deleting", error);
    });
}

const generateHeader = (doc) => {
	doc.image('logo.png', 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('ACME Inc.', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();
}

const generateFooter = (doc, offsetY) => {
	doc.fontSize(10)
        .text('Payment is due within 15 days. Thank you for your business.', 50, offsetY + 200,
		    { align: 'center', width: 500 },);
}

const generateTableRow = (doc, y, c1, c3, c4, c5) => {
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}

const generateInvoiceTable = (doc, { products, stats }) => {
	const invoiceTableTop = 80;

    generateTableRow(
        doc,
        invoiceTableTop + 1 * 30,
        "Name",
        "Price(MT)",
        "Quantity",
        "Total per item(MT)",
    );

    products.forEach((item, index) => {
		const position = invoiceTableTop + (index + 2) * 30;

		generateTableRow(
			doc,
			position,
			item.description,
			item.price,
			item.quantity,
			item.price * item.quantity,
		);
    });


    doc.fontSize(10)
		.text("Subtotal", 370, invoiceTableTop + (products.length + 3) * 30, { width: 90, align: 'right' })
		.text(`${stats.subTotal} MT`, 0, invoiceTableTop + (products.length + 3) * 30, { align: 'right' });

    doc.fontSize(10)
		.text("Total VAT", 370, invoiceTableTop + (products.length + 4) * 30, { width: 90, align: 'right' })
		.text(`${stats.totalVAT} MT`, 0, invoiceTableTop + (products.length + 4) * 30, { align: 'right' });
    
    doc.fontSize(10)
		.text("Total", 370, invoiceTableTop + (products.length + 5) * 30, { width: 90, align: 'right' })
		.text(`${stats.totalAmount} MT`, 0, invoiceTableTop + (products.length + 5) * 30, { align: 'right' });
}

const createInvoice = ({ information, products, paymentMethods, stats }) => {
	return new Promise((resolve, reject) => {
        try {
            let doc = new PDFDocument({ margin: 50 });

            //generateHeader(doc); // Invoke `generateHeader` function.
            generateInvoiceTable(doc, { products, stats })
            generateFooter(doc, (products.length + 4) * 30); // Invoke `generateFooter` function.

            doc.end();

            const time = moment().format("DDMMYYYY_HHmmss");
            const name = `sale_invoice_${time}.pdf`;

            const filePath = getInvoicePath(name);
            doc.pipe(fs.createWriteStream(filePath))
                .on("finish", () => resolve(name));
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
	createInvoice,
    deleteInvoice,
    getInvoicePath
};