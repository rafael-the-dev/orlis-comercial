import * as React from "react";
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router";

import { LoginContext } from "src/context";
import { fetchHelper } from "src/helpers/queries"

const Loading = ({ loading, setLoading }) => {
    //const [ loading, setLoading ] = React.useState(true);
    const isFirstRender = React.useRef(true);

    const { addUser } = React.useContext(LoginContext);

    const router = useRouter();

    React.useEffect(() => {
        const currentPathname = router.pathname;

        const func = async () => {
            try {
                const data = JSON.parse(localStorage.getItem(process.env.LOCAL_STORAGE));
                const { token } = data.user;
    
                if(isFirstRender.current && Boolean(token)) {
                    isFirstRender.current = false;
    
                    const options = {
                        body: JSON.stringify({ role: "VALIDATE_TOKEN" }),
                        headers: {
                            "Authorization": `${token}` //Bearer  
                        },
                        method: "PUT"
                    };
    
                    await fetchHelper({ url: "/api/login", options })
                        .then(data => {
                            addUser(data);
                            router.push(currentPathname);
                            setLoading(false);
                        });
                } else {
                    throw new Error();
                }
            } catch(e) {
                isFirstRender.current = false;
                setLoading(false);
                router.push('/login');
            }
    
            isFirstRender.current = false;
        };

        func();
    }, [ addUser, router, setLoading ]);

    return (
        <div className="bg-white flex fixed h-screen items-center justify-center left-0 top-0 w-full z-10">
            <Typography>Loading...</Typography>
        </div>
    );
};

export default Loading;