import { getCategories, getProducts } from "./queries"

export const getProductsAndCategories = async () => {
    /*const parsedCookies = cookie.parse(headers.cookie); 
    const { token } = parsedCookies;*/
    
    const options = {
        headers: {
            "Authorization": ""
        }
    }

    let categories = [];
    let productsList = [];

    try {
        const [ categoriesResutlt, productsListResult ] = await Promise.all([ getCategories({ options }), getProducts({ options }) ]);

        categories = categoriesResutlt;
        productsList = productsListResult;
    } catch(e) {

    }

    return {
        props: {
            categories, 
            productsList
        }, // will be passed to the page component as props
        revalidate: 59
    }
};