import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  singleUser: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Load all users
  loadUsers() {
    this.userService.getAll().subscribe(data => {
      this.users = data;
      console.log('All Users:', data);
    });
  }

  //  Load single user by ID
  loadUser(id: number) {
    this.userService.getById(id).subscribe(user => {
      this.singleUser = user;
      console.log('Single User:', user);
    });
  }

  //  Add user
  addUser() {
    const newUser = {
      email: 'demo@example.com',
      username: 'demoUser',
      password: 'demo123',
      name: { firstname: 'Demo', lastname: 'User' },
      address: {
        city: 'Delhi',
        street: 'Main Street',
        number: 42,
        zipcode: '12345',
        geolocation: { lat: '20.000', long: '10.000' }
      },
      phone: '9876543210'
    };

    this.userService.add(newUser).subscribe(res => {
      console.log('User added:', res);
      this.loadUsers();
    });
  }

  //  Update user
  updateUser(id: number) {
    const updatedUser = {
      username: 'updatedUser',
      email: 'updated@example.com'
    };

    this.userService.update(id, updatedUser).subscribe(res => {
      console.log('User updated:', res);
      this.loadUsers();
    });
  }

  // dDelete user
  deleteUser(id: number) {
    this.userService.delete(id).subscribe(res => {
      console.log('User deleted:', res);
      this.loadUsers();
    });
  }
}
