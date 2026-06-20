import jwt from "jsonwebtoken";

const accessToken = (password,) => {
    return jwt.sign(password, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
}

const refreshToken = (password) => {
    return jwt.sign(password, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

export { accessToken, refreshToken };