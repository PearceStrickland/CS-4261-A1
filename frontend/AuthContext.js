import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
  accessToken: null,
  jsonToken: null,
  setAccessToken: () => {},
  setJsonToken: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [jsonToken, setJsonToken] = useState(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, jsonToken, setJsonToken }}>
      {children}
    </AuthContext.Provider>
  );
};