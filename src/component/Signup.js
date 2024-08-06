

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
// import { handleError, handleSuccess } from '../utils'

function Signup() {

    const navigate = useNavigate()

    const [signInInfo, setSignInInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value)
        const copyLoginInfo = { ...signInInfo };
        // console.log(copyLoginInfo)
        copyLoginInfo[name] = value;
        setSignInInfo(copyLoginInfo)
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, email, password } = signInInfo;
        if (!name || !email || !password) {
            return toast.error('Name, email and password are required')
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(signInInfo)
            })
            const result = await response.json();
            const { success, message, error } = result;
            console.log(message)
            const messagee = [0]?.message || "Max 4 length";
            console.log(messagee)
            if (success) {
                // handleSuccess(message);
                toast.success(message)
                
                navigate('/login');
                
            } else if (error) {
                // console.log(error)
                // const details = error?.details[0].message;
                // handleError(details);
                toast.error(error?.[0].message)
            } else if (!success) {
                // handleError(message)
                toast.error(message)
            }
        } catch (err) {
            // handleError(err)
            toast.error(err)
        }
    }

    return (
        <div className='container box'>
            <h1>SignUp</h1>
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        value={signInInfo.name}
                        autoFocus
                        placeholder='Enter your Name...'
                    ></input>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        value={signInInfo.email}
                        placeholder='Enter your Email...'
                    ></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        value={signInInfo.password}
                        placeholder='Enter your Password...'
                    ></input>
                </div>
                <button type='submit'>SignUp</button>
                <span >Already have an Account? <Link className='spn' to="/login">Login</Link></span>
            </form>
            {/* <ToastContainer></ToastContainer> */}
        </div>
    )
}

export default Signup

