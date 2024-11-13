import { Link } from 'react-router-dom'

export default function Home(){

    return (
        <div className='home'>
            <div className='title'>
                <h1 className='russell'>Russell</h1>
                <h1>Cattle Company</h1>
            </div>
            <div className='home-about'>
                <h2>Welcome!</h2>
                <p>Dana Russell has been raising Angus cattle for over 25 years.  The Russell family has been raising Quarter Horses for several generations. We love our western heritage, the pursuit of excellence and our connections to the ranching industry. We hope to pass our love of cattle, horses and open spaces to the next generation.</p>
                <p>"Our Heroes Have Always Been Cowboys"</p>
            </div>
            <div className='home-horses'>
                <Link to='/horses'>Our Performance Horses</Link>
                <span>Our performance horses are some of the greatest in the game.</span>
            </div>
            <div className='home-cows'>
                <Link to='/cows'>Our Quality Cattle</Link>
                <span>Our quality cattle earn high praise from all who buy from us.</span>
            </div>
        </div>
    )
}