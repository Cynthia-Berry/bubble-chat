const Avatar = ({username, userId, online}) => {
	const colors = ['bg-red-200', 'bg-teal-200', 'bg-orange-200', 'bg-blue-200', 'bg-purple-200', 'bg-lime-200'];
	const userIdBase10 = parseInt(userId, 16);
	const colorIndex = userIdBase10 % colors.length;
	const color = colors[colorIndex];

	return (
		<div className={`w-8 h-8 relative ${color} rounded-full flex items-center`}>
			<div className="text-center w-full opacity-70">{username[0]}</div>
			{online ? <span className="absolute w-3 h-3 bg-green-600 border border-white rounded-full bottom-0 right-0"/>
			: <span className="absolute w-3 h-3 bg-gray-400 border border-white rounded-full bottom-0 right-0"/>}
		</div>
	)
}

export default Avatar;