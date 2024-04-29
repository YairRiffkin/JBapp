import { useEffect, useRef, useState } from "react";
import { User } from "../models/usertypes";
import { useNavigate } from "react-router-dom";
import './pagestyle.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type UserDataProps = {
    setUserToken: (userId: string | null) => void
  }

export function LoginLines({ setUserToken }: UserDataProps ) {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [inputStatus, setInputStatus] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    function checkEmptyInput() {
        (usernameRef.current?.value && passwordRef.current?.value)? setInputStatus(false): setInputStatus(true);
    }
    
    return <div className="form-box">
            <h2>Please login with your email or employee id as username</h2>
            <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                ref={usernameRef}
                onChange={checkEmptyInput}
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                ref={passwordRef} 
                onChange={checkEmptyInput} 
            />
                <button 
                // TODO: error on both fetch's
                    disabled = {inputStatus}
                    onClick={() => {
                        const username = usernameRef.current?.value || "";
                        const password = passwordRef.current?.value || "";
                        fetch(BACKEND_URL + "/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username, password }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                    if (data.error) {setError(data.error)}
                                    else {
                                      localStorage.setItem("access_token", data.access_token);
                                      setUserToken(data.access_token);}
                                 })
                                // TODO: check why the error does not come through
                            .catch((error) => alert("Error logging in: " + error));
                        }
                    
                    }                
                    >&#10003;
                </button>
                { error && <small style={{color: "red"}}>{ error }</small>}
    </div>;
}

export function LoggedUser() {
    const [userData, setUserData] = useState<User | null>(null);
    const navigate = useNavigate();
      useEffect(() => {
          fetch(BACKEND_URL + "/users/specific", { headers: { "Authorization": "Bearer " + localStorage.getItem("access_token") } })
          .then(response => response.json())
          .then(data => {setUserData(data)
          })
          
    }, []);
    localStorage.setItem("userData", JSON.stringify(userData));
          if (userData) {
            return <>
              { navigate('/', {replace: true})}
            </>}
  } 

  export function LoginPage() {
    const [userToken, setUserToken] = useState<string | null>(null);
  return <>
    {userToken ? <LoggedUser /> : <LoginLines setUserToken={setUserToken} /> }
  </>
}
