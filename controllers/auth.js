const User = require('../models/user');
const { asyncHandleError } = require('../services/error');
const { getEncryptedPassword } = require('../services/validation');
const { getJWT } = require('../services/auth');

const auth = {
  // google oauth
  google: asyncHandleError(async (req, res, next) => {
    const {
      user: { sub, name, email, picture },
    } = req;
    const existedEmail = await User.findOne({ email });
    let user = await User.findOne({ email, googleId: sub });

    if (existedEmail && !user) {
      return res.redirect(
        `${process.env.APP_URL}/?error=${encodeURIComponent(
          '帳號已被註冊，請替換新的 Email！'
        )}`
      );
    }
    if (!existedEmail) {
      const hash = await getEncryptedPassword(sub);
      const newUser = await User.create({
        name,
        email,
        password: hash,
        avatar: picture,
        googleId: sub,
      });
      user = newUser;
    }
    res.redirect(`${process.env.APP_URL}/?token=${getJWT(user)}`);
  }),
};

module.exports = auth;
