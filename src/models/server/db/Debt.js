const currency = require("currency.js");
const moment = require("moment");
const uuidV4 = require("uuid").v4;

const { parseId } = require("src/helpers")
const { getPriceVAT, getTotalPrice } = require("src/helpers/price");
const { removeProductFromStock } = require("src/helpers/sales");

const InvalidArgumentError = require("../errors/InvalidArgumentError");

const ClientModel = require("./Client");
const SaleModel = require("./Sale");

const pay = async ({ debt, totalAmount }, { mongoDbConfig }) => {
    let deposit = currency(debt.deposit).add(totalAmount).value;
    let temporaryDeposit = deposit;

    const debtId = uuidV4();

    const filteredList = debt.list
        .filter(sale => {
            if(temporaryDeposit >= sale.total && sale.status === "NOT_PAID") {
                temporaryDeposit = currency(temporaryDeposit).subtract(sale.total).value;
                return true;
            }
            return false;
        });

    try {
        await Promise.all(
            filteredList.map(sale => {
                return SaleModel.resolveDebt(
                    { selectedDebt: 
                        { 
                            ...sale, 
                            debtId,
                            paymentMethods: [
                                {
                                    amount: sale.total,
                                    changes: 0,
                                    id: 100,
                                    received: sale.total,
                                }
                            ]
                        } 
                    }, 
                    { mongoDbConfig }
                )
            })
        )

        debt.deposit = temporaryDeposit;

        filteredList.forEach(sale => {
            sale.status = "PAID";
        })
    }
    catch(e) {
        console.error(e);

        await Promise.all(
            filteredList.map(sale => {
                try {
                    SaleModel.remove({ id: debtId }, { mongoDbConfig })
                }
                catch(e) {
                    console.error(e)
                }
            })
        )
    }
};

const setDebtStatus = ({ amount, debt }) => {
    let status = "NOT PAID";

    if(amount === debt.remainingBalance) status = "PAID";
    else if(amount > 0) status = "PAYING";

    debt.status = status;
};

const isValidValues = ({ debt, totalAmount, totalReceived }) => {
    let isValid = false;

    if(totalAmount > 0) {
        // client must not pay any amount greater than remaining balance;
        const isAmountLessThanRemainingBalance = totalAmount <= debt.remainingBalance;
        // Received amount must not be less than the expected amount
        const isReceivedBalanceGreaterThanAmount = totalReceived >= totalAmount;

        // test conditions
        return isAmountLessThanRemainingBalance && isReceivedBalanceGreaterThanAmount;
    }
        
    return isValid;
};

const resetTime = (dateTime) => {
    dateTime.hours(0);
    dateTime.minutes(0);
    dateTime.seconds(0);
    dateTime.milliseconds(0);
};

const getDefaultFilter = ({ endDate, startDate }) => {
    const firstDate = startDate ?? Date.now();
    const from = moment(firstDate)
    const to = moment(endDate ? ( startDate ? endDate : Date.now() ) : firstDate)

    resetTime(from);

    resetTime(to);
    to.add(1, 'days');
    
    return {
        "date": { $gte: from.toISOString(), $lt: to.toISOString() }
    };
};

class Debt {
    static async get({ filter, id }, { mongoDbConfig: { collections } }) {
        const debt = await collections.DEBTS.findOne(filter ?? { id: parseId(id) });
        return debt;
    }

    static async getAll({ endDate, filter, startDate }, { mongoDbConfig }) {
        const { collections } = mongoDbConfig;

        let filters = {};

        const matchStage = { $match: filter ?? { status: { $in: [ "NOT_PAID", "PAYING" ]}  } };//...getDefaultFilter({ endDate, startDate }), ...filters
        
        let debts = await collections.DEBTS
            .aggregate([
                matchStage, // filter debts by date//tableId
                {
                    $lookup: { // INNER JOIN users collection
                        as: "user",
                        from: "users",
                        foreignField: "id",
                        localField: "user"
                    }
                },
                {
                    $lookup: { // INNER JOIN users collection
                        as: "client",
                        from: "clients",
                        foreignField: "id",
                        localField: "client"
                    }
                },
                {
                    $lookup: { // INNER JOIN users collection
                        as: "barman",
                        from: "barmen",
                        foreignField: "id",
                        localField: "barmanId"
                    }
                },
                {
                    $lookup: { // INNER JOIN barmen collection
                        as: "table",
                        from: "tables",
                        foreignField: "id",
                        localField: "tableId"
                    }
                },
                { $unwind: "$user"},
                { $unwind: "$client"},
                { $unwind: 
                    {
                        path: "$barman",
                        preserveNullAndEmptyArrays: true
                    }
                },
                { $unwind: 
                    {
                      path: "$table",
                      preserveNullAndEmptyArrays: true
                    }
                }
            ])
            .toArray();

        // remove logs property from user property
        debts = debts.map((saleItem) => {
            const { user, ...saleItemRest } = saleItem;
            const { _id, logs, password, ...userRest } = user;
           
            return {
                ...saleItemRest,
                user: { ...userRest }
            };
        });

        const total = debts.reduce((prevAmount, currentDebt) => {
            return currency(currentDebt.remainingBalance).add(prevAmount).value
        }, 0);

        return { 
            analytics: {
                total
            },
            list: debts 
        };
    }

    static async insert({ barmanId, debt, products, tableId }, { mongoDbConfig, user }) {
        const { collections } = mongoDbConfig;

        await ClientModel.get({ id: debt.client }, { mongoDbConfig })

        // insert debt details into collections
        const onSuccess = async ({ sale }) => {
            const currentDebt = await this.get(
                { 
                    filter: { 
                        client: parseId(debt.client),
                        status: { $in: [ "NOT_PAID", "PAYING" ]}
                    }
                }, 
                { mongoDbConfig }
            );

            const newDebt = { ...sale, description: debt.description, status: "NOT_PAID" };

            if(currentDebt) {
                const list = [ newDebt, ...currentDebt.list ];

                const remainingBalance = currency(currentDebt.remainingBalance).add(sale.total).value;
                const vat = currency(currentDebt.vat).add(sale.vat).value;
                const total = currency(currentDebt.total).add(sale.total).value;

                collections.DEBTS.updateOne(
                    { id: currentDebt.id },
                    { 
                        $set: {
                            list,
                            remainingBalance,
                            total,
                            vat
                        }
                    }
                )
            }
            else {
                collections.DEBTS.insertOne(
                    { 
                        client: debt.client,
                        deposit: 0,
                        id: uuidV4(),
                        list: [ newDebt ],
                        payments: [],
                        remainingBalance: sale.total,
                        status: "NOT_PAID",
                        total: sale.total,
                        user: user.id,
                        vat: sale.vat
                    }
                );
            }
        }

        const id = await removeProductFromStock(
            {
                barmanId,
                products,
                tableId
            },
            { 
                collectionName: "DEBTS",
                mongoDbConfig, 
                onSuccess,
                user 
            }
        );

        return id;
    }

    static async update({ id, payments }, { mongoDbConfig, user }) {
        const debt = await this.get({ id }, { mongoDbConfig });

        // sum total received and changes values
        const { totalAmount, totalReceived } = payments.reduce(({ totalAmount, totalReceived }, { amount, received }) => {
            return {
                totalAmount: currency(totalAmount).add(amount).value,
                totalReceived: currency(totalReceived).add(received).value
            };
        }, { totalReceived: 0, totalAmount: 0 });

        const totalChanges = currency(totalReceived).subtract(totalAmount).value;
        const newRemainingBalance = currency(debt.remainingBalance).subtract(totalAmount).value;

        // throw an IvalidArgumentError if values are not valid
        if(!isValidValues({ debt, totalAmount, totalReceived })) throw new InvalidArgumentError();
        
        // set the status of debt
        setDebtStatus({ amount: totalAmount, debt });

        await pay({ debt, totalAmount }, { mongoDbConfig });

        const newPayment = {
            amount: totalAmount,
            changes: totalChanges,
            date: new Date(Date.now()).toISOString(),
            payments,
            received: totalReceived,
            user: user.id
        };

        const newPayments = [ newPayment, ...debt.payments ];

        await mongoDbConfig.collections
            .DEBTS
            .updateOne(
                { id: debt.id },
                { $set: {
                        deposit: debt.deposit,
                        list: debt.list,
                        payments: newPayments,
                        remainingBalance: newRemainingBalance,
                        status: debt.status
                    }
                }
            );

        /*debt.payments = newPayments;;


        if(debt.status === "PAID") {
            await SaleModel.resolveDebt({ selectedDebt: debt }, { mongoDbConfig });
        }*/
    }
}

module.exports = Debt;