import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, IPublicClientApplication } from '@azure/msal-browser';
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
interface IODataResult<T> {
  value: T;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  profile?: MicrosoftGraph.User;
  users?: MicrosoftGraph.User[];
  userNameFilter: string = "";
  title = 'ComplianceSPA';
  apiResponse: string;
  loggedIn = false;
  constructor(private authService: MsalService, private http: HttpClient) { }

  ngOnInit(): void {
    this.checkAccount();


    console.log(localStorage.getItem("token"));

  }

  checkAccount() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }
  Account() {
     this.authService.handleRedirectObservable().subscribe({
      next: (result) => console.log(result),
      error: (error) => console.log(error)
    })
  }

  login() {
    this.authService
      .loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.authService.instance.setActiveAccount(response.account);
        console.log(response)
        //  var x=  JSON.parse(response.) 
        localStorage.setItem("token", response.accessToken)
   
      });
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem("token");
  }

  getName(): string {
    if (this.authService.instance.getActiveAccount() == null) {
      return 'unknown'
    }
    return this.authService.instance.getActiveAccount().name
  }

  callProfile() {
    this.http
      .get<MicrosoftGraph.User>("https://graph.microsoft.com/v1.0/me")
      .subscribe((profile) => (this.profile = profile));
  }

  callgroup() {
    this.http
      .get<MicrosoftGraph.User>("https://graph.microsoft.com/v1.0/groups/c12693b2-4112-4ecc-bf51-988fca993272")
      .subscribe((profile) => (this.profile = profile));
  }

  getUsers() {
    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    headers_object.append("Authorization", "Bearer " + localStorage.getItem("token"));
    const httpOptions = {
      headers: headers_object
    };

    let params = new HttpParams().set("$top", "10");
    if (this.userNameFilter) {
      params = params.set(
        "$filter",
        `startsWith(displayName, '${this.userNameFilter}')`
      );
    }
    console.log(localStorage.getItem("token"));

    let url = `https://graph.microsoft.com/v1.0/users`;
    this.http
      .get<IODataResult<MicrosoftGraph.User[]>>(url)
      .subscribe((users) => (this.users = users.value));
  }


  getComplianceApi() {
    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    headers_object.append("Authorization", "Bearer " + localStorage.getItem("token"));
    const httpOptions = {
      headers: headers_object
    };
    this.http.get("https://localhost:44395/Compliance/get").subscribe(data => console.log('The data changed to: ' + data)
    )
  }
}