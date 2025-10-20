import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => { // Removed : React.FC<AuthProviderProps>

    const [authenticated, setAuthenticated] = useState(false); // Removed <boolean>

    useEffect(() => {
        const access = localStorage.getItem("AUTH_CROCA");
        const refresh = localStorage.getItem("REFRESH_CROCA");

        if (access && refresh) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, []);

    const login = (res) => { // Removed (res:LoginResponse)
        localStorage.setItem("AUTH_CROCA", res.access);
        localStorage.setItem("REFRESH_CROCA", res.refresh);
        setAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("AUTH_CROCA");
        localStorage.removeItem("REFRESH_CROCA");
        setAuthenticated(false);
        window.location.href = "/login"; // Redirige si quieres
    };

    // The 'value' object implicitly defines the context shape in JS
    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { // Removed (): AuthContextType
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};