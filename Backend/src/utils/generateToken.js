import jwt from "jsonwebtoken";

const token = async (id,) => {
    return await jwt.sign(id, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
}

const accessToken = async (password,) => {
    return await jwt.sign(password, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
}

const refreshToken = async (password) => {
    return await jwt.sign(password, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

export { accessToken, refreshToken, token };