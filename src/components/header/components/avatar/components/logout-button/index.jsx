import * as React from "react";
import { useRouter } from "next/router";

import LogoutIcon from '@mui/icons-material/Logout';

import { LoginContext } from "src/context";

import ListItem from "src/components/list-item-button"

const Container = () => {
    const { addUser, logoutHelper, user } = React.useContext(LoginContext);
    const router = useRouter();

    const [ loading, setLoading ] = React.useState(false);

    const clickHandler = React.useCallback(() => {
        setLoading(true);

        logoutHelper()
            .then(res => { 
                addUser(null);
                router.push('/login');
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                addUser(null);
                router.push('/login');
            })
    }, [ addUser, logoutHelper, router ])

    return (
        <ListItem 
            classes={{ button: "capitalize text-red-500" }}
            disabled={!Boolean(user)}
            onClick={clickHandler}>
            { loading ? "Loading..." : (
                <>
                    <LogoutIcon />
                    Sair
                </>
            ) }
        </ListItem>
    );
};

export default Container;