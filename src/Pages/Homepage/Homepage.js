import { useEffect, useState } from 'react';
import PageSidebar from '../../Components/PageSidebar';
import PostFunctions from '../../Components/PostFunctions/PostFunctions';
import HomepageLogic from './HomepageLogic';
import LoadingAnimation from '../../Components/LoadingAnimation/LoadingAnimation';
import './homepage.css';

function HomePage() {
	const { posts, loading, getPosts, uploadPFP, getPFP, profilePictures, fetchAllPFP } = HomepageLogic();
	const { AddPost, LikePost, PostComments, ViewPost, SharePost } = PostFunctions();
	const [userPFPs, setUserPFPs] = useState([]);

	useEffect(() => {
		getPosts();
	}, []);

	useEffect(() => {
		if (posts.length !== 0) {
			fetchAllPFP(posts.concat([{ author: localStorage.username }]), setUserPFPs);
		}
	}, [posts]);

	return (
		<div className="homepage">
			<div className="homepage-content">
				<div className="homepage-header">
					<h1>Home</h1>
					<div>
						<img src={userPFPs[localStorage.username]} alt="" />

						{/* for some reason, fixes pfp not showing up on mobile */}
						<p style={{ maxHeight: '0px', maxWidth: '0px', overflow: 'hidden' }}>
							{profilePictures[localStorage.username]}
						</p>

						<form onChange={uploadPFP}>
							<label htmlFor="image">Change PFP</label>
							<input
								style={{ display: 'none' }}
								type="file"
								id="image"
								name="image"
								accept="image/png, image/jpeg"
							></input>
						</form>
					</div>
				</div>
				<AddPost getPosts={getPosts} />
				{loading ? (
					<LoadingAnimation />
				) : (
					<div className="homepage-posts">
						{posts.map((post) => {
							return (
								<div className="homepage-post">
									<a className="homepage-post-content-container" href={post._id}>
										<div className="post-title">
											<img src={userPFPs[post.author]} alt="" />
											<h4>{post.author}</h4>
											{post.updated ? <p>updated {post.timestamp}</p> : <p>on {post.timestamp}</p>}
										</div>
										<div className="post-content">
											<p>{post.content}</p>
											{post.image ? <img src={post.image} alt="" /> : ''}
										</div>
									</a>
									<div className="post-footer">
										<PostComments post={post} />
										<LikePost post={post} getPosts={getPosts} />
										<ViewPost post={post} />
										<SharePost link={post._id} />
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
			<PageSidebar />
		</div>
	);
}

export default HomePage;
