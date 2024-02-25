export interface IObjectKeys {
  [key: string]: string | number;
}
export interface Record extends IObjectKeys {
  id: number;
  firstName: string;
  email: string;
  username: string;
  gender: string;
}
