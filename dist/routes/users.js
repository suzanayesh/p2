import express from 'express';
import { createPermission, createRole, createUser, getAllRoles, login } from '../controllers/user.js';
// import { authenticate } from '../middlewares/auth/authenticate.js';
// import { authorize } from '../middlewares/auth/authorize.js';
// import { validateUser } from '../middlewares/validation/user.js';
var router = express.Router();
router.post('/', async (req, res, next) => {
    try {
        await createUser(req.body);
        res.status(201).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
router.post('/role', async (req, res, next) => {
    try {
        const data = await createRole(req.body);
        res.status(201).send(data);
    }
    catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send(err);
    }
});
router.post('/permission', async (req, res, next) => {
    try {
        const data = await createPermission(req.body);
        res.status(201).send(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const data = await login(email, password);
        res.send(data);
    }
    catch (err) {
        res.status(401).send(err);
    }
});
router.get('/roles', async (req, res, next) => {
    try {
        const roles = await getAllRoles();
        res.send(roles);
    }
    catch (error) {
        res.status(500).send("Something went wrong");
    }
});
export default router;
