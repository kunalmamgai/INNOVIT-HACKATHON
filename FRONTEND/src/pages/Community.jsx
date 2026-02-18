import React, { useMemo, useState, useEffect } from 'react'

const communities = [
	{
		id: 1,
		name: 'Health Community',
		description: 'Share wellness tips, local healthcare insights, and preventive practices.',
		tags: ['Health', 'Wellness', 'Awareness'],
		members: '2.4k',
	},
	{
		id: 2,
		name: 'Culture Community',
		description: 'Discuss living traditions, art forms, and cultural stories from different regions.',
		tags: ['Culture', 'Traditions', 'Art'],
		members: '3.1k',
	},
	{
		id: 3,
		name: 'Religion Community',
		description: 'Connect respectfully around values, pilgrimages, festivals, and spiritual practices.',
		tags: ['Religion', 'Spirituality', 'Pilgrimage'],
		members: '1.8k',
	},
	{
		id: 4,
		name: 'Festivals Community',
		description: 'Explore festival calendars, rituals, travel plans, and celebration ideas.',
		tags: ['Festivals', 'Events', 'Travel'],
		members: '2.7k',
	},
	{
		id: 5,
		name: 'Technology Community',
		description: 'Talk about innovation, digital tools, and tech-driven community projects.',
		tags: ['Technology', 'Innovation', 'Startups'],
		members: '4.0k',
	},
]

// initial discussions are fetched from backend


export default function Community() {
	const [selectedCommunityId, setSelectedCommunityId] = useState(0)
	const [discussions, setDiscussions] = useState([])
	const [currentUser, setCurrentUser] = useState(null)
	const [showComments, setShowComments] = useState({})
	const [commentsByDiscussion, setCommentsByDiscussion] = useState({})
	const [newCommentText, setNewCommentText] = useState({})
	const [newCommentAuthor, setNewCommentAuthor] = useState({})
	const [liking, setLiking] = useState({})

	useEffect(() => {
		fetch('http://127.0.0.1:8000/discussions')
			.then((r) => r.json())
			.then((data) => setDiscussions(data))
			.catch(() => {})

		// load logged-in user from localStorage (App stores it as "currentUser")
		const saved = localStorage.getItem('currentUser')
		if (saved) {
			try {
				setCurrentUser(JSON.parse(saved))
			} catch (e) {}
		}

		// ensure we have a persistent guest id for anonymous likes
		let guest = localStorage.getItem('guestId')
		if (!guest) {
			guest = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9)
			localStorage.setItem('guestId', guest)
		}
	}, [])

	const filteredDiscussions = useMemo(() => {
		if (!selectedCommunityId) return discussions
		return discussions.filter((item) => item.communityId === selectedCommunityId)
	}, [selectedCommunityId, discussions])

	async function handleLike(discussionId) {
		if (liking[discussionId]) return
		setLiking((s) => ({ ...s, [discussionId]: true }))
		// optimistic UI
		setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, likes: (d.likes || 0) + 1 } : d)))
		try {
			const identifier = (currentUser && currentUser.user_id) || localStorage.getItem('guestId')
			const res = await fetch('http://127.0.0.1:8000/like', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ discussion_id: discussionId, user_id: identifier }),
			})
			const data = await res.json()
			setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, likes: data.likes } : d)))
		} catch (e) {
			console.error(e)
			// rollback optimistic update on error
			setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, likes: Math.max((d.likes||1)-1, 0) } : d)))
		} finally {
			setLiking((s) => ({ ...s, [discussionId]: false }))
		}
	}

	async function toggleComments(discussionId) {
		const isOpen = !!showComments[discussionId]
		if (!isOpen) {
			try {
				const res = await fetch(`http://127.0.0.1:8000/comments?discussion_id=${discussionId}`)
				const data = await res.json()
				setCommentsByDiscussion((prev) => ({ ...prev, [discussionId]: data }))
			} catch (e) {
				console.error(e)
			}
		}
		setShowComments((s) => ({ ...s, [discussionId]: !isOpen }))
	}

	async function postComment(discussionId) {
		const text = newCommentText[discussionId]
		const author = (currentUser && currentUser.user_id) || newCommentAuthor[discussionId] || 'anonymous'
		if (!text) return
		try {
			const res = await fetch('http://127.0.0.1:8000/comments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ discussion_id: discussionId, author, text }),
			})
			const newComment = await res.json()
			setCommentsByDiscussion((prev) => ({
				...prev,
				[discussionId]: [...(prev[discussionId] || []), newComment],
			}))
			// increment comment count locally
			setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, comments: (d.comments || 0) + 1 } : d)))
			setNewCommentText((s) => ({ ...s, [discussionId]: '' }))
		} catch (e) {
			console.error(e)
		}
	}

	async function deleteComment(commentId, discussionId) {
		if (!confirm('Delete this comment?')) return
		try {
			await fetch(`http://127.0.0.1:8000/comments?comment_id=${encodeURIComponent(commentId)}`, {
				method: 'DELETE',
			})
			// remove locally
			setCommentsByDiscussion((prev) => ({
				...prev,
				[discussionId]: (prev[discussionId] || []).filter((c) => c.comment_id !== commentId),
			}))
			setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, comments: Math.max((d.comments||1)-1, 0) } : d)))
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold text-blue">Community Hub</h1>
			<p className="text-gray-400 mt-2 text-sm">Join communities, discover conversations, and connect with people sharing similar interests.</p>

			<div className="mobile-side-scroll no-scrollbar flex gap-3 mt-6 pb-2">
				<button
					type="button"
					onClick={() => setSelectedCommunityId(0)}
					className={`px-4 py-2 rounded-full border whitespace-nowrap text-sm transition ${
						selectedCommunityId === 0
							? 'bg-gold text-gray-900 border-gold'
							: 'bg-gray-800 text-gray-200 border-gold/30 hover:border-gold/60'
					}`}
				>
					All Communities
				</button>
				{communities.map((community) => (
					<button
						key={community.id}
						type="button"
						onClick={() => setSelectedCommunityId(community.id)}
						className={`px-4 py-2 rounded-full border whitespace-nowrap text-sm transition ${
							selectedCommunityId === community.id
								? 'bg-gold text-gray-900 border-gold'
								: 'bg-gray-800 text-gray-200 border-gold/30 hover:border-gold/60'
						}`}
					>
						{community.name}
					</button>
				))}
			</div>

			<div className="grid lg:grid-cols-3 gap-6 mt-6">
				<aside className="lg:col-span-1 bg-gray-900 border border-gold/20 rounded p-4">
					<h2 className="text-gold font-semibold mb-3">Available Communities</h2>
					<div className="space-y-3">
						{communities.map((community) => (
							<div key={community.id} className="rounded border border-gold/20 p-3 bg-gray-800/70">
								<p className="font-semibold text-white">{community.name}</p>
								<p className="text-xs text-gray-300 mt-1">{community.description}</p>
								<p className="text-xs text-gold mt-2">{community.members} members</p>
							</div>
						))}
					</div>
				</aside>

				<section className="lg:col-span-2 space-y-4">
					{filteredDiscussions.map((discussion) => {
						const linkedCommunity = communities.find((community) => community.id === discussion.communityId)


						return (
							<article key={discussion.id} className="bg-gray-900 border border-gold/20 rounded p-4">
								<div className="flex items-center justify-between">
									<p className="text-white font-semibold">@{discussion.author}</p>
									<span className="text-xs text-gold">{linkedCommunity?.name}</span>
								</div>
								<p className="text-gray-200 mt-3">{discussion.text}</p>
								<div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
									<button type="button" onClick={() => handleLike(discussion.id)} disabled={!!liking[discussion.id]} className="hover:underline">❤️ {discussion.likes || 0} likes</button>
									<button type="button" onClick={() => toggleComments(discussion.id)} className="hover:underline">💬 {discussion.comments || 0} comments</button>
								</div>

								{showComments[discussion.id] && (
									<div className="mt-3 border-t pt-3">
										<div className="space-y-2">
											{(commentsByDiscussion[discussion.id] || []).map((c) => (
												<div key={c.comment_id} className="text-sm">
													<div className="flex justify-between items-start">
														<p className="text-xs text-gray-400">@{c.author} • <span className="text-gold">{new Date(c.created_at).toLocaleString()}</span></p>
														{currentUser && currentUser.user_id === c.author && (
															<button onClick={() => deleteComment(c.comment_id, discussion.id)} className="text-xs text-red-400 hover:underline">Delete</button>
														)}
													</div>
													<p className="text-gray-200">{c.text}</p>
												</div>
											))}
										</div>

										<div className="mt-3">
										{!currentUser ? (
											<input
												className="w-full mb-2 p-2 rounded bg-gray-800 text-white text-sm"
												placeholder="Your name (optional)"
												value={newCommentAuthor[discussion.id] || ''}
												onChange={(e) => setNewCommentAuthor((s) => ({ ...s, [discussion.id]: e.target.value }))}
											/>
										) : (
											<p className="text-xs text-gray-400 mb-2">Posting as <span className="text-gold">{currentUser.user_id}</span></p>
										)}
											<textarea
												className="w-full p-2 rounded bg-gray-800 text-white text-sm"
												rows={3}
												placeholder="Write a comment..."
												value={newCommentText[discussion.id] || ''}
												onChange={(e) => setNewCommentText((s) => ({ ...s, [discussion.id]: e.target.value }))}
											/>
											<div className="flex justify-end mt-2">
												<button type="button" onClick={() => postComment(discussion.id)} className="px-3 py-1 bg-gold rounded text-gray-900 text-sm">Post</button>
											</div>
										</div>
									</div>
								)}
							</article>
						)
					})}

					{filteredDiscussions.length === 0 && (
						<div className="bg-gray-900 border border-gold/20 rounded p-4 text-sm text-gray-300">
							No discussions available in this community yet.
						</div>
					)}
				</section>
			</div>
		</div>
	)
}
