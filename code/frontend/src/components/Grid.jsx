import CardFull from "@components/CardFull";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Grid.module.scss";
import cns from "@utils/classNames";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Grid = (props) => {
	const { currentUser } = useAuth();

	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const categoryName = params.get("cat") || "";

	const { allItems, ownWishlistItems, shownItems } = useContextSelector("itemsStore");
	const { gridDisplay, items: localStorageItems } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");

	const dispatch = useContextDispatch();

	useEffect(() => {
		let items;
		if (!searchQuery) {
			if (!categoryName || categoryName === "all") {
				items = allItems;
			} else if (categoryName === "my-items") {
				items = allItems.filter((item) => {
					return item.seller_id === currentUser.id;
				});
			} else if (categoryName === "wishlist") {
				const matchedItems = allItems.filter((item) => {
					return ownWishlistItems.some((wishlistItem) => {
						return wishlistItem.item_id === item.id;
					});
				});

				items = matchedItems;
			} else {
				items = allItems?.filter((item) => item.category.toLowerCase() === categoryName.toLowerCase());
			}
		} else {
			// this is for when a user is searching with a query
			const foundItems = allItems?.filter((item, i) => {
				// safe checking for items without names
				// this should only happen in development and not during production
				if (!item?.name) return false;

				const name = item.name.toLowerCase().replace(/\s+/g, ""); // Safely access `name` and replace all spaces
				const query = searchQuery.toLowerCase().replace(/\s+/g, ""); // Replace all spaces in query

				return name.includes(query);
			});

			items = foundItems;
		}

		dispatch({
			type: "SET_SHOWN_ITEMS",
			payload: items,
		});
	}, [allItems, categoryName, localStorageItems, searchQuery]);

	const renderPlaceHolder = () => {
		let message = "";

		if (categoryName === "all") {
			message = "Empty Store";
		} else if (categoryName === "my-items") {
			message = "No Items";
		} else if (categoryName === "wishlist") {
			message = "Empty Wishlist";
		}

		return (
			<div className={styles["placeholder"]}>
				<h1>{message}</h1>
			</div>
		);
	};

	return (
		<>
			<div
				className={cns(styles["gridContainer"], {
					[styles["withGrid"]]: gridDisplay && shownItems?.length,
					[styles["noGrid"]]: !gridDisplay && shownItems?.length,
					[styles["emptyGrid"]]: !shownItems?.length,
				})}
				id="gridContainer"
			>
				{!shownItems?.length && renderPlaceHolder()}
				{shownItems?.map((item, i) => {
					return <CardFull key={i} item={item} isFullWidth={gridDisplay} />;
				})}
			</div>
		</>
	);
};

export default Grid;
