import { useProductsContext } from "./context/ProductsProvider";
import { useCart } from "./context/CartProvider";
function App() {
  const { products } = useProductsContext();
  const { cart, totalItems, totalPrice } = useCart();
  console.log(totalPrice);
  return (
    <div className="App">
      {products.length === 0 && <h1>Loading...</h1>}
      {products.map((product) => (
        <div key={product.sku}>
          <h1>{product.name}</h1>
          <h2>{product.price}</h2>
        </div>
      ))}
    </div>
  );
}

export default App;
