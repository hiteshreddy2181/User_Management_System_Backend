import Jwt from "jsonwebtoken";
const TOKEN = "Arun@123";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(403).send("A token is required for authentication");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decode = Jwt.verify(token, TOKEN);
        req.user = decode;
    } catch(err) {
        return res.status(401).send("Invalid token");
    }

    return next();
}

export default verifyToken;