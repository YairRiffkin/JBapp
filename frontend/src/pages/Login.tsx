// handles login
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../components/static/GeneralPage.css'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type UserDataProps = {
    setUserToken: (userId: string | null) => void
  }

export function LoginPage({ setUserToken }: UserDataProps ) {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [inputStatus, setInputStatus] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    function checkEmptyInput() {
        /* If both inputs are complete submit is enabled*/
        (usernameRef.current?.value && passwordRef.current?.value)? setInputStatus(false): setInputStatus(true);
    }
    
    return <div className="display-box">
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
                <button type= "submit"
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
                                        setUserToken(data.access_token);
                                        navigate('/');
                                    }
                                 })
                            .catch((error) => alert("Error logging in: " + error));
                        }
                    
                    }                
                    >&#10003;
                </button>
                { error && <small style={{color: "red"}}>{ error }</small>}
    </div>;
}
