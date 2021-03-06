import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class AuthDataSharingService{
    public isUserLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
}