import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ProductsProvider } from "./context/ProductsProvider";
import { CartProvider } from "./context/CartProvider";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ProductsProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </ProductsProvider>
);
