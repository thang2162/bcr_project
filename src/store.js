import React from "react";

export const initialState = { count: 0,
  cardTxt: 'This is a media card.',
  cartItems: [
    ],
searchTxt: '',
loadOnNav: false };

export const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1, cardTxt: state.cardTxt, cartItems: state.cartItems, searchTxt: state.searchTxt, loadOnNav: state.loadOnNav  };
    case "decrement":
      return { count: state.count - 1, cardTxt: state.cardTxt, cartItems: state.cartItems, searchTxt: state.searchTxt, loadOnNav: state.loadOnNav   };
    case "editCardTxt":
      //alert(action.cardTxt);
        return { count: state.count, cardTxt: action.cardTxt, cartItems: state.cartItems, searchTxt: state.searchTxt, loadOnNav: state.loadOnNav };
    case "editCart":
        return { count: state.count, cardTxt: state.cardTxt, cartItems: action.cartItems, searchTxt: state.searchTxt, loadOnNav: state.loadOnNav   };
    case "editSearch":
        return { count: state.count, cardTxt: state.cardTxt, cartItems: state.cartItems, searchTxt: action.searchTxt, loadOnNav: state.loadOnNav   };
    case "toggleLoadOnNav":
        return { count: state.count, cardTxt: state.cardTxt, cartItems: state.cartItems, searchTxt: state.searchTxt, loadOnNav: action.loadOnNav   };
    default:
      //alert(action.cardTxt)
      return state;
  }
};

export const Context = React.createContext();
