import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user! : User

  constructor(
    private userService : UserService
  ) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user : User) => {
      this.user = user
    })
  }

}
