import * as express from 'express';
import { Movie } from './movie.model';
import { User } from '../auth/user.model'

export function getAll(req: express.Request, res: express.Response, next: Function) {

    Movie
        .find({})
        .populate('owner', 'username')
        .select('')
        .exec((err, result) => {
            if (err) return next(err);
            res.json(result);
        })
}

export function getOneById(req: express.Request, res: express.Response, next: Function) {
    Movie
        .findOne({ _id: req.params.id })
        .exec((err, result) => {
            if (err) return next(err);
            if (!result) return next({ status: 400, message: "Could not find movie :(" });
            res.json(result);
        })
}

export function create(req: express.Request, res: express.Response, next: Function) {
    //By passing in req.body, its gonna compare all of the properties in the req.body to the schema. Gonna create an ID property for us, we then save to database.
    //If you don't have body-parser, you cant use req.body.
    let m = new Movie(req.body);
    m.owner = req['payload']._id;
    //If any vaildation fails, dont save, remove and throw error.
    m.save((err, result) => {
        //Call the next function in express if error occurs. It's going to go to an error handler function.
        if (err) return next(err);
        //res.json can parse json a little safer because of things like nulls.
        req['tempMovie'] = result;
        result.populate({ path: "owner", select: "username", model: "User" }, (err, m) => {
            req['tempMovie'] = result;
            next();
        });
    });
}

export function addMovieToUser(req: express.Request, res: express.Response, next: Function) {
    User.update({ _id: req['payload']._id }, { $push: { movies: req['tempMovie']._id } }, (err, result: any) => {
        if (err) return next(err);
        res.json(req['tempMovie'])
    })
}


export function update(req: express.Request, res: express.Response, next: Function) {
    Movie.update({ _id: req.params.id }, req.body, (err, result: any) => {
        if (err) return next(err);
        if (result.nModified !== 1) return next({ status: 500, message: "Duplicate ID's, error" });
        res.json({ success: true });
    });
}

export function findMovie(req: express.Request, res: express.Response, next: Function) {
    Movie.findOne({ _id: req.params.id })
        .exec((err, movie) => {
            if (err) return next(err);
            if (!movie) return next({
                status: 400, message: 'Could not find movie.'
            });

            req['tempMovie'] = movie;
            next();
        });
}

export function remove(req: express.Request, res: express.Response, next: Function) {
    if (req['payload'].role !== 'Admin' && req['tempMovie'].owner != req['payload']._id) {
        return next({ status: 401, message: "Nuh uh uh, you didnt say the magic word." })
    }
    Movie.remove({ _id: req.params.id }, (err) => {
        if (err) return next(err);
        res.json({ success: true });
    });
}


export function removeMovieFromUser(req: express.Request, res: express.Response, next: Function) {
    User.update({ _id: req['tempMovie'].owner }, { $pull: { movies: req['tempMovie']._id } }, (err, result) => {
        if (err) return next(err);
        res.json({ success: true });
    })
}


//The next parameter will call this function once the next() is hit.
//export function helloWorld(req,res,next){
//  res.send("Hello World!");
//}
