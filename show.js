const Product = require('./models/Product');

async function showData() {
  const products = await Product.find();
  console.log(products);
}
showData()