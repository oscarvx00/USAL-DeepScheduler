import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from "./constants";

@Injectable()
export class WsGuard implements CanActivate{
    constructor(){

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const token = context.getArgByIndex(0).handshake.headers.authorization.split(' ')[1];
        //const req = context.switchToHttp().getResponse()
        //console.log(token)
        try {
            const decoded = jwt.verify(token, jwtConstants.secret)
            //console.log(decoded)
            //req.user = decoded
            //console.log(req)
            return true
        } catch (ex){
            console.log(ex)
            return false
        }
    }
}