import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'

export default function Admin () {

    const { getHorses, getCows, newHorse, newCow, horseList, cowList, deleteHorse, deleteCow, addUser } = useContext(UserContext)

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        getHorses()
        getCows()
    }, [])

    const initInputs = {
        name: "",
        age: 0,
        brandNumber: 0,
        gender: "",
        sire: "",
        dam: "",
        registration: 0,
        earnings: "$",
        image: null,
        forSale: false
    }

    const initRemove = {
        _id: ''
    }

    const initNewAdmin = {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        passConfirm: '',
    }

    const [inputs, setInputs] = useState(initInputs)
    const [createHorse, setCreateHorse] = useState(false)
    const [createCow, setCreateCow] = useState(false)
    const [removeHorse, setRemoveHorse] = useState(false)
    const [deletedHorse, setDeletedHorse] = useState(initRemove)
    const [removeCow, setRemoveCow] = useState(false)
    const [deletedCow, setDeletedCow] = useState(initRemove)
    const [newAdmin, setNewAdmin] = useState(initNewAdmin)
    const [createAdmin, setCreateAdmin] = useState(false)

    function handleChange(e){
        const {name, value, files} = e.target 
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: files ? files[0] : value
        }))
    }

    function handleSubmit(e, destination, item){
        e.preventDefault()
        const formData = new FormData()
        for (const key in item) {
            formData.append(key, item[key])
        }

        if (destination === 'horse'){
            newHorse(formData)
        } else if (destination === 'cow'){
            newCow(formData)
        }
        setInputs(initInputs)
        setCreateCow(false)
        setCreateHorse(false)
        setRemoveHorse(false)
        setDeletedHorse(initRemove)
        setNewAdmin(initNewAdmin)
    }

    function makeHorse(){
        setCreateHorse(true)
        setCreateCow(false)
        setRemoveHorse(false)
        setRemoveCow(false)
        setNewAdmin(initNewAdmin)
        setCreateAdmin(false)
    }

    function cancelHorse(){
        setInputs(initInputs)
        setCreateHorse(false)
    }

    function makeCow(){
        setCreateCow(true)
        setCreateHorse(false)
        setRemoveHorse(false)
        setRemoveCow(false)
        setNewAdmin(initNewAdmin)
        setCreateAdmin(false)
    }

    function cancelCow(){
        setInputs(initInputs)
        setCreateCow(false)
    }

    function toggleHorse(){
        setRemoveHorse(!removeHorse)
        setCreateCow(false)
        setCreateHorse(false)
        setRemoveCow(false)
        setNewAdmin(initNewAdmin)
        setCreateAdmin(false)
    }

    function handleRemove(e){
        const { name, value } = e.target
        setDeletedHorse(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function eraseHorse(id){
        deleteHorse(id)
        setInputs(initInputs)
        setCreateCow(false)
        setCreateHorse(false)
        setRemoveHorse(false)
        setDeletedHorse(initRemove)
        setRemoveCow(false)
        setDeletedCow(initRemove)
        setNewAdmin(initNewAdmin)
        setCreateAdmin(false)
    }

    function toggleCow(){
        setRemoveCow(!removeCow)
        setCreateCow(false)
        setCreateHorse(false)
        setRemoveHorse(false)
        setNewAdmin(initNewAdmin)
        setCreateAdmin(false)
    }

    function handleCowRemove(e){
        const { name, value } = e.target
        setDeletedCow(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function eraseCow(id){
        deleteCow(id)
        setInputs(initInputs)
        setCreateCow(false)
        setCreateHorse(false)
        setRemoveHorse(false)
        setDeletedHorse(initRemove)
        setRemoveCow(false)
        setDeletedCow(initRemove)
        setNewAdmin(initNewAdmin)
    }

    function handleAdminChange(e){
        const { name, value } = e.target 
        setNewAdmin(prevAdmin => ({
            ...prevAdmin,
            [name]: value
        }))
    }

    function toggleNewAdmin(){
        setCreateAdmin(!createAdmin)
        setInputs(initInputs)
        setCreateCow(false)
        setCreateHorse(false)
        setRemoveHorse(false)
        setDeletedHorse(initRemove)
        setRemoveCow(false)
        setDeletedCow(initRemove)
        setNewAdmin(initNewAdmin)
    }

    function submitNewAdmin(e) {
        e.preventDefault()
        if (newAdmin.password === newAdmin.passConfirm) {
            const { passConfirm, ...adminWithoutPassConfirm } = newAdmin
            setNewAdmin(adminWithoutPassConfirm)
            addUser(adminWithoutPassConfirm)
            setNewAdmin(initNewAdmin)
            setCreateCow(false)
            setCreateHorse(false)
            setRemoveHorse(false)
            setDeletedHorse(initRemove)
            setRemoveCow(false)
            setDeletedCow(initRemove)
        } else {
            alert('Error: Passwords do not match')
        }
    }
    

    const horseOptions = horseList.map(horse => <option key={horse._id} value={horse._id}>{horse.name}</option>)
    const cowOptions = cowList.map(cow => <option key={cow._id} value={cow._id}>{cow.name}</option>)

    return (
        <div className='admin'>
            <h1 className='admin-banner'>Welcome, {user.firstName}!</h1>
            <h3>What would you like to do?</h3>
            <div className='admin-buttons'>
                {!createHorse && <button onClick={makeHorse}>Add Horse</button>}
                {createHorse && <button onClick={cancelHorse}>Cancel Horse</button>}
                {!createCow && <button onClick={makeCow}>Add Cow</button>}
                {createCow && <button onClick={cancelCow}>Cancel Cow</button>}
                <button onClick={toggleHorse}>{ removeHorse ? 'Cancel Horse Removal' : 'Delete Horse'}</button>
                <button onClick={toggleCow}>{ removeCow ? 'Cancel Cow Removal' : 'Delete Cow'}</button>
                <button onClick={toggleNewAdmin}>{ createAdmin ? 'Cancel Admin Creation' : 'Add Admin'}</button>
            </div>
            { createHorse && <form className='admin-form' onSubmit={(e) => handleSubmit(e, 'horse', inputs)}>
                <div>
                    <label htmlFor='name'>Name:</label>
                    <input name='name' value={inputs.name} onChange={handleChange} require/>
                </div>
                <div>
                    <label htmlFor='age'>Age:</label>
                    <input type='number' name='age' value={inputs.age} onChange={handleChange} require />
                </div>
                <div>
                    <label htmlFor='gender'>Gender:</label>
                    <select name='gender' value={inputs.gender} onChange={handleChange} require>
                        <option value=''>--Select Gender--</option>
                        <option value='Mare'>Mare</option>
                        <option value='Stud'>Stud</option>
                        <option value='Gelding'>Gelding</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='sire'>Sire:</label>
                    <input name='sire' value={inputs.sire} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='dam'>Dam:</label>
                    <input name='dam' value={inputs.dam} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='registration'>Registration:</label>
                    <input type='number' name='registration' value={inputs.registration} onChange={handleChange} require />
                </div>
                <div>
                    <label htmlFor='earnings'>Earnings:</label>
                    <input name='earnings' value={inputs.earnings} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='forSale'>For Sale:</label>
                    <input type='checkbox' name='forSale' value={inputs.forSale} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='image'>Horse Image:</label>
                    <input type='file' name='image' onChange={handleChange} accept='image/*' />
                </div>
                <button>Submit</button>
            </form>}
            { createCow && <form className='admin-form' onSubmit={(e) => handleSubmit(e, 'cow', inputs)}>
                <div>
                    <label htmlFor='name'>Name:</label>
                    <input name='name' value={inputs.name} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor='brandNumber'>Brand Number:</label>
                    <input type='number' name='brandNumber' value={inputs.brandNumber} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='gender'>Gender:</label>
                    <select name='gender' value={inputs.gender} onChange={handleChange}>
                        <option value=''>--Select Gender--</option>
                        <option value='Cow'>Cow</option>
                        <option value='Heifer'>Heifer</option>
                        <option value='Bull'>Bull</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='sire'>Sire:</label>
                    <input name='sire' value={inputs.sire} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='dam'>Dam:</label>
                    <input name='dam' value={inputs.dam} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='registration'>Registration:</label>
                    <input type='number' name='registration' value={inputs.registration} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='forSale'>For Sale:</label>
                    <input type='checkbox' name='forSale' value={true} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='image'>Cow Image:</label>
                    <input type='file' name='image' onChange={handleChange} accept='image/*' />
                </div>
                <button>Submit</button>
            </form>}
            { removeHorse && <div className='admin-form'>
                <select name='_id' value={deletedHorse._id} onChange={handleRemove}>
                    <option>--Choose A Horse--</option>
                    {horseOptions}
                </select>
                <button onClick={() => eraseHorse(deletedHorse._id)}>Delete Horse</button>
            </div> }
            { removeCow && <div className='admin-form'>
                <select name='_id' value={deletedCow._id} onChange={handleCowRemove}>
                    <option>--Choose A Cow--</option>
                    {cowOptions}
                </select>
                <button onClick={() => eraseCow(deletedCow._id)}>Delete Cow</button>
            </div> }
            { createAdmin && <form onSubmit={submitNewAdmin} className='admin-form'>
                <div>
                    <label htmlFor='firstName'>First Name:</label>
                    <input type='text' name='firstName' value={newAdmin.firstName} onChange={handleAdminChange} required />
                </div>
                <div>
                    <label htmlFor='lastName'>Last Name:</label>
                    <input type='text' name='lastName' value={newAdmin.lastName} onChange={handleAdminChange} required />
                </div>
                <div>
                    <label htmlFor='username'>Username:</label>
                    <input type='text' name='username' value={newAdmin.username} onChange={handleAdminChange} required />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input type='password' name='password' value={newAdmin.password} onChange={handleAdminChange} required />
                </div>
                <div>
                    <label htmlFor='passConfirm'>Confirm Password:</label>
                    <input type='password' name='passConfirm' value={newAdmin.passConfirm} onChange={handleAdminChange} required />
                </div>
                <button>Submit</button>
            </form>}
            <h1>Here are some site statistics:</h1>
            <div>
                <h2>There are:</h2>
                <p>{`${horseList.length} horse(s) listed`}</p>
                <p>{`${cowList.length} cow(s) listed`}</p>
            </div>
        </div>
    )
}