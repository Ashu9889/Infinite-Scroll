export interface IObjectKeys {
    [key: string]: string | number;
  }
export interface Record extends IObjectKeys{
    id:number,
    name:string,
    username:string,
    email:string,
    website:string
}