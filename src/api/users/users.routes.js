const { postOne, getAllGroups, postByGroupName, postUserInGroup } = require('./users.controller');

const UsersRoutes = require('express').Router();


UsersRoutes.post('/post-users/', postOne);
UsersRoutes.post('/post-by-name/', postByGroupName);
UsersRoutes.post('/post-by-username/', postUserInGroup);
UsersRoutes.get('/get-users/', getAllGroups);


module.exports = {UsersRoutes}