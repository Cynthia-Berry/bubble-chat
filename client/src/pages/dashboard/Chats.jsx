import {useEffect, useRef, useState} from "react";
import {unionBy} from "lodash";
import Logo from "../../components/Logo.jsx";
import SendIcon from "../../components/SendIcon.jsx";
import {Configs, Loading} from "../../utils/helpers/constants.js";
import CookieHelper from "../../utils/helpers/cookieHelper.js";
import APIService from "../../utils/services/api.service.js";
import Contact from "../../components/Contact.jsx";


const Chats = () => {
	const scrollToLastMessage = useRef();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [websocket, setWebsocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState({});
	const [offlineUsers, setOfflineUsers] = useState({});
	const [selectedUserId, setSelectedUserId] = useState(null);
	const id = CookieHelper.get(Configs.USER_ID);


	useEffect(() => {
		fetchMessages().then();
	}, [selectedUserId]);

	useEffect(() => {
		getUsers().then();
	}, [onlineUsers]);

	useEffect(() => {
		connectToWebsocket()
	}, []);


	useEffect(() => {
		const div = scrollToLastMessage.current;
		if(div) div.scrollIntoView({behavior: 'smooth', block: 'end'});
	}, [messages]);

	const getUsers = async() => {
		const {data: responseData} = await APIService.getAllUsers();
		if(responseData.status === Loading.SUCCESS) {
			const offlineUsersArr = responseData.data
				.filter(user => user._id !== id)
				.filter(user => !Object.keys(onlineUsers).includes(user._id));
			const offline = {};
			offlineUsersArr.forEach(each => {
				offline[each._id] = each.username;
			})
			setOfflineUsers(offline);
		}
	}

	const fetchMessages = async() => {
		if(selectedUserId) {
			const {data: responseData} = await APIService.getMessagesById(selectedUserId);
			if(responseData.status === Loading.SUCCESS) setMessages(prevState => ([...prevState, ...responseData.data]));
		}
	};

	const connectToWebsocket = () => {
		const ws = new WebSocket(`ws://localhost:8080`, CookieHelper.get(Configs.KEY));
		setWebsocket(ws);
		ws.addEventListener('message', handleMessaging);
		ws.addEventListener('close', () => {
			setTimeout(() => {
				console.log(`[DISCONNECTED]: Trying to reconnect`);
				connectToWebsocket();
			}, 1000)
		});
	}

	const showOnlineUsers = (usersArray) => {
		const users = {};
		usersArray.forEach(({userId, username}) => users[userId] = username);
		setOnlineUsers(users);
	};

	const handleMessaging = (event) => {
		const data = JSON.parse(event['data']);
		if('online' in data) showOnlineUsers(data.online);
		else if('text' in data) setMessages(prev => ([...prev, {...data}]
		));
	};

	const fetchSelectedUserMessage = id => {
		setSelectedUserId(id);

	}

	const sendMessage = event => {
		event.preventDefault();
		websocket.send(JSON.stringify({
			recipient: selectedUserId,
			text: newMessage,
		}));
		setNewMessage("");
		setMessages(prev => ([...prev, {text: newMessage, recipient: selectedUserId, sender: id, _id: Date.now()}]
		));
	}


	const onlineUserExcludingCurrentUser = {...onlineUsers};
	delete onlineUserExcludingCurrentUser[id];
	const messageWithoutDups = unionBy(messages, '_id')

	return (
		<div className="flex h-screen">
			<div className="bg-white w-1/3 pt-4">
				<Logo/>
				{Object.keys(onlineUserExcludingCurrentUser).map(userId => (
					<Contact key={userId} id={userId} username={onlineUserExcludingCurrentUser[userId]} selected={userId === selectedUserId}
									 online={true} handleSelected={id => setSelectedUserId(id)}/>
				))
				}
				{offlineUsers && Object.keys(offlineUsers).map(userId => (
					<Contact key={userId} id={userId} username={offlineUsers[userId]} selected={userId === selectedUserId}
									 online={false} handleSelected={id => setSelectedUserId(id)}/>
				))
				}
			</div>
			<div className="flex flex-col bg-blue-50 w-2/3 p-2">
				<div className="flex-grow">
					{!selectedUserId && <div className="flex items-center justify-center h-full">
						<div className="text-gray-400"> &larr; Select a Contact to chat with</div>
					</div>
					}
					{
						!!selectedUserId &&
						<div className="relative h-full pb-4">
							<div className="overflow-y-scroll absolute left-0 right-0 top-0 bottom-2">
								{messageWithoutDups.map(message => (
									<div key={message._id} className={`${message.sender === id ? 'text-right' : 'text-left'}`}>
										<div
											className={`my-2 p-2 w-3/5 text-left rounded-md text-sm inline-block ${message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}>
											{message.text}
										</div>
									</div>
								))}
								<div ref={scrollToLastMessage}></div>
							</div>
						</div>
					}
				</div>
				{!!selectedUserId &&
					<div className="flex gap-2">
						<input placeholder="Enter your message..." className="bg-white border rounded-sm p-2 flex-grow"
									 value={newMessage} onChange={event => setNewMessage(event.target.value)}/>
						<button className="bg-blue-500 rounded-sm p-2 text-white" onClick={sendMessage}><SendIcon/></button>
					</div>
				}
			</div>
		</div>
	)
}

export default Chats;