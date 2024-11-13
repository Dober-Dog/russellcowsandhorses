export default function AuthForm(props){
    return (
        <form onSubmit={props.handleSubmit} className="login">
            <div className="login-inputs">
                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={props.inputs.username} 
                    onChange={props.handleChange}
                />
            </div>
            <div className="login-inputs">
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={props.inputs.password} 
                    onChange={props.handleChange}
                />
            </div>
            <button>{props.btnTxt}</button>
            <h4 style={{color: "red"}}>{props.errMsg}</h4>
        </form>
    )
}
