const productRepo = require('../db/productRepo');
const userRepo = require('../db/userRepo');
const requestRepo = require('../db/requestRepo');
const moment = require('moment'); 

exports.createRequest = async (req, res) => {
    try{
        let email = req.body.tokenData.email;
        let productId = req.body.productId;
        let user = await userRepo.getOne(email);
        let product = await productRepo.getOne(productId);
        if((user.balance - product.price) < 0) return res.status(422).send({message: 'your balnce is not enough'});
        let request = {
            userId: user.id,
            productId : product.id,
            newBalance : user.balance - product.price,
            createdAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            updatedAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        let newRequest = requestRepo.create(request);
        newRequest.then(re => {
            return res.status(201).json({message:"Request Done"});
        }).catch(e => {
            return res.status(422).send({message: e.message});
        })
    }catch(e){
        console.log(e)
        return res.status(422).send({message: e.message});
    }
}

exports.getRequests = async (req, res) => {
    try{
        let userId = req.body.tokenData.userId;
        let requestsList = await requestRepo.getAll(userId);
        return res.status(201).json({requestsList});
    }catch(e){
        return res.status(422).send({message: e.message});
    }
}

exports.deliverRequest = async (req, res) => {
    try{
        let requestId = req.params.requestId;
        await requestRepo.deliver(requestId);
        return res.status(201).json({message:"Request Delivered"});
    }catch(e){
        return res.status(422).send({message: e.message});
    }
}

exports.cancelRequest = async (req, res) => {
    try{
        let requestId = req.params.requestId;
        let email = req.body.tokenData.email;
        let request = await requestRepo.getOne(requestId);
        let user = await userRepo.getOne(email);
        if(user.id !== request.userId ) return res.status(422).send({message: "You cannot cancel this request"});
        if(request.status) return res.status(422).send({message: "Request Delivered already !"});
        let product = await productRepo.getOne(request.productId);
        await requestRepo.cancelRequest(requestId,user.balance + product.price,user.id);
        return res.status(201).json({message:"Request Canceled"});
    }catch(e){
        return res.status(422).send({message: e.message});
    }
}