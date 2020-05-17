let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");
// Pusher
let Pusher = require("pusher");
let bodyParser = require("body-parser");
let Multipart = require("connect-multiparty");

/*--------------------------------- Secrets --------------------------------- */
require("dotenv").config();

/*--------------------------------- Pusher --------------------------------- */
let pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_APP_KEY,
	secret: process.env.PUSHER_APP_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	encrypted: true,
});

/*--------------------------------- Mock Data --------------------------------- */

// Users
let userslist = {
	a: {
		id: "a",
		nickname: "schimpanse",
		avatar:
			"https://www.abenteuer-regenwald.de/uploads/media/1060x450/05/175-orang-utan-abenteuer-regenwald.jpg?v=1-0",
	},
};

// Posts
let postslist = {
	a: {
		a: {
			id: "a",
			user: userslist["a"],
			caption: "Bananen sind lecker.",
			image:
				"https://www.gartenjournal.net/wp-content/uploads/Woher-kommen-Bananen.jpg",
		},
		b: {
			id: "b",
			user: userslist["a"],
			caption: "Zuhause 1",
			image:
				"https://www.regenwald-schuetzen.org/fileadmin/user_upload/Bilder/7_Kids/Wissen/wissen-amazonas-regenwald-oezi.jpg",
		},
		c: {
			id: "c",
			user: userslist["a"],
			caption: "Zuhause 2 🐾",
			image:
				"https://www.praxisvita.de/assets/styles/article_image/public/malaria-bildergalerie-regenwald.jpg?itok=0FuZ2uVq",
		},
	},
};

/*--------------------------------- Begin of Express App --------------------------------- */

// Schema
let schema = buildSchema(`
	type User {
	id : String!
	nickname : String!
	avatar : String!
	}
	type Post {
		id: String!
		user: User!
		caption : String!
		image : String!
	}
	type Query{
	user(id: String) : User!
	post(user_id: String, post_id: String) : Post!
	posts(user_id: String) : [Post]
	}
`);

// Resolver for each API endpoint
let root = {
	user: function ({ id }) {
		return userslist[id];
	},
	post: function ({ user_id, post_id }) {
		return postslist[user_id][post_id];
	},
	posts: function ({ user_id }) {
		return Object.values(postslist[user_id]);
	},
};

// Express App
let app = express();
app.use(cors());
app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
);

// add Middleware
let multipartMiddleware = new Multipart();

// trigger add a new post
app.post("/newpost", multipartMiddleware, (req, res) => {
	// create a sample post
	let post = {
		user: {
			nickname: req.body.name,
			avatar: req.body.avatar,
		},
		image: req.body.image,
		caption: req.body.caption,
	};

	// trigger pusher event
	pusher.trigger("posts-channel", "new-post", {
		post,
	});

	return res.json({ status: "Post created" });
});

// set port
app.listen(4000);
