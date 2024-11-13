import { useState, createContext } from "react"
import axios from "axios"

export const UserContext = createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default function UserProvider(props) {
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        posts: JSON.parse(localStorage.getItem("userPosts")) || []
    }

    const initHorses = JSON.parse(localStorage.getItem('horseList')) || []

    const initCows = JSON.parse(localStorage.getItem('cowList')) || []

    const [userState, setUserState] = useState(initState)
    const [horseList, setHorseList] = useState(initHorses)
    const [cowList, setCowList] = useState(initCows)

    // Auth functions
    function login(credentials) {
        axios.post('/api/auth/login', credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setUserState(prevUserState => ({
                    ...prevUserState,
                    user,
                    token
                }))
                window.location.reload()
            })
            .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    function addUser(credentials){
        axios.post('/api/auth/signup', credentials)
            .then(res => alert('New Admin Created'))
            .catch(err => console.log(err))
    }

    function handleAuthErr(errMsg) {
        setUserState(prevState => ({
            ...prevState,
            errMsg
        }))
    }

    function resetAuthErr() {
        setUserState(prevState => ({
            ...prevState,
            errMsg: ""
        }))
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userPosts")
        localStorage.removeItem('pubPosts')
        localStorage.removeItem('comments')
        setUserState({
            user: {},
            token: "",
            posts: []
        })
    }

    // horse functions
    function newHorse(horse) {
        userAxios.post('/api/cred/horses', horse)
            .then(res => {
                setHorseList(prevList => [...prevList, res.data])
                alert(`Successfully added ${res.data.name} to the Database`)
        })
            .catch(err => console.log(err))
    }

    function getHorses(){
        axios.get('/api/horses')
            .then(res => {
                setHorseList(res.data)
                localStorage.setItem('horseList', JSON.stringify(horseList))
            })
            .catch(err => console.log(err))
    }

    function deleteHorse(id){
        userAxios.delete(`/api/cred/horses/${id}`)
            .then(() => {
                alert('Horse removed from Database')
                setHorseList(prevList => prevList.filter(horse => horse._id !== id))
            })
            .catch(err => console.log(err))
    }

    function updateHorse(id, updates){
        userAxios.put(`/api/cred/horses/${id}`, updates)
            .then(res => {
                alert(`Successfully updated ${res.data.name}`)
                setHorseList(prevList => prevList.map(horse => horse._id === id ? res.data : horse))
            })
            .catch(err => console.log(err))
    }

    // cow functions
    function getCows(){
        axios.get('/api/cows')
            .then(res => {
                setCowList(res.data)
                localStorage.setItem('cowList', JSON.stringify(cowList))
            })
            .catch(err => console.log(err))
    }

    function newCow(cow){
        userAxios.post('/api/cred/cows', cow)
            .then(res => {
                setCowList(prevList => [...prevList, res.data])
                alert(`Successfully added ${res.data.name} to the Database`)
        })
            .catch(err => console.log(err))
    }

    function deleteCow(id){
        userAxios.delete(`/api/cred/cows/${id}`)
        .then(() => {
            alert('Cow removed from Database')
            setCowList(prevList => prevList.filter(cow => cow._id !== id))
        })
            .catch(err => console.log(err))
    }

    function updateCow(id, updates){
        userAxios.put(`/api/cred/cows/${id}`, updates)
            .then(res => {
                alert(`Successfully updated ${res.data.name}`)
                setCowList(prevList => prevList.map(cow => cow._id === id ? res.data : cow))
            })
            .catch(err => console.log(err))
    }

    return (
        <UserContext.Provider
            value={{
                // user items
                ...userState,
                setUserState,
                login,
                logout,
                handleAuthErr,
                resetAuthErr,
                addUser,
                // horse items
                horseList,
                newHorse,
                getHorses,
                setHorseList,
                deleteHorse,
                updateHorse,
                // cow items
                cowList,
                getCows,
                newCow,
                deleteCow,
                updateCow
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}