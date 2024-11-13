import { useState, useContext } from "react"
import { UserContext } from "../context/userContext"
import AuthForm from "./AuthForm"

export default function Login(){
    const initInputs = {
        username: "",
        password: ""
    }
    const [inputs, setInputs] = useState(initInputs)

    const { login, errMsg } = useContext(UserContext)

    function handleChange(event){
        const { name, value } = event.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function handleLogin(e){
        e.preventDefault()
        login(inputs)
    }

    return(
        <div className="welcome">
            <h1>Admin Login</h1>
            <AuthForm
                handleChange={handleChange}
                handleSubmit={handleLogin}
                inputs={inputs}
                btnTxt="Log In"
                errMsg={errMsg}
            />
        </div>
    )
}