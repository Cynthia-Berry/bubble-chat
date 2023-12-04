require('dotenv').config();

const express = require('express'), createError = require('http-errors');
const jwt = require("jsonwebtoken"), path = require('path'), websocket = require('ws');


global.appRoot = path.resolve(__dirname);
global.appName = 'Babble Chats';
global.version = 'v1';
global.patchVersion = 'v1.0.0';


const app = express();
const port = process.env.PORT || 8000;
require('./server/middlewares/utils/logger');
require('./server/config/database');
const authRouter = require('./server/routes/auth');
const userRouter = require('./server/routes/user');
const chatRouter = require('./server/routes/chat');
const MessageModel = require("./server/models/chat");


// set the req body (parses the body that comes with post/put requests )
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// set headers (handling cors error)
app.use((req, res, next) => {
	res.header("Accept", "application/json");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Credentials", 'true');
	next();
});

//routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

const server = app.listen(port, () =>
	console.log(`[${appName}]: Node Development Server is listening on localhost:${port}, open your browser on: http://localhost:${port}/`)
);

const webSocketServer = new websocket.WebSocketServer({server});
webSocketServer.on('connection', (connection, req) => {
	connection.isAlive = true;
	// Read username and id from the JWT of a connection instance
	const token = req.headers['sec-websocket-protocol']
	if(token) jwt.verify(token, process.env.TOKEN_KEY, {}, (err, userData) => {
		if(err) throw  err;
		const {userId, username} = userData;
		connection.userId = userId;
		connection.username = username;
	});

	//
	connection.on('message', async(message) => {
		const {recipient, text} = JSON.parse(message);
		if(recipient && text) {
			const messageDocument = await MessageModel.create({
				sender: connection.userId,
				recipient: recipient,
				text: text
			});

			[...webSocketServer.clients]
				.filter(client => client.userId === recipient)
				.forEach(client => client.send(JSON.stringify({
					text,
					recipient: recipient,
					sender: connection.userId,
					_id: messageDocument['_id']
				})))
		}
	});

	// Notify Users when of online connections
	[...webSocketServer.clients].forEach(client => {
		client.send(JSON.stringify({
			online: [...webSocketServer.clients].map(user => ({userId: user.userId, username: user.username}))
		}))
	})
});

webSocketServer.on('close', () => {
	console.log(`[DISCONNECTED]: User is Away at the moment`)
})

app.use((req, res, next) => {
	next(createError(404, 'This URL does not exist!'));
});

