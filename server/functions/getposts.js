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

exports.handler = function (event, context, callback) {
	callback(null, {
		statusCode: 200,
		body: JSON.stringify(postslist),
	});
};
