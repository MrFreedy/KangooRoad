const checkCookie = (req, res, next) => {
    const cookie = req.cookies.kangooroad;

    if (!cookie || cookie !== process.env.COOKIE_SECRET) {
        return res.sendStatus(403);
    }

    next();
};

module.exports = checkCookie;
