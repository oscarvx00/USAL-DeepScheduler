import { Router } from "@angular/router";
import { AuthDataSharingService } from "src/app/services/auth/user-data-sharing";
import { environment } from "src/environments/environment";


export class LoginExternal{

    constructor(
        private authDataSharingService : AuthDataSharingService,
        private router : Router
    ) {}

    public loginWithGoogle(){
        window.open(environment.apiUrl + '/auth/google',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        let listener = window.addEventListener('message', (message) => {
        //console.log(message.data.res.access_token)
        localStorage.setItem('auth_token', message.data.res.access_token)
        //console.log("TOKEN: " + localStorage.getItem("auth_token"))
        this.authDataSharingService.isUserLoggedIn.next(true)
        this.router.navigate(['me'])
        });
    }

    public loginWithGithub(){
        window.open(environment.apiUrl + '/auth/github',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        let listener = window.addEventListener('message', (message) => {
          //console.log(message.data.res.access_token)
          localStorage.setItem('auth_token', message.data.res.access_token)
          //console.log("TOKEN: " + localStorage.getItem("auth_token"))
          this.authDataSharingService.isUserLoggedIn.next(true)
          this.router.navigate(['me'])
        });
    }

    public loginWithGitlab(){
        window.open(environment.apiUrl + '/auth/gitlab',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
        let listener = window.addEventListener('message', (message) => {
          //console.log(message.data.res.access_token)
          localStorage.setItem('auth_token', message.data.res.access_token)
          //console.log("TOKEN: " + localStorage.getItem("auth_token"))
          this.authDataSharingService.isUserLoggedIn.next(true)
          this.router.navigate(['me'])
        });
    }
}