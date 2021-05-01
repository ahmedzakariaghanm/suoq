const joi = require('joi');
const jwt = require('jsonwebtoken');
const userRepo = require('../db/userRepo');
const moment = require('moment'); 
const bcrypt = require('bcrypt');

require('dotenv').config()

const userRegistrationSchema = joi.object({
  email:joi.string().email().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required()
}).required();

const userLoginSchema = joi.object({
    email:joi.string().email().required(),
    password: joi.string().required()
}).required();
const createToken = (user) => {
    return jwt.sign(user, process.env.JWTSECRET , {
      expiresIn: 24 * 60 * 60 // 86400 expires in 24 hours
    })
}
const encPassword = async (password) => {
  try{
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(password, salt)
    return hash
  }catch(e){
    throw new Error(e);
  }
}
const comparePassword = async (password, hash) => {
  try{
    let isMatch = await bcrypt.compare(password, hash)
    return isMatch;
  }catch(e){
    throw new Error(e);
  }
};
exports.register = async (req, res) => {
    try{
        const {email, firstName, lastName, password} = req.body;
        const isValid = await userRegistrationSchema.validateAsync({
          email,
          firstName,
          lastName,
          password
        });
        let isUser = await userRepo.isExist(email);
        if(isUser){
          return res.status(400).json({ msg: 'The user already exists' })
        }
        await encPassword(password)
        .then(async (res) => {
          const newUser = {
            email,
            firstName,
            lastName,
            password: res,
            balance: 100,
            createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          };
          let userr = await userRepo.create(newUser);
        })
        .catch(e => {
          throw new Error(e)
        })
        return res.status(201).json({message: 'Success'});
    }catch(e){
        return res.status(422).send({message: e.message});
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        await userLoginSchema.validateAsync({
          email,
          password
        });
        let isUser = await userRepo.isExist(email);
        if(!isUser) throw Error('The user does not exist');
        let user = await userRepo.getOne(email);
        comparePassword(password,user.password).then(isMatch => {
          if(isMatch)return res.status(200).json({ token: createToken({
            userId:user.id,
            email: user.email
          })})
          else return res.status(403).send({message: 'The email and password don\'t match.'});
        });
    }catch(e){
        return res.status(422).send({message: e.message});
    }
}



