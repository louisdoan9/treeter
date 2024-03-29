import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import PostInfoLogic from './PostInfoLogic';
import PageSidebar from '../../Components/PageSidebar';
import PostFunctions from '../../Components/PostFunctions/PostFunctions';
import HomepageLogic from '../Homepage/HomepageLogic';
import LoadingAnimation from '../../Components/LoadingAnimation/LoadingAnimation';

import defaultPFP from '../../Images/c027bec07c2dc08b9df60921dfd539bd.jpg';

import './PostInfo.css';

function Post() {
	const { postId } = useParams();
	const { post, postComments, loading, getPostData, replyChain, setLoading } = PostInfoLogic(postId);
	const { LikePost, AddComment, PostComments, ViewPost, SharePost, DeletePost } = PostFunctions();
	const { getPFP, profilePictures, fetchAllPFP } = HomepageLogic();
	const [userPFPs, setUserPFPs] = useState([]);

	useEffect(() => {
		if (postComments && replyChain && post) {
			fetchAllPFP([post].concat(replyChain).concat(postComments), setUserPFPs);
		}
	}, [post, postComments, replyChain]);

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

	// if api fetches finished for postComments, replyChain, post, set loading to false
	useEffect(() => {
		if (postComments && replyChain && post) {
			setLoading(false);
		}
	});

	// loading = false -> treet loaded -> loading = true -> scroll treet into view
	useEffect(() => {
		if (document.getElementsByClassName('treet')[0]) {
			let dims = document.getElementsByClassName('treet')[0].getBoundingClientRect();
			// accounts for sidebar header in mobile view
			const offset = window.innerWidth < 422 ? 120 : window.innerWidth < 801 ? 80 : 0;
			window.scrollTo(window.scrollX, dims.top - offset);
		}
	}, [loading]);

	if (post === 'Post Deleted') {
		window.scrollTo(0, 0);
		return (
			<div className="post-info-page">
				<div className="post-info-content">
					<p className="no-treet">Unable to find Treet</p>
				</div>
				<PageSidebar />
			</div>
		);
	}
	return (
		<div className="post-info-page">
			{loading ? (
				<div className="post-info-content">
					<LoadingAnimation />
				</div>
			) : (
				<div className="post-info-content">
					<div className="reply-chain">
						{replyChain
							? replyChain.map((comment) => {
									if (comment) {
										return (
											<div className="reply-comment">
												<a className="reply-comment-content" href={comment._id}>
													<div className="reply-comment-title">
														<img src={userPFPs[comment.author]} alt="" />
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
													<PostComments post={comment} />
													<LikePost post={comment} getPosts={getPostData} />
													<ViewPost post={comment} />
													<SharePost link={comment._id} />
												</div>
											</div>
										);
									} else if (comment === null) {
										return (
											<div className="reply-comment">
												<div className="deleted-treet">
													<img src={defaultPFP} alt="" srcset="" />
													<p>[ Treet Deleted ]</p>
												</div>
											</div>
										);
									}
							  })
							: ''}
						<div className="reply-chain-link"></div>
					</div>

					<div className="treet">
						<DeletePost postId={post._id} getPosts={getPostData} />
						<div className="treet-title">
							<img src={userPFPs[post.author]} alt="" />
							<h3>{post.author}</h3>
							{post.updated ? <p>updated {post.timestamp}</p> : <p>on {post.timestamp}</p>}
						</div>
						<div className="treet-content">
							<p>{post.content}</p>
							<img src={post.image ? post.image : ''} alt="" />
						</div>
						<div className="treet-footer">
							<PostComments post={post} />
							<LikePost post={post} getPosts={getPostData} />
							<ViewPost post={post} />
							<SharePost link={post._id} />
						</div>
						<AddComment postId={postId} getComments={getPostData} />
						{replyChain.length !== 0 ? <div className="treet-link"></div> : ''}
					</div>

					<div className="post-comments">
						{postComments
							? postComments.map((comment) => {
									if (comment) {
										return (
											<div className="post-comment">
												<a className="post-comment-content" href={comment._id}>
													<div className="post-comment-title">
														<img src={userPFPs[comment.author]} alt="" />
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
													<PostComments post={comment} />
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

			<PageSidebar />
		</div>
	);
}

export default Post;
