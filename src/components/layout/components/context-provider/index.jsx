import { useRouter } from "next/router";

import { 
    AddStockContextProvider,
    BookingContextProvider,
    DebtContextProvider,
    RegisterStepsContextProvider, 
    SalesContextProvider, 
    SalesReportContextProvider,
    SignUpContextProvider,
    WarehouseContextProvider
} from "src/context";

import { getBookingContext, getPaymentsContext, getUsersContext, getWarehouseContext } from "./providers"

const ContextProvider = ({ children }) => {
    const { pathname } = useRouter();

    const getProvider = () => {
        return {
            "/add-stock": <AddStockContextProvider>{ children }</AddStockContextProvider>,
            "/booking": getBookingContext(children),
            "/payments": getPaymentsContext(children),
            "/register": <RegisterStepsContextProvider>{ children }</RegisterStepsContextProvider>,
            "/sale": <SalesContextProvider>{ children }</SalesContextProvider>,
            "/sign-up": <SignUpContextProvider>{ children }</SignUpContextProvider>,
            "/sales": <SalesReportContextProvider>{ children }</SalesReportContextProvider>,
            "/users": getUsersContext(children),
            "/users/[id]": <SignUpContextProvider>{ children }</SignUpContextProvider>,
            "/warehouse": getWarehouseContext(children)
        }[pathname]
    };

    
    return (
        <>{ getProvider() ?? children }</>
    );
};

export default ContextProvider;