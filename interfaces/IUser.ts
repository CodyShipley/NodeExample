interface IUser{
  _id: any;
  username:String;
  password: String;
  salt: String;
  role:String;
  movies: Array<String | IMovie>
}
