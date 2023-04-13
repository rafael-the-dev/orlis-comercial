import * as React from "react";
import MenuItem from "@mui/material/MenuItem"

import { FilterContext } from "../../context";
import { LoginContext } from "src/context"

import Input from "src/components/default-input";

const UserFilter = () => {
    const { selectedUser, setSelectedUser, users } = React.useContext(FilterContext);
    const { loggedUser } = React.useContext(LoginContext);

    const changeHandler = React.useCallback(e => setSelectedUser(e.target.value), [ setSelectedUser ])

    return (
        <Input
            className="input w12"
            onChange={changeHandler}
            value={selectedUser}
            select>
            {
                users
                .filter(currentUser => {
                    if(currentUser.id === -1) return true;

                    if([ "administrator", "manager" ].includes(loggedUser.category.toLowerCase())) {
                        return true;
                    } 

                    return currentUser.username === loggedUser.username;
                })
                .map(user => (
                    <MenuItem 
                        key={user.id}
                        value={user.id}>
                        { user.firstName } { user.lastName }
                    </MenuItem>
                ))
            }
        </Input>
    );
};

export default UserFilter;