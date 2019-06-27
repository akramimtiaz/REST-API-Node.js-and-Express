const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const { models } = require('../../../db');
const { User } = models;

const  authenticateUser = async (req, res, next) => {
    let message = null;
    const credentials = auth(req);

    if(credentials){
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });
        if(user){
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            if(authenticated){
                console.log(`Authentication successful for username: ${credentials.name}`);
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${credentials.name}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Authentication header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};

module.exports = authenticateUser;