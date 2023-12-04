import Avatar from "./Avatar.jsx";

const Contact = ({id, selected, username, handleSelected, online}) => {

  return (
		<div
				 className={`border-b border-gray-100 flex items-center gap-3 cursor-pointer ${selected ? 'bg-blue-50' : ''}`}
				 onClick={() => handleSelected(id)}>
			{selected && <div className="w-1 h-12 bg-blue-500 rounded-e-sm"/>}
			<div className="flex items-center gap-2 py-2 pl-2">
				<Avatar username={username} userId={id} online={online}/>
				<span className="text-gray-800">{username}</span>
			</div>
		</div>
	)
}

export default Contact;