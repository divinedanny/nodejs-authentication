import jwt from 'jsonwebtoken';
import config from 'config';


const privatekey = config.get<string>('privateKey');
const publickey = config.get<string>('publicKey');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined){
    return jwt.sign(object, privatekey, { ...(options && options), algorithm: 'RS256'});

}

function verifyJwt(token: string){

    try {
        const decoded = jwt.verify(token, publickey);
        return {
            valid: true,
            expired: false,
            decoded,

        };
    }catch (error: any) {
        return {
            valid: false,
            expired: error.message === "jwt expired",
            decoded: null

        };
    }
}