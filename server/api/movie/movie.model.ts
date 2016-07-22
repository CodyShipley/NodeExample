import * as mongoose from 'mongoose';

export interface IMovieModel extends IMovie,
mongoose.Document {}

let movieSchema = new mongoose.Schema({
    title: {type: String, required:true},
    director: String,
    year: { type:Number, min:1913 },
    rating: String,
    imageURL: String,

    //The owner property is going to store the id itself for the user model of the person currently logged in and we can use that ID to populate the entire object when we want to. 
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

export let Movie = mongoose.model<IMovieModel>('Movie', movieSchema);
