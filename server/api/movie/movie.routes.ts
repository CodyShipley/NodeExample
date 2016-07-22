import * as express from 'express';
import * as controller from './movie.controller';
import * as jwt from 'express-jwt';
const router = express.Router();
const auth = jwt({
  //required property: secret
  secret: process.env.JWT_SECRET,
  userProperty: 'payload', //req.payload
  credentialsRequired: false
})

router.get('/', controller.getAll);

//GET: /api/movies/5
router.get('/:id', controller.getOneById);

//POST: /api/movies
router.post('/', auth, controller.create, controller.addMovieToUser);

//PUT: /api/movies/5
router.put('/:id', controller.update);

//DELETE: /api/movies/5

router.delete('/:id', auth, controller.findMovie,controller.remove,  controller.removeMovieFromUser);


export = router;
