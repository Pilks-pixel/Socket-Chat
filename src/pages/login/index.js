import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import "../register/register.css";
import { loginRoute } from "../../utils/apiRoutes";
import { ToastContainer, toast } from "react-toastify";
import { toastSucess, toastWarning } from "../../utils/notifications";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Login(props) {
	const [user, setUser] = useState({
		username: "",
		password: "",
	});

	const handleRegisterInput = e => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const goTo = useNavigate();

	// Form submission & validation
	const handleSubmit = async e => {
		e.preventDefault();

		if (handleUserValidation()) {
			const { username, password } = user;
			try {
				const resp = await axios.post(loginRoute, {
					username: username,
					password: password,
				});

				if (resp.data.status === true && resp.data.accessToken) {
					toast.success("Login Sucessful", toastSucess);
					localStorage.setItem("jwtToken", JSON.stringify(resp.data));
					axios.defaults.headers.common["Authorization"] =
						"Bearer" + resp.data.accessToken;
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
		if (user.password === "" || user.username === "") {
			toast.warn("must enter valid input", toastWarning);
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
				<h4 className='font-display font-semibold text-2xl capitalize'>
					login
				</h4>

				<form
					onSubmit={handleSubmit}
					className='bg-gray-200 w-[90%] max-w-4xl mx-auto my-5 p-4 flex flex-col justify-around items-center gap-4 shadow-md rounded-lg'
				>
					<input
						className='rounded p-1.5 min-width-custom mt-3'
						type='text'
						placeholder='name'
						value={user.username}
						name='username'
						onChange={handleRegisterInput}
					/>

					<input
						className='rounded p-1.5 min-width-custom mb-3'
						type='password'
						placeholder='password'
						value={user.password}
						name='password'
						onChange={handleRegisterInput}
					/>

					<input
						className='btn-primary bg-headings-purple text-black'
						type='submit'
						value='Sign in'
					/>
				</form>
			</div>

			<span className='font-display text-lg font-semibold text-white m-1'>
				Don't have an account?{" "}
			</span>
			<Link
				className='font-display text-lg font-semibold text-headings-purple m-1 hover:text-xl transition-all'
				to='/register'
			>
				Register
			</Link>

			<ToastContainer />
		</div>
	);
}
export default Login;
