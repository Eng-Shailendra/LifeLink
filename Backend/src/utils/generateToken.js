import jwt from "jsonwebtoken";

const generateAuthToken = async (userId) => {
    return await jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
}
export default generateAuthToken;