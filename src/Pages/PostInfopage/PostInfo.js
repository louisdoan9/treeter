import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import PostInfoLogic from './PostInfoLogic';
import PageSidebar from '../../Components/PageSidebar';
import CommentFunctions from '../../Components/CommentFunctions/CommentFunctions';
import PostFunctions from '../../Components/PostFunctions/PostFunctions';
import HomepageLogic from '../Homepage/HomepageLogic';

import './post.css';

function Post() {
	const { postId } = useParams();
	const { post, postComments, loading, getPostData, replyChain, setLoading } = PostInfoLogic(postId);
	const { AddComment } = CommentFunctions();
	const { LikePost, CommentPost, ViewPost, SharePost } = PostFunctions();
	const { getPFP, profilePictures } = HomepageLogic();

	const [viewed, setViewed] = useState(false);
	// false -> API fetch to count current view -> reload with updated views -> true

	useEffect(() => {
		getPostData();
		if (!viewed) {
			const reqOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					token: localStorage.getItem('token'),
				},
			};
			fetch('https://treeter-api.vercel.app/posts/' + postId + '/view', reqOptions).then((res) =>
				res.json().then((data) => {
					setViewed(true);
				})
			);
		}
	}, [viewed]);

	useEffect(() => {
		if (postComments && replyChain && post) {
			setLoading(false);
		}
	});

	useEffect(() => {
		if (document.getElementsByClassName('treet')[0]) {
			document.getElementsByClassName('treet')[0].scrollIntoView();
		}
	}, [loading]);

	return (
		<div className="post-info-page">
			<div className="post-info-content">
				{loading ? (
					<div>Loading...</div>
				) : (
					<div>
						<div className="reply-chain">
							{replyChain
								? replyChain.map((comment) => {
										if (comment) {
											return (
												<div className="reply-comment">
													<a className="reply-comment-content" href={comment._id}>
														<div className="reply-comment-title">
															<img
																src={
																	profilePictures[comment.author]
																		? profilePictures[comment.author]
																		: getPFP(comment.author)
																}
																alt=""
															/>
															<h4>{comment.author}</h4>
															{comment.updated ? (
																<p>updated {comment.timestamp}</p>
															) : (
																<p>on {comment.timestamp}</p>
															)}
														</div>
														<div className="reply-content">
															<p>{comment.content}</p>
															{comment.image ? <img src={comment.image} alt="" /> : ''}
														</div>
													</a>
													<div className="post-footer">
														<CommentPost post={comment} />
														<LikePost post={comment} getPosts={getPostData} />
														<ViewPost post={comment} />
														<SharePost link={comment._id} />
													</div>
												</div>
											);
										}
								  })
								: ''}
						</div>

						<div className="treet">
							<div className="treet-title">
								<img
									src={profilePictures[post.author] ? profilePictures[post.author] : getPFP(post.author)}
									alt=""
								/>
								<h3>{post.author}</h3>
								{post.updated ? <p>updated {post.timestamp}</p> : <p>on {post.timestamp}</p>}
							</div>
							<div className="treet-content">
								<p>{post.content}</p>
								<img src={post.image ? post.image : ''} alt="" />
							</div>
							<div className="treet-footer">
								<CommentPost post={post} />
								<LikePost post={post} getPosts={getPostData} />
								<ViewPost post={post} />
								<SharePost link={post._id} />
							</div>
						</div>

						<div className="post-comments">
							<AddComment postId={postId} getComments={getPostData} />
							{postComments
								? postComments.map((comment) => {
										if (comment) {
											return (
												<div className="post-comment">
													<a className="post-comment-content" href={comment._id}>
														<div className="post-comment-title">
															<img
																src={
																	profilePictures[comment.author]
																		? profilePictures[comment.author]
																		: getPFP(comment.author)
																}
																alt=""
															/>
															<h4>{comment.author}</h4>
															{comment.updated ? (
																<p>updated {comment.timestamp}</p>
															) : (
																<p>on {comment.timestamp}</p>
															)}
														</div>
														<div className="comment-content">
															<p>{comment.content}</p>
															{comment.image ? <img src={comment.image} alt="" /> : ''}
														</div>
													</a>
													<div className="post-footer">
														<CommentPost post={comment} />
														<LikePost post={comment} getPosts={getPostData} />
														<ViewPost post={comment} />
														<SharePost link={comment._id} />
													</div>
												</div>
											);
										}
								  })
								: ''}
						</div>
					</div>
				)}
			</div>
			<PageSidebar />
		</div>
	);
}

export default Post;
