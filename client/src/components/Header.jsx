import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import Brand from './russell_brand.png'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'

export default function Header(){

    const { token, logout } = useContext(UserContext)

    return (
        <div className='header'>
            { !token && <Link to='/login' className='admin-login'>Admin Login</Link> }
            { token && <a className='admin-login' onClick={logout}>Logout</a> }
            <div className='header-items'>
                <img src={Brand} alt='RCC Brand' height='50px'/>
                <Navbar />
            </div>
        </div>
    ) 
}