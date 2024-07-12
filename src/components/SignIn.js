import { useState } from "react";

const SignIn = () => {

    const [formData, setFormData] = useState({
        userName: '',
        roomId: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value}))
    }

    return (
        <article>
            <h1>Sigin</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userName">Name</label>
                <input id="userName" name="userName" type="text" placeholder="Enter Name" value={formData.userName} onChange={handleChange}/>

                <label htmlFor="roomId">Room ID</label>
                <input id="roomId" name="roomId" type="text" value={formData.roomId} onChange={handleChange}/>

                <button type="submit">Enter</button>

            </form>
        </article>
    )
}

export default SignIn;