import React, { useMemo, useState } from 'react'

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

const discussions = [
	{
		id: 1,
		communityId: 2,
		author: 'Ananya',
		text: 'What are your favorite cultural events to attend in winter?',
		likes: 32,
		comments: 11,
	},
	{
		id: 2,
		communityId: 4,
		author: 'Rahul',
		text: 'Looking for authentic food routes during upcoming festivals. Suggestions?',
		likes: 21,
		comments: 8,
	},
	{
		id: 3,
		communityId: 5,
		author: 'Sanya',
		text: 'Which apps are best for documenting local heritage sites with photos?',
		likes: 18,
		comments: 6,
	},
	{
		id: 4,
		communityId: 1,
		author: 'Vivek',
		text: 'Any ideas for a health awareness campaign at the neighborhood level?',
		likes: 26,
		comments: 13,
	},
]

export default function Community() {
	const [selectedCommunityId, setSelectedCommunityId] = useState(0)

	const filteredDiscussions = useMemo(() => {
		if (!selectedCommunityId) return discussions
		return discussions.filter((item) => item.communityId === selectedCommunityId)
	}, [selectedCommunityId])

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
									<span>❤️ {discussion.likes} likes</span>
									<span>💬 {discussion.comments} comments</span>
								</div>
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
