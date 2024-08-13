import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {validatePassword} from '../util'
const Register = () => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    console.log(errorMessage,'errorMessage')
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post( 'http://localhost:3000/auth/signup', {username, email, password})
        .then(result => {
            if(result.data.statusCode === 403){
                alert("E-mail already registered! Please Login to proceed.");
                navigate('/login');
            }
            else{
                // localStorage.setItem("accessToken",result.data.access_token);
                alert("Registered successfully! Please Login to proceed.")
                navigate('/login');
            }
            
        })
        .catch(err => console.log(err));
    }

    const onChangePassword = (password) => {
        const validationError =  validatePassword(password)
        setErrorMessage(validationError);
        if(!validationError){
            setPassword(password)
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100" style= {{backgroundImage : "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))"}}>
                <div className="bg-white p-3 rounded" style={{width : '40%'}}>
                    <h2 className='mb-3 text-primary'>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="username" className="form-label">
                                <strong >User Name</strong>
                            </label>
                            <input 
                                type="text"
                                placeholder="Enter Name"
                                className="form-control" 
                                id="username" 
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="email" className="form-label">
                                <strong>Email</strong>
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                className="form-control" 
                                id="email" 
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="password" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter Password"
                                className="form-control" 
                                id="password" 
                                onChange={(event) => onChangePassword(event.target.value)}
                                required
                            />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        </div>
                        <button type="submit" disabled={errorMessage ? true : false} className="btn btn-primary">Register</button>
                    </form>

                    <p className='container my-2'>Already have an account ?</p>
                    <Link to='/login' className="btn btn-secondary">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register