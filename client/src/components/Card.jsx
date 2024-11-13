import { useState, useContext } from 'react'
import { UserContext } from '../context/userContext'

export default function Card(props) {
    const { updateHorse, updateCow, token } = useContext(UserContext)

    const initInputs = {
        name: props.name,
        age: props.age,
        brandNumber: props.brandNumber,
        registration: props.registration,
        gender: props.gender,
        sire: props.sire,
        dam: props.dam,
        earnings: props.earnings,
        forSale: props.forSale || false,
        image: props.image || null
    }

    const [inputs, setInputs] = useState(initInputs)
    const [edit, setEdit] = useState(false)

    function handleChange(e) {
        const { name, value, type, checked, files } = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
    }

    function toggleEdit() {
        setEdit(!edit)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData()
        for (const key in inputs) {
            if (key === 'image' && inputs[key] instanceof File) {
                formData.append(key, inputs[key])
            } else {
                formData.append(key, inputs[key])
            }
        }
        if (props.animal === 'horse') {
            updateHorse(props._id, formData);
        } else if (props.animal === 'cow') {
            updateCow(props._id, formData);
        }
        setEdit(false)
    }

    return (
        <div className='card'>
            <div>
                <h1>{props.name}</h1>
                {props.forSale && <h2 style={{ color: 'maroon' }}>For Sale</h2>}
                {edit && (
                    <div>
                        <label htmlFor='forSale'>For Sale?</label>
                        <input
                            type='checkbox'
                            checked={inputs.forSale}
                            name='forSale'
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>
            <img src={props.image} alt={`${props.name} image`} />
            {edit && (
                <div>
                    <label htmlFor='image'>Update Image:</label>
                    <input
                        type='file'
                        name='image'
                        onChange={handleChange}
                    />
                </div>
            )}
            {props.brandNumber && <h2>Brand Number: {props.brandNumber}</h2>}
            {edit && (
                <div>
                    <label htmlFor='brandNumber'>Update Brand Number:</label>
                    <input
                        type='number'
                        value={inputs.brandNumber}
                        name='brandNumber'
                        onChange={handleChange}
                    />
                </div>
            )}
            {props.age && <h2>Age: {props.age}</h2>}
            {edit && (
                <div>
                    <label htmlFor='age'>Update Age:</label>
                    <input
                        type='number'
                        value={inputs.age}
                        name='age'
                        onChange={handleChange}
                    />
                </div>
            )}
            <p>Registration Number: {props.registration}</p>
            {edit && (
                <div>
                    <label htmlFor='registration'>Update Registration:</label>
                    <input
                        type='number'
                        value={inputs.registration}
                        name='registration'
                        onChange={handleChange}
                    />
                </div>
            )}
            <p>Gender: {props.gender}</p>
            {edit && (
                <div>
                    <label htmlFor='gender'>Update Gender:</label>
                    {props.animal === 'horse' && (
                        <select
                            name='gender'
                            value={inputs.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value=''>--Select Gender--</option>
                            <option value='Mare'>Mare</option>
                            <option value='Stud'>Stud</option>
                            <option value='Gelding'>Gelding</option>
                        </select>
                    )}
                    {props.animal === 'cow' && (
                        <select
                            name='gender'
                            value={inputs.gender}
                            onChange={handleChange}
                        >
                            <option value=''>--Select Gender--</option>
                            <option value='Cow'>Cow</option>
                            <option value='Heifer'>Heifer</option>
                            <option value='Bull'>Bull</option>
                        </select>
                    )}
                </div>
            )}
            <p>Sire: {props.sire}</p>
            {edit && (
                <div>
                    <label htmlFor='sire'>Update Sire:</label>
                    <input
                        type='text'
                        value={inputs.sire}
                        name='sire'
                        onChange={handleChange}
                    />
                </div>
            )}
            <p>Dam: {props.dam}</p>
            {edit && (
                <div>
                    <label htmlFor='dam'>Update Dam:</label>
                    <input
                        type='text'
                        value={inputs.dam}
                        name='dam'
                        onChange={handleChange}
                    />
                </div>
            )}
            {props.earnings && <p>Earnings: {props.earnings}</p>}
            {edit && (
                <div>
                    <label htmlFor='earnings'>Update Earnings:</label>
                    <input
                        type='number'
                        value={inputs.earnings}
                        name='earnings'
                        onChange={handleChange}
                    />
                </div>
            )}
            {token && (
                <button onClick={toggleEdit}>
                    {edit ? 'Cancel Edit' : 'Edit Animal'}
                </button>
            )}
            {edit && (
                <button onClick={handleSubmit}>Save Changes</button>
            )}
        </div>
    );
}