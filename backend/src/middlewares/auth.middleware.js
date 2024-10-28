import jwt from "jsonwebtoken"

const authenticateToken = async (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];

    if(!token) return res.status(401).send("Access Denied");

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(400).send("Invalid Token");
    }
}

export default authenticateToken