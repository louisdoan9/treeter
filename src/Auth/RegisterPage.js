import { useState } from 'react';

function RegisterPage({ setCurrentPage }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		setError('');
		fetch('https://treeter-api.vercel.app/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username, password: password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					fetch('https://treeter-api.vercel.app/login', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ username: username, password: password }),
					})
						.then((response) => response.json())
						.then((data) => {
							localStorage.setItem('token', data.token);
							localStorage.setItem('username', data.username);
							window.location.reload();
						});
				}
			});
	}

	return (
		<div className="authentication-page">
			<h1>Register</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					minLength={4}
				/>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={4}
				/>
				<button type="submit">Submit</button>
			</form>
			<button onClick={() => setCurrentPage('StartPage')}>Back</button>
			{error !== '' ? <p className="error-message">{error}</p> : ''}
		</div>
	);
}

export default RegisterPage;
