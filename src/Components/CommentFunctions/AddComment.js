import { useEffect, useState } from 'react';

function CommentForm({ postId, getComments }) {
	const [content, setContent] = useState('');
	const [commentFlag, setCommentFlag] = useState(false);

	useEffect(() => {
		fetch('https://treeter-api.vercel.app/posts/' + postId, {
			headers: {
				'Content-Type': 'application/json',
				token: localStorage.getItem('token'),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data === null) {
					setCommentFlag(true);
				}
			});
	}, [postId]);

	function replyPost(e) {
		e.preventDefault();
		let timestamp = new Date();
		timestamp = timestamp.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});

		if (e.target.elements.commentImage.files[0]) {
			let reader = new FileReader();
			reader.readAsDataURL(e.target.elements.commentImage.files[0]);
			reader.onloadend = () => {
				const image = reader.result;
				fetch('https://treeter-api.vercel.app/posts/' + postId + '/comment', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						token: localStorage.getItem('token'),
					},
					body: JSON.stringify({ content: content, timestamp: timestamp, image: image }),
				}).then(() => getComments());
				setContent('');
			};
		} else {
			fetch('https://treeter-api.vercel.app/posts/' + postId + '/comment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					token: localStorage.getItem('token'),
				},
				body: JSON.stringify({ content: content, timestamp: timestamp }),
			}).then(() => getComments());
			setContent('');
		}
	}

	function replyComment(e) {
		e.preventDefault();
		let timestamp = new Date();
		timestamp = timestamp.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});

		if (e.target.elements.commentImage.files[0]) {
			let reader = new FileReader();
			reader.readAsDataURL(e.target.elements.commentImage.files[0]);
			reader.onloadend = () => {
				const image = reader.result;
				fetch('https://treeter-api.vercel.app/comments/' + postId + '/comment', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						token: localStorage.getItem('token'),
					},
					body: JSON.stringify({ content: content, timestamp: timestamp, image: image }),
				}).then(() => getComments());
				setContent('');
			};
		} else {
			fetch('https://treeter-api.vercel.app/comments/' + postId + '/comment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					token: localStorage.getItem('token'),
				},
				body: JSON.stringify({ content: content, timestamp: timestamp }),
			}).then(() => getComments());
			setContent('');
		}
	}

	return (
		<div className="post-form">
			<form onSubmit={commentFlag ? replyComment : replyPost}>
				<textarea
					type="text"
					name="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					maxLength="250"
					placeholder="Treet your reply!"
				/>
				<label htmlFor="commentImage">Upload Image</label>
				<input type="file" id="commentImage" name="commentImage" accept="image/png, image/jpeg"></input>
				<button type="submit">Comment</button>
			</form>
		</div>
	);
}

export default CommentForm;
