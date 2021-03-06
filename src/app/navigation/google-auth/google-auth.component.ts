import { Component, OnInit, Input } from '@angular/core';
 
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

//https://www.npmjs.com/package/angularx-social-login
//https://github.com/kangw3n/angular4-social-login/tree/0bb654f7034d7d154d59e629005203b397144f11

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css']
})

export class GoogleAuthComponent implements OnInit {

  private user: SocialUser;
  public loggedIn: boolean;

  //to know whether it was accessed from sidenav or header
  @Input () sidenav: boolean;
  @Input () header: boolean;


  constructor(private authService: AuthService) { }

  signInWithGoogle(): void {
    window.alert("Sign in with your UP Mail account.");
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit() {
  	this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

}

/*use a service between this component to whatever component needs the user details (name and email and photoUrl) */