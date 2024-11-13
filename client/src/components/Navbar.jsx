import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'

export default function Navbar(){

    const { token } = useContext(UserContext)

    return (
        <div className='navbar'>
            <Link to='/'>Home</Link>
            <Link to='/horses'>Horses</Link>
            <Link to='/cows'>Cows</Link>
            <Link to='/contact'>Contact Us</Link>
            { token && <Link to='/admin'>Admin Page</Link> }
        </div>
    )
}