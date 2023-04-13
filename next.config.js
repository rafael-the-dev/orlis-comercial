const path = require('path')

module.exports = {
    env: {
        DB: {
            connectionLimit: 10,
            host     : 'localhost',
            user     : 'root',
            password : "40260101",
            database : 'rt_comercial'
        },
        JWT_SECRET_KEY: "53a0d1a4174d2e1b8de701437fe06c08891035ed4fd945aef843a75bed2ade0657b3c4ff7ecd8474cb5180b2666c0688bbe640c9eb3d39bb9f2b724a10f343c6",
        LOCAL_STORAGE: "__orlis-comercial-stock-management-app__",
        MONGO_DB: {
            collections: {
                products: "products",
                payment_method: "payment_method",
                sales: "sales",
                users: "users",
            },
            name: "orlis-comercial",
            url: "mongodb+srv://rafael-the-dev:iH.-qJftk8g9cgc@cluster0.z64j5.mongodb.net/orlis-comercial?authMechanism=DEFAULT"
        },
        PAYMENT_METHODS: [
            { value: 100, label: "Cash" },
            { value: 200, label: "M-pesa" },
            { value: 300, label: "E-mola" },
            { value: 400, label: "M-kesh" },
            { value: 500, label: "POS" },
            { value: 600, label: "P24" }
        ],
        SERVER: "https://orlis-comercial.netlify.app" //"http://localhost:3323"//
    },
    webpack: config => {
        config.resolve.modules.push(path.resolve('./'));

        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    }
}