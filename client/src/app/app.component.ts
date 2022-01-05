import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls:['./app.Component.css']
})

export class AppComponent {
  public title = 'Musify';
  public user: User;
  public token;
  public identity; //flag de loggeo
  //public identity=true;
  constructor(){
    this.user=new User('','','','','','ROLE_USER','');
  }
}
