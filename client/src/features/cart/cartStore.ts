import type { CartItem, CartState } from "./cartTypes";

let state: CartState = {
  items: [],
};

const listeners = new Set<(nextState: CartState) => void>();

const emit = () => {
  listeners.forEach((listener) => listener(state));
};

export const cartStore = {
  getState(): CartState {
    return state;
  },

  setItems(items: CartItem[]) {
    state = { ...state, items };
    emit();
  },

  subscribe(listener: (nextState: CartState) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

