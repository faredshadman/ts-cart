import {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

export type ProductType = {
  sku: string;
  name: string;
  price: number;
};

const initState: ProductType[] = [];

export type useProductsContextType = {
  products: ProductType[];
};

const initContextState: useProductsContextType = { products: [] };
const ProductsContext = createContext<useProductsContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement | ReactElement[];
};

export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
  const [products, setProducts] = useState<ProductType[]>(initState);
  useEffect(() => {
    const signal: AbortController = new AbortController();
    const fetchProducts = async (): Promise<void> => {
      await fetch("http://localhost:3500/products", {
        signal: signal.signal,
      })
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => {
          if (err instanceof Error) console.log(err);
        });
    };
    fetchProducts();
    return () => signal.abort();
  }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): useProductsContextType => {
  const context = useContext(ProductsContext);
  return context;
};
