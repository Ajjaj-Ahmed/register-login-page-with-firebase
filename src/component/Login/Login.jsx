import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useRef, useState } from "react";



const Login = () => {
  const auth = getAuth(app)
  const refEmail=useRef()
  const [confirmSms, setConfirmSms] = useState(null);
  const [errorSms,setErrorSms] = useState(null);
  const handleSignin= e =>{
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

   signInWithEmailAndPassword(auth,email,password)
   .then(result=>{
    const userData = result.user;
    setConfirmSms('Login successfully')
    console.log(userData);
   })
   .catch(error=>alert(error.message))
  }

  const handleForgetPassword=()=>{
      const email = refEmail.current.value;

      /* update state */
      setConfirmSms('')


      if(!email){
        setErrorSms('Type your email first')
        return
      }
      else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
          setErrorSms('Type a valid email')
          return
      }

      sendPasswordResetEmail(auth,email)
      .then(()=>{
        alert('PassWord reset email send');
        setErrorSms('')
      })
      .catch(error=>alert(error.message))
  }
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold">Login Form</h2>
      <form onSubmit={handleSignin} className="flex flex-col gap-4 w-3/5 mx-auto mt-5">

        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="email" 
        ref={refEmail} name="email" 
        id="emailField" placeholder="Email Address" required/>

        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="password" name="password" id="passwordField" placeholder="Password" required/>
       <p onClick={handleForgetPassword}>forget Password !</p>
        <input className="border-1 py-2 bg-gray-100 rounded-lg" type="submit" value="Login" />
      </form>
      {
        confirmSms && <p className="text-xl text-green-700 text-center">{confirmSms}</p>
      }
      {
        errorSms && <p className="text-xl text-red-700 text-center mt-4">{errorSms}</p>
      }
    </div>
  );
};

export default Login;