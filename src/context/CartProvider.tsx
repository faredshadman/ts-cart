import {
  createContext,
  useMemo,
  useReducer,
  useContext,
  ReactElement,
} from "react";

export type CartItemType = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStateType = {
  cart: CartItemType[];
};

const initCartState: CartStateType = { cart: [] };

const REDUCER_ACTION_TYPE = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  QUANTITY: "QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  SUBMIT: "SUBMIT",
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;
export type ReducerAction = {
  type: string;
  payload?: CartItemType;
};
const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD_TO_CART:
      if (!action.payload) throw new Error("Invalid payload");
      const filteredCartForAdd: CartItemType[] = state.cart.filter(
        (item) => item.sku !== action.payload?.sku
      );
      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === action.payload?.sku
      );
      const quantity: number = itemExists ? itemExists.quantity + 1 : 1;
      return {
        ...state,
        cart: [
          ...filteredCartForAdd,
          {
            ...action.payload,
            quantity,
          },
        ],
      };
    case REDUCER_ACTION_TYPE.REMOVE_FROM_CART:
      if (!action.payload) throw new Error("Invalid payload");
      const filteredCartForRemove: CartItemType[] = state.cart.filter(
        (item) => item.sku !== action.payload?.sku
      );
      return {
        ...state,
        cart: [...filteredCartForRemove],
      };
    case REDUCER_ACTION_TYPE.QUANTITY:
      if (!action.payload) throw new Error("Invalid payload");
      const itemExistsForQuantity: CartItemType | undefined = state.cart.find(
        (item) => item.sku === action.payload?.sku
      );
      if (!itemExistsForQuantity) {
        throw new Error("Item does not exist in cart");
      }
      const updatedItem: CartItemType = {
        ...itemExistsForQuantity,
        quantity: action.payload?.quantity,
      };
      const filteredForQuantity: CartItemType[] = state.cart.filter(
        (item) => item.sku !== action.payload?.sku
      );
      return {
        ...state,
        cart: [...filteredForQuantity, updatedItem],
      };

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.sku === action.payload?.sku
            ? { ...item, quantity: action.payload?.quantity }
            : item
        ),
      };
    case REDUCER_ACTION_TYPE.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    case REDUCER_ACTION_TYPE.SUBMIT:
      return {
        ...state,
        cart: [],
      };
    default:
      throw new Error("Invalid action type");
  }
};

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);

  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);
  const totalItems: number = state.cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const cart = state.cart.sort((a: CartItemType, b: CartItemType) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));
    return itemA - itemB;
  });
  return {
    dispatch,
    REDUCER_ACTIONS,
    cart,
    totalItems,
    totalPrice,
  };
};
export type UseCartContextType = ReturnType<typeof useCartContext>;

const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  cart: [],
  totalItems: 0,
  totalPrice: "",
};
export const CartContext =
  createContext<UseCartContextType>(initCartContextState);

type ChildrenType = {
  children?: ReactElement | ReactElement[];
};
export const CartProvider = ({ children }: ChildrenType) => {
  const cartContext = useCartContext(initCartState);
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
export default useCartContext;
