import { Button, MenuItem, Paper, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from "next/router";

import classNames from 'classnames'
import classes from "./styles.module.css";

import SaveIcon from '@mui/icons-material/Save';

import Validation from "src/models/Validation";
import { fetchHelper, getAuthorizationHeader, getUsers } from "src/helpers/queries"
import { SignUpContext } from "src/context";

import CancelLink from "src/components/cancel-link";
import DefaultInput from "src/components/default-input";
import Image from "src/components/image";
import Input from "src/components/default-input"
import Link from "src/components/link";
import MessageDialog from "src/components/message-dialog";
import Panel from "src/components/panel";
import PrimaryButton from 'src/components/primary-button';

/*export const getStaticPaths = async () => {
    let paths = [];

    try {
        const users = await getUsers({});

        paths = users.map(({ username }) => ({ params: { id: username } }));
    } catch(e) {
        console.error(e);
    }

    return {
        fallback: true,
        paths
    };
};

export const getStaticProps = async ({ params }) => {
    const { id } = params;
    
    let user = {};

    try {
        user = await fetchHelper({ url: `${process.env.SERVER}/api/users/${id}` });
    } catch(e) {

    }

    return {
        props: {
            profile: user
        },
        revalidate: 59
    }
};*/

const Container = () => {
    const { 
        confirmPassword, confirmPasswordChangeHandler,
        firstName, firstNameChangeHandler,
        hasErrors,
        lastName, lastNameChangeHandler, loading,
        onSubmit, 
        password, passwordChangeHandler,
        setFirstName, setLastName, setUser, setUserName,
        user, username, usernameChangeHandler
     } = useContext(SignUpContext);

     const [ message, setMessage ] = useState({ description: "", title: "", type: "" });
     const [ profile, setProfile ] = useState({});

    const router = useRouter();
    const { query: { id } } = router;

    const users = useRef([
        {
            label: "Administrador", value: "Administrator"
        },
        {
            label: "Gerente", value: "Manager"
        },
        {
            label: "Operador", value: "Operator"
        }
    ]);

    const confirmPasswordRef = useRef(null);
    const nameRef = useRef(null);
    const firstNameRef = useRef(null);
    const imageRef = useRef(null);
    const passwordRef = useRef(null);
    const lastNameRef = useRef(null);
    const onOpen = useRef(null);
    const userNameRef = useRef(null);

    const changeHandler = useCallback((e) => setUser(e.target.value), [ setUser ]);

    const imageMemo = useMemo(() => (
        <Image 
            alt="" 
            classes={{ root: classNames("border border-solid border-stone-200", classes.imageContainer) }} 
            fileRef={imageRef}
        />
    ), []);

    const legendMemo = useMemo(() => (
        <Panel title="Perfil" />
    ), []);
    
    const setDialogMessage = useRef(null);
    
    const backHandler = useCallback(() => router.back(), [ router ])

    const cancelLinkMemo = useMemo(() => <CancelLink classes={{ button: "mr-3" }} onClick={backHandler}>Voltar</CancelLink>, [ backHandler ])
    const messageDialog = useMemo(() => (
        <MessageDialog 
            closeHelper={() => {}}
            setDialogMessage={setDialogMessage}
        />
    ), [])

    const firstNameMemo = useMemo(() => (
        <Input 
            className="input w12"
            errors={firstName.error}
            id="name"
            onChange={e => firstNameChangeHandler(e.target.value)}
            placeholder="Primeiro nome"
            inputRef={firstNameRef}
            value={firstName.value}
        />
    ), [ firstName, firstNameChangeHandler ])

    const lastNameMemo = useMemo(() => (
        <Input 
            className="input w12"
            errors={lastName.error}
            id="name"
            label="Apelido"
            onChange={e => lastNameChangeHandler(e.target.value)}
            placeholder="Ultimo nome"
            inputRef={lastNameRef}
            value={lastName.value}
            variant="outlined"
        />
    ), [ lastName, lastNameChangeHandler ])

    const usernameMemo = useMemo(() => (
        <Input 
            className="input w12"
            errors={username.error}
            id="username"
            onChange={e => usernameChangeHandler(e.target.value)}
            placeholder="Nome do usuario"
            inputRef={userNameRef}
            value={username.value}
        />
    ), [ username, usernameChangeHandler ]);

    const userTypeMemo = useMemo(() => (
        <DefaultInput 
            classes={{ root: "input w12" }}
            className="input w12"
            fullWidth
            label="Tipo de usuario"
            onChange={changeHandler}
            select
            value={user}
        >
            {
                users.current.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                        { item.label }
                    </MenuItem>
                ))
            }
        </DefaultInput>
    ), [ changeHandler, user ]);

    const passwordMemo = useMemo(() => (
        <Input 
            errors={password.error}
            id="password"
            onChange={passwordChangeHandler}
            placeholder="Palavra-passe"
            ref={passwordRef}
        />
    ), [ password, passwordChangeHandler ]);

    const confirmPasswordMemo = useMemo(() => (
        <Input 
            errors={confirmPassword.error}
            id="confirm-password"
            onChange={confirmPasswordChangeHandler}
            placeholder="Comfirme palavra-passe"
            ref={confirmPasswordRef}
        />
    ), [ confirmPassword, confirmPasswordChangeHandler ]);

    const signInMemo = useMemo(() => (
        <Typography component="p" className="ml-4 text-sm text-center dark:text-slate-400">
            have an account? 
            <Link href="/login">
                <a 
                    className={classNames(classes.signUpLink, 
                    "ml-2 text-blue-700 uppercase underline hover:opacity-90")}>
                    sign in.
                </a>
            </Link>
        </Typography>
    ), []);

    const submitHandler = useCallback(async e => {
        e.preventDefault();

        const headers = getAuthorizationHeader();

        try {
            const { status } = await onSubmit({
                firstName: firstNameRef.current.value,
                image: imageRef.current,
                lastName: lastNameRef.current.value,
                username: userNameRef.current.value
            }, headers);

            if((status >= 300) || (status < 200)) throw new Error();

            setDialogMessage.current?.({ description: "Dados atualizados com successo", title: "Success", type: "success" });
            onOpen.current?.();
        } catch(e) {
            setDialogMessage.current?.({ description: "Erro ao atualizar os dados", title: "Error", type: "error" });
            onOpen.current?.();
        }
    }, [ onSubmit ]);

    useEffect(() => {
        if(Boolean(profile)) {
            setFirstName({ error: [], value: profile.firstName });
            setLastName({ error: [], value: profile.lastName });
            setUser(profile.category);
            setUserName({ error: [], value: profile.username })
        }
    }, [ profile, setFirstName, setLastName, setUser, setUserName ]);

    useEffect(() => {
        const func = async () => {
            try {
                const user = await fetchHelper({ url: `/api/users/${id}` });
                setProfile(user)
            } catch(e) {
                console.error("Error while retrieving user's details");
            }
        };

        Boolean(id) && func();
    }, [ id ]);

    return (
        <div className="">
            { messageDialog }
            <form 
                className={classNames(classes.form, ``)}
                onSubmit={submitHandler}>
                <fieldset className="flex flex-col h-full items-stretch justify-between">
                    <div>
                        { legendMemo }
                        <div className="flex flex-col justify-between pt-6 px-5 md:flex-row">
                            {imageMemo }
                            <div className='grow'>
                                <div className="flex flex-wrap justify-between">
                                    { firstNameMemo }
                                    { lastNameMemo }
                                </div>
                                <div className="flex flex-wrap justify-between">
                                    { usernameMemo }
                                    { userTypeMemo }
                                </div>
                                { !id && passwordMemo }
                                { !id && confirmPasswordMemo }
                            </div>
                        </div>
                    </div>
                    <div 
                        className={classNames("flex justify-end px-5 pb-6")}>
                        { cancelLinkMemo }
                        <PrimaryButton 
                            disabled={hasErrors}
                            startIcon={<SaveIcon />}
                            type="submit">
                            { loading ? "Loading..." : "Atualizar" }
                        </PrimaryButton>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default Container;