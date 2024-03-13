import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createSessionHandler(req: Request, res: Response){
        // validate user's password
        const user = await validatePassword(req.body)
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        //create new session
        const session = await createSession(user._id, req.get("user-agent") || "");

        // create access token
        const accessToken = signJwt(
            {...user, session: session._id}, 
            {expiresIn: config.get<string>("accessTokenTtl")} //expired in 15 mins
)
        // create refresh token
        const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get<string>("refreshTokenTtl") }//expired in one year
    )
        // return access token and refresh token
    return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response){
    const userID = res.locals.user._id
    const sessionID = await findSessions({user: userID, valid: true});
    return res.send(sessionID);
}

export async function deleteSessionHandler(req: Request, res: Response){
    const sessionID = res.locals.user.session;

    await updateSession({_id: sessionID}, {valid:false});

    return res.send({
        accessToken:null,
        refreshToken: null
    })
}