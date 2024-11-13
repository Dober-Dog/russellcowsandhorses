import Card from './Card'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'

export default function CowList(){

    const { cowList, getCows } = useContext(UserContext)

    const initInputs = {
        filter: ''
    }

    const [pageList, setPageList] = useState(cowList)
    const [inputs, setInputs] = useState(initInputs)

    useEffect(() => {
        getCows()
        setPageList(cowList)
    }, [])

    const cardList = pageList.map(cow => <Card key={cow._id} {...cow} animal={'cow'} />)

    function handleChange(e){
        const { name, value } = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function sort(e){
        e.preventDefault()
        if (inputs.filter === 'none'){
            setPageList(cowList)
        } else {
            setPageList(() => cowList.filter(cow => cow.gender === inputs.filter))
        }        
    }

    return (
        <div className='cows'>
            <h1 className='cow-banner'>Our Cows</h1>
            <form onSubmit={sort} className='horseSort'>
                <label htmlFor='filter'>Filter by gender: </label>
                <select name='filter' onChange={handleChange}>
                    <option value='none'>--Choose Gender--</option>
                    <option value='Bull'>Bull</option>
                    <option value='Cow'>Cow</option>
                    <option value='Heifer'>Heifer</option>
                    <option value='Steer'>Steer</option>
                </select>
                <button>Filter</button>
            </form>
            {cardList}
        </div>
    )
}