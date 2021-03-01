const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db');

const mongoUri = 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD +
  '@cluster0.u8ocy.mongodb.net/mongoDriverDemo?retryWrites=true&w=majority';

const Decimal128 = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of products 
router.get('/', (req, res, next) => {
  const queryPage = req.query.page ? +req.query.page : 0;
  const pageSize = req.query.size ? +req.query.size : 10;

  const products = [];

  db.getDb()
    .collection('products')
    .find()
    // Sort is unnecessary - created index for price.
    // .sort({
    //   price: -1
    // })
    .skip(queryPage > 0 ? ((queryPage - 1) * pageSize) : 0)
    .limit(pageSize)
    .forEach(productDoc => {
      productDoc.price = productDoc.price.toString();
      products.push(productDoc);
    })
    .then(() => {

      res.status(200).json(products);
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({
        message: 'An error occurred!'
      });
    });
})

// Get single product
router.get('/:id', (req, res, next) => {
  db.getDb()
    .collection('products')
    .findOne({
      _id: new ObjectId(req.params.id)
    })
    .then((result) => {
      result.price = result.price.toString();
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    })

});

// Add new product
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()) // store this as 128bit decimal in MongoDB
  };

  db.getDb()
    .collection('products')
    .insertOne(newProduct)
    .then(result => {
      console.log(result);

      res.status(201).json({
        message: 'Product added!',
        productId: result.insertedId
      });
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({
        message: 'An error occurred!'
      });
    });
})

// Edit existing product
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    $set: {
      name: req.body.name,
      description: req.body.description,
      price: Decimal128.fromString(req.body.price.toString())
    },
  };

  //Optional
  const options = {
    upsert: true
  };

  const filter = {
    _id: new ObjectId(req.params.id)
  };

  db.getDb()
    .collection('products')
    .updateOne(
      filter,
      updatedProduct,
      options
    )
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
      });
    })
    .catch(err => {
      console.log(err);

      res.status(500).json({
        message: 'An error occurred!'
      });
    })

});

// Delete a product
router.delete('/:id', (req, res, next) => {
  db.getDb()
    .collection('products')
    .deleteOne({
      _id: new ObjectId(req.params.id)
    })
    .then(() => res.status(200).json({
      message: 'Product deleted!'
    }))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'An error occurred!'
      });
    })
});

module.exports = router;