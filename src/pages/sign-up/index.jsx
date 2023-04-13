import { Alert, AlertTitle, MenuItem, Paper, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from "next/router"

import classNames from 'classnames'
import classes from "./styles.module.css";

import Validation from "src/models/Validation";
import { SignUpContext, SignUpContextProvider } from "src/context"

import CancelLink from "src/components/cancel-link"
import DefaultInput from "src/components/default-input";
import Image from "src/components/image";
import Main from "src/components/main";
import MessageDialog from "src/components/message-dialog"
import Link from "src/components/link";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button"
import Subcontainer from 'src/components/scroll-container';

import { Button, Input } from "src/components/signup-page";

const SignUpContainer = ({ children }) => (
    <SignUpContextProvider>
        { children }
    </SignUpContextProvider>
);

const SignUpContent = () => {
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
    const imageRef = useRef(null);
    const nameRef = useRef(null);
    const firstNameRef = useRef(null)
    const passwordRef = useRef(null);
    const lastNameRef = useRef(null);
    const userNameRef = useRef(null);

    const setDialogMessage = useRef(null);

    const changeHandler = useCallback((e) => setUser(e.target.value), [ setUser ])

    const legendMemo = useMemo(() => <Panel title="Cadastro de usuario" />, []);

    const router = useRouter();
    const backHandler = useCallback(() => router.back(), [ router ])

    const cancelLinkMemo = useMemo(() => <CancelLink classes={{ button: "mr-3" }} onClick={backHandler}>Voltar</CancelLink>, [ backHandler ])

    const firstNameMemo = useMemo(() => (
        <Input 
            classes={{ input: "w-full", root: "input w12"}}
            errors={firstName.error}
            id="name"
            onChange={firstNameChangeHandler}
            placeholder="Primeiro nome"
            ref={firstNameRef}
            value={firstName.value}
        />
    ), [ firstName, firstNameChangeHandler ])

    const lastNameMemo = useMemo(() => (
        <Input 
            classes={{ input: "w-full", root: "input w12"}}
            errors={lastName.error}
            id="name"
            onChange={lastNameChangeHandler}
            placeholder="Ultimo nome"
            ref={lastNameRef}
            value={lastName.value}
        />
    ), [ lastName, lastNameChangeHandler ]);

    const messageDialog = useMemo(() => (
        <MessageDialog 
            setDialogMessage={setDialogMessage}
        />
    ), [])

    const usernameMemo = useMemo(() => (
        <Input 
            classes={{ input: "w-full", root: "input w12"}}
            errors={username.error}
            id="username"
            onChange={usernameChangeHandler}
            placeholder="Nome do usuario"
            ref={userNameRef}
            value={username.value}
        />
    ), [ username, usernameChangeHandler ]);

    const userTypeMemo = useMemo(() => (
        <DefaultInput 
            classes={{ root: "input w12 mt-1 sign-up-select" }}
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
            classes={{ input: "w-full", root: "input w12"}}
            errors={password.error}
            id="password"
            onChange={passwordChangeHandler}
            placeholder="Palavra-passe"
            ref={passwordRef}
            type="password"
        />
    ), [ password, passwordChangeHandler ]);

    const confirmPasswordMemo = useMemo(() => (
        <Input 
            classes={{ input: "w-full", root: "input w12"}}
            errors={confirmPassword.error}
            id="confirm-password"
            onChange={confirmPasswordChangeHandler}
            placeholder="Comfirme palavra-passe"
            ref={confirmPasswordRef}
            type="password"
        />
    ), [ confirmPassword, confirmPasswordChangeHandler ]);

    const imageMemo = useMemo(() => (
        <Image 
            alt="" 
            classes={{ root: classNames("border border-solid border-stone-200", classes.imageContainer) }} 
            fileRef={imageRef}
        />
    ), []);

    const submitHandler = useCallback(async e => {
        e.preventDefault();

        try {
            await onSubmit({
                firstName: firstNameRef.current.value,
                image: imageRef.current,
                lastName: lastNameRef.current.value,
                username: userNameRef.current.value
            })

            setDialogMessage.current?.({
                description: "Usuario registado com sucesso",
                type: "success",
                title: "Sucesso"
            })
        } catch(e) {
            setDialogMessage.current?.({
                description: "Usuario nao registado",
                type: "error",
                title: "Erro"
            })
        }
    }, [ onSubmit ]);

    return (
        <Main>
            { legendMemo }
            <Subcontainer
                component="form"
                onSubmit={submitHandler}>
                <div className="flex flex-col md:flex-row md:items-start">
                    { imageMemo }
                    <div className={classNames(classes.fieldset, "flex flex-wrap justify-between grow")}>
                        { firstNameMemo }
                        { lastNameMemo }
                        { usernameMemo }
                        { userTypeMemo }
                        { passwordMemo }
                        { confirmPasswordMemo }
                    </div>
                </div>
                <div className={classNames("flex justify-end mt-6")}>
                    { cancelLinkMemo }
                    <PrimaryButton 
                        disabled={hasErrors}
                        type="submit">
                        { loading ? "Loading..." : "Submeter"}
                    </PrimaryButton>
                </div>
            </Subcontainer>
            { messageDialog }
        </Main>
    );
};

const Container = () => (
    <SignUpContainer>
        <SignUpContent />
    </SignUpContainer>
);

export default Container;