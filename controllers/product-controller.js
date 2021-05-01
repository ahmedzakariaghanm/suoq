const productRepo = require('../db/productRepo');
const userRepo = require('../db/userRepo');


exports.getProducts = async (req, res) => {
    try{
        let email = req.body.tokenData.email;
        let user = await userRepo.getOne(email);
        let productList = await productRepo.getAll(user.balance);
        return res.status(201).json({productList});
    }catch(e){
        return res.status(422).send({message: e.message});
    }
}
