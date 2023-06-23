import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import "./register.css";
import { registerRoute } from "../../utils/apiRoutes";
import { ToastContainer, toast } from "react-toastify";
import { toastSucess, toastWarning } from "../../utils/notifications";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Register() {
	const [user, setUser] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleRegisterInput = e => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const goTo = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();

		if (handleUserValidation()) {
			const { username, email, password } = user;
			try {
				const resp = await axios.post(registerRoute, {
					username: username,
					email: email,
					password: password,
				});

				if (resp.data.status === true) {
					toast.success("Account created!", toastSucess);
					localStorage.setItem("jwtToken", JSON.stringify(resp.data));
					goTo("/");
				} else if (resp.data.status === false) {
					throw toast.warn(resp.data.msg, toastWarning);
				}
			} catch (err) {
				console.error(err);
			}
		}
	};

	const handleUserValidation = () => {
		if (user.password !== user.confirmPassword) {
			toast.warn("passwords must match!", toastWarning);
			return false;
		} else if (user.username.length < 3) {
			toast.warn("username must be at least 3 characters long", toastWarning);
			return false;
		} else if (user.password.length < 6) {
			toast.warn("password must be at least 6 characters long", toastWarning);
			return false;
		} else {
			return true;
		}
	};

	return (
		<div className='text-white'>
			<h3 className='font-display font-semibold text-3xl tracking-wider uppercase my-[10vh]'>
				Pixel Chat
			</h3>
			<div className='text-black bg-stone-50 w-[90%] max-w-xl mx-auto my-5 p-[2%] rounded-lg'>
				<h3 className='font-display font-semibold text-2xl capitalize' >register</h3>

				<form onSubmit={handleSubmit} className='bg-gray-200 w-[90%] max-w-4xl mx-auto my-5 p-4 flex flex-col justify-around items-center gap-4 shadow-md rounded-lg'>
					<input
						type='text'
						placeholder='name'
						value={user.username}
						name='username'
						onChange={handleRegisterInput}
						className='rounded p-1.5 min-width-custom mt-3'
					/>

					<input
						type='email'
						placeholder='email'
						value={user.email}
						name='email'
						onChange={handleRegisterInput}
						className='rounded p-1.5 min-width-custom'
					/>

					<input
						type='password'
						placeholder='password'
						value={user.password}
						name='password'
						onChange={handleRegisterInput}
						className='rounded p-1.5 min-width-custom'
					/>

					<input
						type='password'
						placeholder='confirm password'
						value={user.confirmPassword}
						name='confirmPassword'
						onChange={handleRegisterInput}
						className='rounded p-1.5 min-width-custom mb-3'
					/>

					<input type='submit' value='Register' className='btn-primary bg-headings-purple text-black' />
				</form>


				<ToastContainer />
			</div>
				<span className='font-display text-lg font-semibold text-white m-1'>Already have an account? </span>
				<Link className='font-display text-lg font-semibold text-headings-purple m-1 hover:text-xl transition-all' to='/login'>Login</Link>
		</div>
	);
}
export default Register;
