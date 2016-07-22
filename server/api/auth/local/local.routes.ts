import * as express from 'express'
import * as controller from './local.controller';

const router = express.Router();

//POST: api/auth/local/login
router.post('/login', controller.login);
//POST: api/auth/local/Register
router.post('/register', controller.register);

export = router;
