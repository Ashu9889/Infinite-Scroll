import {
  Component,
  HostListener,
  Input,
  NgModule,
  OnInit,
  Self,
} from '@angular/core';
import { Record } from './records';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetdataService } from '../getdata.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExcelServiceService } from '../excel-service.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInput,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  datasource: any[] = [];
  displayedColumns: String[] = [
    'id',
    'firstName',
    'email',
    'username',
    'gender',
    'checkbox',
  ];

  record: any[] = [];
  isAsc: boolean = false;
  sortObj: any = {
    isNameAsc: false,
    isEmailAsc: false,
    isUsernameAsc: false,
    isIdAsc: true,
  };
  isChecked: boolean = false;
  totalRecord: number = 100;
  skipLength: number = this.record.length;
  selectedRecord: any[] = [];

  inputData = {
    id: 101,
    firstName: '',
    email: '',
    username: '',
    gender: '',
  };

  searchData!: {
    value: string;
    filter: string;
  };

  constructor(
    private userService: GetdataService,
    private excelService: ExcelServiceService
  ) {
    this.searchData = { value: '', filter: '' };
  }

  exportDataToExcel(): void {
    const data = this.record.map;

    console.log(data);

    this.excelService.exportToExcel(this.record, 'sample_data');
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.excelService
      .excelToJson(file)
      .then((jsonData) => {
        console.log(jsonData);
        this.record.push(...jsonData);
        console.log(this.record);
        this.datasource = [...this.record];
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ngOnInit() {
    this.fetchData(0, 20);
  }
  clearFilter() {
    this.searchData.filter = '';
    this.searchData.value = '';
    this.datasource = [...this.record];
  }
  onSearch() {
    console.log(this.searchData?.filter, this.searchData?.value);
    const filterData = this.record.filter((item) => {
      return item[this.searchData.filter]
        .toLowerCase()
        .includes(this.searchData.value.toLowerCase());
    });
    this.datasource = [...filterData];
  }

  fetchData(skipLength: number = 0, limitValue: number = 20) {
    let data = this.userService
      .getUsers(this.skipLength, limitValue)
      .subscribe((user) => {
        const { users }: any = user;

        this.record.push(...users);
        this.datasource = [...this.record];
        this.skipLength += users.length;
        if (this.isChecked) {
          users.map((value: any) => {
            this.selectedRecord.push(value.id);
          });
        }
      });
  }

  scrollFun() {
    let sHeight: any = document.getElementById('tb')?.scrollHeight;
    let sTop: any = document.getElementById('tb')?.scrollTop;
    let inrHeight: any = document.getElementById('tb')?.offsetHeight;
    if (inrHeight + sTop + 1 > sHeight && this.record.length < 100) {
      this.fetchData(this.skipLength);
      console.log('fetch called from scroll');
    }
    console.log(inrHeight + sTop, sHeight);
  }

  listsort(temp: any, str: any) {
    console.log(str);

    if (!this.sortObj[str]) {
      this.record.sort((a: any, b: any) =>
        a[temp] > b[temp] ? 1 : b[temp] > a[temp] ? -1 : 0
      );
      this.sortObj[str] = true;
      this.datasource = [...this.record];
    } else {
      this.record.sort((a: any, b: any) =>
        b[temp] > a[temp] ? 1 : a[temp] > b[temp] ? -1 : 0
      );
      this.sortObj[str] = false;
      this.datasource = [...this.record];
    }
  }

  selectRecord(selected: any, e: any) {
    if (e.target.checked) {
      this.selectedRecord.push(selected.id);
    } else {
      this.selectedRecord.map((value, i) => {
        if (value == selected.id) {
          this.selectedRecord.splice(i, 1);
        }
      });
    }

    console.log(this.selectedRecord);
  }

  selectAll({ checked }: any) {
    if (!checked) {
      this.selectedRecord = [];
      this.isChecked = checked;
    } else {
      this.isChecked = checked;
      this.record.map((value) => {
        this.selectedRecord.push(value.id);
      });
    }
  }

  deleteRecord() {
    if (this.selectedRecord.length == 0) return;
    if (!this.isChecked) {
      this.fetchData(this.skipLength, this.selectedRecord.length);
      this.selectedRecord.map((r, i) => {
        this.record.map((val, j) => {
          val.id == r ? this.record.splice(j, 1) : -1;
        });
      });
    } else {
      this.selectedRecord.map((r, i) => {
        this.record.map((val, j) => {
          val.id == r ? this.record.splice(j, 1) : -1;
        });
      });
    }
    this.datasource = [...this.record];
    this.selectedRecord = [];
  }

  formSubmit(e: any) {
    if (!e.value.name || !e.value.email || !e.value.username || !e.value.gender)
      return;

    this.inputData.id = this.totalRecord + 1;
    this.inputData.firstName = e.value.name;
    this.inputData.email = e.value.email;
    this.inputData.username = e.value.username;
    this.inputData.gender = e.value.gender;
    this.record.unshift(JSON.parse(JSON.stringify(this.inputData)));
    this.datasource = [...this.record];
  }
}
