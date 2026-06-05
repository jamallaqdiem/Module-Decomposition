const arrayValidator = (req, res, next) => {
    const body = req.body;
    // 1. Is it a valid array?
    if (!Array.isArray(body)) {
        return res.status(400).send("Bad Request: Body must be a JSON array.");
    }
    // 2. Are all items inside the array strings?
    const allStrings = body.every((item) => typeof item === "string");
    if (!allStrings) {
        return res
            .status(400)
            .send("Bad Request: All array elements must be strings.");
    }
    next();
};
export default arrayValidator;
