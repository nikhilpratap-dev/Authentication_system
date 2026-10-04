import ApiResponse from "../../common/utils/api-response.js"
import * as Services from "./auth.service.js"



const cookieOption = {
      httpOnly : true,
      secure : process.env.NODE_ENV==="production",
      sameSite : "strict",
      maxAge : 7*24*60*60*1000, //7days
    }

const register = async (req,res)=>{
    const user = await Services.register(req.body);
    ApiResponse.created(res, "Registration success", user);
}

// Refresh token goes in httpOnly cookie — not accessible to JS
const logIn =async(req,res)=>{
    const {user, accessToken, refreshToken} = await Services.logIn(req.body);
    res.cookie("refreshToken", refreshToken,cookieOption);
    ApiResponse.ok(res,"login succesfully",{user, accessToken});
}

const refreshToken = async (req,res) =>{
    const token = req.cookies?.refreshToken;
    const {accessToken, refreshToken:newRefreshToken} = await Services.refresh(token);
    res.cookie("refreshToken", refreshToken, cookieOption);

    ApiResponse.ok(res,"refreshed token",{accessToken});
}

const forgetPassword = async (req,res)=>{
    await Services.forgetPassword(req.body.email);
    ApiResponse.ok(res,"password reset email sent");
}

const logOut = async (req,res)=>{
    await Services.logout(req.user.id);
    res.clearCookie("refreshToken",{...cookieOption, maxAge: undefined});
    ApiResponse.ok(res,"successfully log out");
}

const verifyEmail = async (req,res)=>{
    await Services.verifyEmail(req.params.token);
    ApiResponse.ok(res,"Email verify successfully");
}

const resetPassword=async (req,res) =>{
    await Services.resetPassword(req.body.newPassword,req.params.token);
    ApiResponse.ok(res, "password reset successfully");
}

const getMe = async (req,res) =>{
   const user = await Services.getMe(req.user.id);
   ApiResponse.ok(res,"profile",user);
}
export {
    register,
    logIn,
    refreshToken,
    forgetPassword,
    logOut,
    verifyEmail,
    resetPassword,
    getMe,
}