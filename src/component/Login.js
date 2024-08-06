import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
// import { handleError, handleSuccess } from '../utils'

function Login() {
    const navigate = useNavigate()

    const[loginInInfo, setLoginInInfo] = useState({   
        email: '',
        password: ''
    })

    const handleChange =(e) => {
        const {name, value} = e.target;
        // console.log(name, value)
        const copyLoginInfo = {...loginInInfo};
        console.log(copyLoginInfo)
        copyLoginInfo[name] = value;
        setLoginInInfo(copyLoginInfo)
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInInfo;
    
        if (!email || !password) {
            return toast.error("Email and password are required");
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInInfo)
            });
    
            const result = await response.json();
            const { success, message, token, error, user } = result;
            console.log(result)
            const nameUser = user?.name;
    
            if (success) {
                toast.success(message);
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('loggedInUser', nameUser);
                navigate('/home');
            } 
            else if (error) {
                const details = error?.[0]?.message || 'Max 4 length';
                toast.error(details);
            } 
            else {
                toast.error(message);
            }
        } 
        catch (err) {
            toast.error('An unexpected error occurred');
        }
    };
    
  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        
        <div>
            <label htmlFor="email">Email</label>
            <input
                onChange={handleChange}
                type='email'
                name='email'
                value={loginInInfo.email}
                placeholder='Enter your Email...'
            ></input>
            
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input
                onChange={handleChange}
                type='password'
                name='password'
                value={loginInInfo.password}
                placeholder='Enter your Password...'
            ></input>
            
        </div>
        <button type='submit'>Login</button>
        <span >Does't have an Account? <Link className='spn' to="/signup">Sign Up</Link></span>
      </form>
      {/* <ToastContainer></ToastContainer> */}
    </div>
  )
}

export default Login


// Login.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { handleError, handleSuccess } from '../utils';

// function Login() {
//     const navigate = useNavigate();

//     const [loginInInfo, setLoginInInfo] = useState({
//         email: '',
//         password: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const copyLoginInfo = { ...loginInInfo };
//         copyLoginInfo[name] = value;
//         setLoginInInfo(copyLoginInfo);
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         const { email, password } = loginInInfo;
//         if (!email || !password) {
//             return handleError('Email and password are required');
//         }
//         try {
//             const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': "application/json"
//                 },
//                 body: JSON.stringify(loginInInfo)
//             });
//             const result = await response.json();
//             const { success, message, token, error } = result;

//             if (success) {
//                 handleSuccess(message);
//                 localStorage.setItem('jwtToken', token);
//                 localStorage.setItem('loggedInUser', result.user.name);
//                 setTimeout(() => {
//                     navigate('/home');
//                 }, 1000);
//             } else if (error) {
//                 const details = error?.[0]?.context?.message || error?.message || 'An error occurred';
//                 handleError(details);
//             } else if (!success) {
//                 handleError(message);
//             }
//         } catch (err) {
//             handleError(err.message);
//         }
//     };

//     return (
//         <div className='container'>
//             <h1>Login</h1>
//             <form onSubmit={handleLogin}>
//                 <div>
//                     <label htmlFor="email">Email</label>
//                     <input
//                         onChange={handleChange}
//                         type='email'
//                         name='email'
//                         value={loginInInfo.email}
//                         placeholder='Enter your Email...'
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="password">Password</label>
//                     <input
//                         onChange={handleChange}
//                         type='password'
//                         name='password'
//                         value={loginInInfo.password}
//                         placeholder='Enter your Password...'
//                     />
//                 </div>
//                 <button type='submit'>Login</button>
//                 <span>Does't have an Account? <Link className='spn' to="/signup">Sign Up</Link></span>
//             </form>
//             <ToastContainer />
//         </div>
//     );
// }

// export default Login;
