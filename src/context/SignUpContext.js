import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Validation from "src/models/Validation";
import { useRouter } from "next/router"

const SignUpContext = createContext();
SignUpContext.displayName = "SignUpContext";

const SignUpContextProvider = ({ children }) => {
    const [ firstName, setFirstName ] = useState({
        error: [],
        value: "",
    });
    const [ lastName, setLastName ] = useState({
        error: [],
        value: "",
    });
    const [ user, setUser ] = useState("Administrator");
    const [ username, setUserName ] = useState({
        error: [],
        value: "",
    });
    const [ confirmPassword, setConfirmPassword ] = useState({
        error: [],
        value: ""
    });
    const [ password, setPassword ] = useState({
        error: [],
        value: ""
    });
    const [ loading, setLoading ] = useState(false);

    const passwordRef = useRef("");
    const userRef = useRef("Administrator")

    const childrenMemo = useMemo(() => <>{ children }</>, [ children ]);

    const { query: { id } } = useRouter();

    const onSubmit = useCallback(async (details, headers) => {
        setLoading(true);

        const passwordObj  = id ? {} : { password: passwordRef.current };

        const formData = new FormData();

        Object.entries({
            ...details,
            ...passwordObj,
            user: userRef.current
        }).forEach(([ key, value]) => formData.append(key, value))
        
        const body = formData;

        try {
            const res = await fetch(`/api/users/${id ?? ""}?user=${details['username']}`, { body, headers, method: id ? "PUT" : "POST" });
            setLoading(false);
            return res;
        } catch(e) {
            console.error(e);
            setLoading(false);
            throw e;
        }

    }, [ id ])

    const hasErrors = useMemo(() => {
        return Boolean(confirmPassword.error.length + password.error.length + firstName.error.length + lastName.error.length + username.error.length);
    }, [ confirmPassword, firstName, lastName, password, username ]);
    
    const firstNameChangeHandler = useCallback((value) => {
        const nameErrors = [];
        
        Validation.checkLength({ min: 2, value: value.trim(), onError: (error) => nameErrors.push(error) });
        Validation.hasNumbers({ min: 1, value, onError: () => {}, onSuccess: () => nameErrors.push({ name: "", message: "Must not contain numbers" })})
        Validation.hasSpecialChars({ value: value.trim(), onSuccess: (error) => nameErrors.push(error) });

        setFirstName({
            error: nameErrors,
            value
        });
    }, []);

    const lastNameChangeHandler = useCallback((value) => {
        const nameErrors = [];
        
        Validation.checkLength({ min: 2, value: value.trim(), onError: (error) => nameErrors.push(error) });
        Validation.hasNumbers({ min: 1, value, onError: () => {}, onSuccess: () => nameErrors.push({ name: "", message: "Must not contain numbers" })})
        Validation.hasSpecialChars({ value: value.trim(), onSuccess: (error) => nameErrors.push(error) });

        setLastName({
            error: nameErrors,
            value
        });
    }, []);

    const usernameChangeHandler = useCallback((value) => {
        const usernameErrors = [];

        Validation.hasWhitespace({ value, onSuccess: (error) => usernameErrors.push(error) });
        Validation.checkLength({ min: 8, value, onError: (error) => usernameErrors.push(error) });
        Validation.hasSpecialChars({ value, onSuccess: (error) => usernameErrors.push(error) });

        setUserName({
            error: usernameErrors,
            value
        });
    }, [])

    const passwordChangeHandler = useCallback(value => {
        const passwordErrors = [];

        Validation.startWithUppercaseLetter({ value, onError: error => passwordErrors.push(error) })
        Validation.hasNumbers({ value, onError: (error) => passwordErrors.push(error)})
        Validation.hasWhitespace({ value, onSuccess: (error) => passwordErrors.push(error) });
        Validation.checkLength({ min: 8, value, onError: (error) => passwordErrors.push(error) });

        setPassword({
            error: passwordErrors,
            value
        });
    }, []);

    const confirmPasswordChangeHandler = useCallback((value) => {
        const passwordErrors = [];

        if(value !== password.value) {
            passwordErrors.push({
                message: "Passwords don't match",
                name: ""
            })
        }

        setConfirmPassword({
            error: passwordErrors,
            value
        });
    }, [ password ]);

    useEffect(() => {
        passwordRef.current = password.value;

        setConfirmPassword(currentConfirmedPassword => {
            const passwordErrors = [];

            if(!currentConfirmedPassword.value) return currentConfirmedPassword;

            if(currentConfirmedPassword.value !== password.value) {
                passwordErrors.push({
                    message: "Passwords don't match",
                    name: ""
                })
            }
            
            return {
                ...currentConfirmedPassword,
                error: passwordErrors,
            }
        });
    }, [ password ]);

    useEffect(() => {
        userRef.current = user;
    }, [ user ])

    return (
        <SignUpContext.Provider
            value={{ 
                confirmPassword, confirmPasswordChangeHandler,
                firstName, firstNameChangeHandler,
                hasErrors,
                lastName, lastNameChangeHandler, loading,
                onSubmit,
                password, passwordChangeHandler,
                setFirstName, setLastName, setUser, setUserName,
                user, username, usernameChangeHandler
            }}>
            { childrenMemo }
        </SignUpContext.Provider>
    );
};

export {
    SignUpContext,
    SignUpContextProvider
}