import app from "../../firebase/firebase.config";
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth"
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";


const Registration = () => {
  const auth = getAuth(app)
  const [showPassword, setShowPassword] = useState(false);
  const [confirmSms, setConfirmSms] = useState(null);
  const[errorSms, setErrorSms] = useState(null);


  const handleSubmit = e =>{
      e.preventDefault();
      const name= e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const terms = e.target.terms.checked;
      const url = e.target.urlField.checked;
      //console.log(name,email, password)

      /* clear state data */
      setConfirmSms('');
      setErrorSms('');

      /* name shortly varification */
      if(/[0-9]/.test(name)){
        setErrorSms('type valid name');
        return;
      }
      /* password varification */
      else if(password.length<6){
        setErrorSms('Password should more than 6')
        return;
      } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)){
        setErrorSms('use a valid password')
        return
        
      }
      /* terms and codition */
      else if(!terms){
        setErrorSms(' Please accept our terms and condition')
      }

      /* send data to firebase */
      createUserWithEmailAndPassword(auth,email,password)
      .then(result=>{
        const userdata = result.user;

         /* update user profile (manage users) */
         updateProfile(userdata,{
          displayName: name,
          photoURL: url
        })
        
        /* send a varification email from (manage users) */
        sendEmailVerification(userdata)
        .then(()=>setConfirmSms('varify your email'))
        .catch(()=>setErrorSms('eror ! Cant send varification email'))

       
        .then(()=>console.log('profile updated'))
        .catch(()=>console.log('cant update profile'))
        
        console.log(userdata);
      })
      .catch(error=>{
        setErrorSms(error);
      })



      /* Clear form data */
      document.getElementById('nameField').value ='';
      document.getElementById('emailField').value = '';
      document.getElementById('passwordField').value ='';
      document.getElementById('urlField').value = '';
  }
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold">Registration Form</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-3/5 mx-auto mt-5">
        {/* Name */}
        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="text" name="name" id="nameField" placeholder="Your Name" required />
        {/* Email Address */}
        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="email" name="email" id="emailField" placeholder="Email Address" required/>
        {/* password filed */}
        <div className="relative">
        <input className="border-1 py-2 w-full bg-gray-100 rounded-lg" 
        type={showPassword? 'text' : 'password'} name="password" 
        id="passwordField" 
        placeholder="Password" required/>

        <span className="absolute top-3 right-2" onClick={()=>setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash />: <IoEyeSharp />}
        </span>

        </div>
        
        {/* image url */}
        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="url" name="url" id="urlField" placeholder="Image Link" />
        {/* terms and condition */}
        <div className="flex items-center gap-2">
        <input type="checkbox" name="terms" id="terms" />
        <label htmlFor="terms">Please accept our <Link to='/'>terms and condition</Link></label>
        </div>
        {/* submit */}
        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="submit" value="Submit" />
      </form>
      {confirmSms && <p className="text-green-700 text-xl font-medium text-center mt-5">{confirmSms}</p>}
      
      {errorSms && <p className="text-red-700 text-xl text-center mt-5">{errorSms}</p>}
    </div>
  );
};

export default Registration;