import { createContext, useState } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const presentToken=localStorage.getItem('token')
    const [token, setToken] = useState(presentToken||null);
    const [user, setUser] = useState(null);
    
    const authInfo = {
        token,
        setToken,
        user,
        setUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
