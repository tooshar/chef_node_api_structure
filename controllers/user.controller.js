const {
	User
} = require('../models');
const authService = require('../services/auth.service');
const {
	to,
	ReE,
	ReS
} = require('../services/util.service');

const signup = async function (req, res) {
	const body = req.body;

	if (!body.unique_key && !body.email && !body.phone) {
		return ReE(res, 'Please enter an email or phone number to register.');
	} else if (!body.password) {
		return ReE(res, 'Please enter a password to register.');
	} else {
		let err, user;

		[err, user] = await to(authService.createUser(body));

		if (err) return ReE(res, err, 422);
		return ReS(res, {
			message: 'Successfully created new user.',
			user: user.toWeb(),
			token: user.getJWT()
		}, 201);
	}
}
module.exports.signup = signup;

const getProfile = async function (req, res) {
	let email = req.body.email;
	let err, user;

	[err, user] = await to(User.find({
		where: {
			email
		}
	}));

	if (err) return ReE(res, err, 422);
	return ReS(res, {
		user: user.toWeb()
	}, 200);
}
module.exports.getProfile = getProfile;

const updateProfile = async function (req, res) {
	let err, params;
	params = req.params;
	email = req.body.email;

	[err, success] = await to(User.update(params, {
		where: {
			email
		}
	}));

	if (err) return ReE(res, err, 422);

	[err, user] = await to(User.find({
		where: {
			email
		}
	}));

	if (err) return ReE(res, err, 422);
	return ReS(res, {
		user: user.toWeb()
	}, 200);
}
module.exports.updateProfile = updateProfile;

const login = async function (req, res) {
	const body = req.body;
	let err, user;

	[err, user] = await to(authService.authUser(req.body));
	if (err) return ReE(res, err, 422);

	return ReS(res, {
		token: user.getJWT(),
		user: user.toWeb()
	});
}
module.exports.login = login;