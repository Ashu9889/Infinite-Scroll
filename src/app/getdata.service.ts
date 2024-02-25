import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Record } from './list/records';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetdataService {
  constructor(private http: HttpClient) {}

  getUsers(skipLength: number, limitValue: number) {
    const res = this.http.get<Record[]>(
      'https://dummyjson.com/users?skip=' + skipLength + '&limit=' + limitValue
    );
    return res;
  }
}
