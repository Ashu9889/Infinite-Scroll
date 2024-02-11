import { Component, HostListener } from '@angular/core';
import { Record } from './records';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  constructor() {
    fetch('https://dummyjson.com/users?limit=20')
      .then((res) => res.json())
      .then((data) => {
        this.record = data.users;
        console.log(this.record);
        this.fetchRecord = this.record.length;
      });
  }

   record:any[]=[];
  fetchRecord: number = this.record.length;

  isAsc: boolean = false;
   fetchData(){
    fetch('https://dummyjson.com/users?skip='+ this.record.length+'&limit=20')
    .then((res) => res.json())
    .then((data) => {
      
        this.record.push(...data.users);
        // console.log(...data.users);
        // console.log(this.record);
       
   
    });
   }

  scrollFun() {
     let sHeight:any=document.getElementById("tb")?.scrollHeight;
    let sTop:any=document.getElementById("tb")?.scrollTop;
    let inrHeight=358;
    if ((inrHeight+ sTop) >= sHeight && this.record.length <= 100){
      this.fetchData()
       
    }
      
  }
  sortObj: any = {
    isNameAsc: false,
    isEmailAsc: false,
    isUsernameAsc: false,
    isIdAsc: false,
  };
  listsort(temp: any, str: any) {
    if (!this.sortObj[str]) {
      this.record.sort((a, b) =>
        a[temp] > b[temp] ? 1 : b[temp] > a[temp] ? -1 : 0
      );
      this.sortObj[str] = true;
    } else {
      this.record.sort((a, b) =>
        b[temp] > a[temp] ? 1 : a[temp] > b[temp] ? -1 : 0
      );
      this.sortObj[str] = false;
    }
  }

  listName: string = 'My Todo List';
  totalElement = 0;
  modify() {
    console.log(this.listName);
  }
  toggle() {
    this.totalElement += 1;
    console.log('toggle');
  }
}
