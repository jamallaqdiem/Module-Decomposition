import express from "express";
import arrayValidator from "./custom-middleware/array-validator.js";
import usernameLoader from "./custom-middleware/username-validator.js";
const app = express();
const port = 3000;
app.use(express.json());
app.post("/", usernameLoader, arrayValidator, (req, res) => {
    const subjects = req.body;
    const count = subjects.length;
    const subjectList = subjects.join(", ");
    // 1. Format the authentication message using the custom header middleware
    let authMessage = req.username
        ? `You are authenticated as ${req.username}.`
        : "You are not authenticated.";
    // 2. Format the subject list counts from the array validator middleware
    let subjectMessage = count === 1
        ? `You have requested information about 1 subject: ${subjectList}.`
        : `You have requested information about ${count} subjects${count > 0 ? ": " + subjectList : "."}`;
    res.send(`${authMessage}\n\n${subjectMessage}`);
});
app.listen(port, () => {
    console.log(`Middleware exercises server running on port ${port}`);
});
