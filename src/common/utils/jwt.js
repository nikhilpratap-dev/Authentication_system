import crypto from 'crypto'
import jwt from 'jsonwebtoken'


const generateAccessToken=(Payload)=>{
    return jwt.sign(Payload, process.env.JWT_ACCESS_SECRET,{
        expiresIn : process.env.ACCESS_SECRET_EXPIRES || "15m"
    });
};

const verifyAccessToken=(token)=>{
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const generateRefreshToken=(payload)=>{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET,{
       expiresIn : process.env.REFRESH_SECRET_EXPIRES || "7d",
        jwtid: crypto.randomUUID(),
    })
};


const verifyRefreshToken=(token)=>{
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
};


const generateToken=()=>{
    const rawToken=crypto.randomBytes(32).toString('hex')
    const hashedToken=crypto.createHash("sha256").update(rawToken).digest('hex')

    return {rawToken, hashedToken}
}

export {generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateToken}