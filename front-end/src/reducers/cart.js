const initial = {
	cart: [],
	cartAmount: 0,
};

export const cartReducer = (state = initial, action) => {
	switch (action.type) {
		case "ADD_TO_CART":
			const updatedCart = [...state.cart, action.payload];

			return {
				...state,
				cart: updatedCart,
				cartAmount: state.cartAmount + 1,
			};

		case "REMOVE_FROM_CART":
			const filteredCart = state.cart.filter((item) => {
				return item.id !== action.payload.id;
			});

			return {
				...state,
				cart: filteredCart,
				cartAmount: state.cartAmount - 1,
			};

		case "CLEAR_CART":
			return {
				...state,
				cart: [],
				cartAmount: 0,
			};

		default:
			return state;
	}
};
