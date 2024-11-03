const initial = {
	searchQuery: "",
};

export const searchReducer = (state = initial, action) => {
	switch (action.type) {
		case "SET_SEARCH_QUERY":
			return {
				...state,
				searchQuery: action.payload,
			};

		case "CLEAR_SEARCH_QUERY":
			return {
				...state,
				searchQuery: "",
			};
		default:
			return state;
	}
};
