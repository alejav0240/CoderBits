import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("AUTH_CROCA");
    const refresh = localStorage.getItem("REFRESH_CROCA");

    if (access && refresh) {
      setUser({ access, refresh });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = (res) => {
    localStorage.setItem("AUTH_CROCA", res.access);
    localStorage.setItem("REFRESH_CROCA", res.refresh);
    setUser({ access: res.access, refresh: res.refresh });
  };

  const logout = () => {
    localStorage.removeItem("AUTH_CROCA");
    localStorage.removeItem("REFRESH_CROCA");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
