import Card from './Card'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'

export default function HorseList(){

    const { horseList, getHorses } = useContext(UserContext)

    const initInputs = {
        filter: ''
    }

    const sortInputs = {
        arrange: ''
    }

    const [pageList, setPageList] = useState(horseList)
    const [inputs, setInputs] = useState(initInputs)
    const [sortBy, setSortBy] = useState(sortInputs)

    useEffect(() => {
        getHorses()
        setPageList(horseList.sort((a,b) => a.age - b.age))
    }, [])

    const cardList = pageList.map(horse => <Card key={horse._id} {...horse} animal={'horse'} />)

    function handleChange(e){
        const { name, value } = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function filterHorses(e){
        e.preventDefault()
        if (inputs.filter === 'none'){
            setPageList(horseList)
        } else {
            setPageList(() => horseList.filter(horse => horse.gender === inputs.filter))
        }        
    }

    function handleSortChange(e){
        const { name, value } = e.target
        setSortBy(prevSort => ({
            ...prevSort,
            [name]: value
        }))
    }

    function sortHorses(e){
        e.preventDefault()
        let sortField = sortBy.arrange
        let sortedList = []
        if (sortField[0] === '!') {
            sortField = sortField.slice(1)
            sortedList = [...pageList].sort((a, b) => {
                if (a[sortField] > b[sortField]) return -1
                if (a[sortField] < b[sortField]) return 1
                return 0
            })
        } else {
            sortedList = [...pageList].sort((a, b) => {
                if (a[sortField] > b[sortField]) return 1
                if (a[sortField] < b[sortField]) return -1
                return 0
            })
        }
        setPageList(sortedList)
    }

    return (
        <div className='horses'>
            <h1 className='horse-banner'>Our Performance Horses</h1>
            <form onSubmit={filterHorses} className='horseSort'>
                <label htmlFor='filter'>Filter by gender: </label>
                <select name='filter' onChange={handleChange}>
                    <option value='none'>--Choose Gender--</option>
                    <option value='Stud'>Stud</option>
                    <option value='Mare'>Mare</option>
                    <option value='Gelding'>Gelding</option>
                </select>
                <button>Filter</button>
            </form>
            <form onSubmit={sortHorses} className='horseSort'>
                <label htmlFor='sort'>Sort Horses by: </label>
                <select name='arrange' onChange={handleSortChange}>
                    <option value='age'>{'Age (Young to Old)'}</option>
                    <option value='!age'>{'Age (Old to Young)'}</option>
                    <option value='earnings'>{'Earnings (Low to High)'}</option>
                    <option value='!earnings'>{'Earnings (High to Low)'}</option>
                </select>
                <button>Sort</button>
            </form>
            {cardList}
        </div>
    )
}