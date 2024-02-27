import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession } from "../service/session.service";
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
            {...user, session: session.id}, 
            {expiresIn: config.get<string>("accessTokenTtl")}
)
        // create refresh token
    const refreshToken = signJwt(
        { ...user, session: session.id },
        { expiresIn: config.get<string>("refreshTokenTtl") }
    )
        // return access token and refresh token
    return res.send({ accessToken, refreshToken });
}
