const usernameLoader = (req, res, next) => {
    const usernameHeader = req.headers["x-username"];
    if (typeof usernameHeader === "string") {
        req.username = usernameHeader;
    }
    if (!req.username) {
        return res
            .status(401)
            .send("Unauthorized: You must provide a valid x-username header.");
    }
    next();
};
export default usernameLoader;
