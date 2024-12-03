import CardFull from "@components/CardFull";
import { selectAllWishlistItemsByUser } from "@database/items";
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
	const othersUserId = params.get("id") || "";

	const { allItems, shownItems } = useContextSelector("itemsStore");
	const { gridView } = useContextSelector("globalStore");
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
						items = allItems?.filter((item) => {
							return item.seller_id === currentUser.id;
						});
					} else if (categoryName === "wishlist") {
						if (othersUserId) {
							const res = await selectAllWishlistItemsByUser({ userId: othersUserId });
							if (!res.data) {
								console.error(`Error fetching wishlist items!`, res.error);

								items = [];
								return;
							}

							const userWishlistItems = allItems.filter((item) =>
								res.data.some((wishlistItem) => {
									return wishlistItem.item_id === item.id;
								}),
							);

							items = userWishlistItems;
						} else {
							const res = await selectAllWishlistItemsByUser({ userId: null });
							if (!res.data) {
								console.error(`Error fetching wishlist items!`, res.error);

								items = [];
								return;
							}

							const personalWishlistItems = allItems.filter((item) =>
								res.data.some((wishlistItem) => {
									return wishlistItem.item_id === item.id;
								}),
							);

							items = personalWishlistItems;
						}
					} else {
						items = allItems?.filter((item) => {
							return item.category.toLowerCase() === categoryName.toLowerCase();
						});
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
	}, [allItems, shownItems, categoryName, searchQuery, currentUser, othersUserId, dispatch]);

	const renderPlaceHolder = () => {
		let message = "";

		if (categoryName === "all") {
			message = "Empty Store";
		} else if (categoryName === "my-items") {
			message = "No Items";
		} else if (categoryName === "wishlist") {
			if (othersUserId && othersUserId !== currentUser.id) {
				message = "This user has no items in their wishlist";
			} else {
				message = "Empty wishlist";
			}
		} else {
			message = `No results for ${searchQuery}`;
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
					[styles["withGrid"]]: gridView && shownItems?.length,
					[styles["noGrid"]]: !gridView && shownItems?.length,
					[styles["emptyGrid"]]: !shownItems?.length,
				})}
				id="gridContainer"
			>
				{shownItems.length === 0 && renderPlaceHolder()}
				{shownItems?.map((item, i) => {
					return <CardFull key={i} item={item} isFullWidth={gridView} />;
				})}
			</div>
		</>
	);
};

export default Grid;
