import * as React from "react";
import { useRouter } from "next/router";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";

import Card from "src/components/users-page/user-card";
import CancelLink from "src/components/cancel-link";
import Main from "src/components/main";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button";
import Subcontainer from "src/components/scroll-container"

const ExpensesContainer = () => {
    const [ users, setUsers ] = React.useState([]);

    React.useEffect(() => {
        const func = async () => {
            try {
                const options = getAuthorizationHeader();
                const data = await fetchHelper({ options, url: `/api/users` });
                setUsers(data);
            } catch(e) {
                console.error(e)
            }
        }

        func();
    }, []);

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div className="flex flerx-wrap">
                {
                    users.map(user => (
                        <Card { ...user } key={user.username} />
                    ))
                }
            </div>
            <div className="flex justify-end mt-8">
                <CancelLink classes={{ link: "mr-3" }} href="/">Voltar</CancelLink>
                <PrimaryButton href="/sign-up">Novo usuario</PrimaryButton>
            </div>
        </div>
    );
};

export default ExpensesContainer;