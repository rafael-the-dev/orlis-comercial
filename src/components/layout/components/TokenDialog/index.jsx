import * as React from "react";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import classNames from "classnames";

import classes from "./styles.module.css";

import { LoginContext } from "src/context";
import { fetchHelper } from "src/helpers/queries"

import Dialog from "src/components/dialog"

const TokenDialog = () => {
    const { addUser, getLocalStorageData, logoutHelper, user } = React.useContext(LoginContext);

    const router = useRouter();

    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);
    const dialogTimeoutRef = React.useRef(null);
    const verificationTimeoutRef = React.useRef(null);

    const closeHandler = React.useCallback(() => onClose.current?.(), [])
    const openHandler = React.useCallback(() => onOpen.current?.(), [])

    const verifyExpirationTime = React.useCallback(async () => {
        const { expiresIn } = getLocalStorageData().user;
        const MS_PER_MINUTE = 60000;

        if(Date.now() >= new Date((expiresIn * 1000) - (2 * MS_PER_MINUTE))) {
            try {
                await logoutHelper();
                addUser(null);
            } catch(e) {
                addUser(null);
                router.push("/login")
            }
        }
    }, [ addUser, getLocalStorageData, logoutHelper, router ]);

    const checkExpirationToken = React.useCallback(() => {
        if(dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current)
        if(verificationTimeoutRef.current) clearTimeout(verificationTimeoutRef.current)

        const { expiresIn } = getLocalStorageData().user;

        const MS_PER_MINUTE = 60000;
        const durationInMinutes = 5;
        const myEndDateTime = new Date((expiresIn * 1000) - (2 * MS_PER_MINUTE));
        const myStartDate = new Date(myEndDateTime - durationInMinutes * MS_PER_MINUTE);

        dialogTimeoutRef.current = setTimeout(openHandler, myStartDate - Date.now());
        verificationTimeoutRef.current = setTimeout(verifyExpirationTime, myEndDateTime - Date.now());
    }, [ getLocalStorageData, openHandler, verifyExpirationTime ]);

    const revalidateTokenHandler = React.useCallback(async () => {
        try {
            const data = await fetchHelper({ url: "/api/login", options: {
                body: JSON.stringify({}),
                headers: {
                    Authorization: getLocalStorageData().user.token
                },
                method: "PUT"
            }});
            
            if(dialogTimeoutRef.current !== null) clearTimeout(dialogTimeoutRef.current)
            if(verificationTimeoutRef.current !== null) clearTimeout(verificationTimeoutRef.current)

            const { expiresIn, token  } = data.access;
            localStorage.setItem(process.env.LOCAL_STORAGE, JSON.stringify({ ...getLocalStorageData(), user: { expiresIn, token } }));

            const MS_PER_MINUTE = 60000;
            const durationInMinutes = 5;
            const myEndDateTime = new Date((expiresIn * 1000) - (2 * MS_PER_MINUTE));
            const myStartDate = new Date(myEndDateTime - durationInMinutes * MS_PER_MINUTE);
            closeHandler();
            //addUser(data);

            dialogTimeoutRef.current = setTimeout(openHandler, myStartDate - Date.now());
            verificationTimeoutRef.current = setTimeout(() => verifyExpirationTime(), myEndDateTime - Date.now());
        } catch(e) {
            console.error(e)
            addUser(null);
            router.push("/login");
        }
    }, [ addUser, closeHandler, getLocalStorageData, openHandler, router, verifyExpirationTime ])

    React.useEffect(() => {
        if(user) {
            checkExpirationToken()
        } else {
            if(Boolean(dialogTimeoutRef.current)) clearTimeout(dialogTimeoutRef.current)
            if(Boolean(verificationTimeoutRef.current)) clearTimeout(verificationTimeoutRef.current)
        }
    }, [ checkExpirationToken, user ]);

    return (
        <Dialog
            customClose={() => {}}
            onClose={onClose}
            onOpen={onOpen}>
            <div className={classNames(classes.container, "bg-blue-700 px-5 py-6")}>
                <Typography
                    className="mb-6 text-white">
                    Your session will expire in 5 minnutes.
                </Typography>
                <div className="flex justify-end">
                    <Button
                        className="border-red-500 mr-3 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={closeHandler}
                        variant="outlined">
                        Close
                    </Button>
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-500 hover:opacity-70"
                        onClick={revalidateTokenHandler}
                        variant="contained">
                        Keep me logged in
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default TokenDialog;