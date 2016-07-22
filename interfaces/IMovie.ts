interface IMovie{
  _id: any;
  title: String;
  director: String;
  year: Number;
  rating: String;
  imageURL: String;
  owner: String|IUser;
}
