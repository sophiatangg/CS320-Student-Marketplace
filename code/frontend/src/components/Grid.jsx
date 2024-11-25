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
	const { gridDisplay } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");

	const dispatch = useContextDispatch();

	useEffect(() => {
		const updateItems = async () => {
			dispatch({
				type: "SET_LOADING",
				payload: true,
			});

			try {
				let items;
				if (!searchQuery) {
					if (!categoryName || categoryName === "all") {
						items = allItems;
					} else if (categoryName === "my-items") {
						items = allItems.filter((item) => item.seller_id === currentUser.id);
					} else if (categoryName === "wishlist") {
						items = allItems.filter((item) => ownWishlistItems.some((wishlistItem) => wishlistItem.item_id === item.id));
					} else {
						items = allItems?.filter((item) => item.category.toLowerCase() === categoryName.toLowerCase());
					}
				} else {
					items = allItems?.filter((item) => {
						if (!item?.name) return false;
						const name = item.name.toLowerCase().replace(/\s+/g, "");
						const query = searchQuery.toLowerCase().replace(/\s+/g, "");
						return name.includes(query);
					});
				}

				dispatch({
					type: "SET_SHOWN_ITEMS",
					payload: items,
				});
			} catch (error) {
				console.error("Error processing items in Grid:", error);
			} finally {
				dispatch({
					type: "SET_LOADING",
					payload: false,
				});
			}
		};

		updateItems();
	}, [allItems, categoryName, searchQuery, currentUser, ownWishlistItems, dispatch]);

	const renderPlaceHolder = () => {
		let message = "";

		if (categoryName === "all") {
			message = "Empty Store";
		} else if (categoryName === "my-items") {
			message = "No Items";
		} else if (categoryName === "wishlist") {
			message = "Empty Wishlist";
		} else {
			message = `No results for ${searchQuery}.`;
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
				{shownItems.length === 0 && renderPlaceHolder()}
				{shownItems?.map((item, i) => {
					return <CardFull key={i} item={item} isFullWidth={gridDisplay} />;
				})}
			</div>
		</>
	);
};

export default Grid;
