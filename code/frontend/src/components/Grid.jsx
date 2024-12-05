import CardFull from "@components/CardFull";
import { selectAllWishlistItemsByUser } from "@database/items";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Grid.module.scss";
import cns from "@utils/classNames";
import { sortItemsByDate, sortItemsByName, sortItemsByPrice } from "@utils/itemsData";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Grid = (props) => {
	const { currentUser } = useAuth();

	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const categoryName = params.get("cat") || "";
	const othersUserId = params.get("id") || "";

	const { allItems } = useContextSelector("itemsStore");
	const { gridView, sortProps } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");

	const dispatch = useContextDispatch();

	const [baseShownItems, setBaseShownItems] = useState([]); // Stores items based on category or search
	const [sortedShownItems, setSortedShownItems] = useState([]); // Stores items after sorting

	useEffect(() => {
		const updateBaseItems = async () => {
			dispatch({ type: "SET_LOADING", payload: true });

			try {
				let items;
				if (!searchQuery) {
					if (!categoryName || categoryName === "all") {
						items = allItems;
					} else if (categoryName === "my-items") {
						items = allItems.filter((item) => item.seller_id === currentUser.id);
					} else if (categoryName === "wishlist") {
						const res = await selectAllWishlistItemsByUser({ userId: othersUserId || null });
						if (!res.data) {
							console.error("Error fetching wishlist items:", res.error);
							items = [];
							return;
						}
						items = allItems.filter((item) => res.data.some((wishlistItem) => wishlistItem.item_id === item.id));
					} else {
						items = allItems.filter((item) => item.category.toLowerCase() === categoryName.toLowerCase());
					}
				} else {
					items = allItems.filter((item) => {
						if (!item?.name) return false;
						const name = item.name.toLowerCase().replace(/\s+/g, "");
						const query = searchQuery.toLowerCase().replace(/\s+/g, "");
						return name.includes(query);
					});
				}

				setBaseShownItems(items); // Update the filtered items
			} catch (error) {
				console.error("Error processing items in Grid:", error);
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		};

		updateBaseItems();
	}, [allItems, categoryName, searchQuery, currentUser, othersUserId, dispatch]);

	useEffect(() => {
		if (!baseShownItems) return;
		let sortedItems;

		switch (sortProps.selectedSortProp) {
			case "name":
				sortedItems = sortItemsByName(baseShownItems, sortProps.selectedSortOrder === "asc");
				break;
			case "date":
				sortedItems = sortItemsByDate(baseShownItems, sortProps.selectedSortOrder === "asc");
				break;
			case "price":
				sortedItems = sortItemsByPrice(baseShownItems, sortProps.selectedSortOrder === "asc");
				break;
			default:
				sortedItems = sortItemsByDate(baseShownItems, sortProps.selectedSortOrder === "asc");
				break;
		}

		setSortedShownItems(sortedItems);
		dispatch({
			type: "SET_SHOWN_ITEMS",
			payload: sortedItems,
		});
	}, [baseShownItems, sortProps.selectedSortProp, sortProps.selectedSortOrder, dispatch]);

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
					[styles["withGrid"]]: gridView && sortedShownItems?.length,
					[styles["noGrid"]]: !gridView && sortedShownItems?.length,
					[styles["emptyGrid"]]: !sortedShownItems?.length,
				})}
				id="gridContainer"
			>
				{sortedShownItems.length === 0 && renderPlaceHolder()}
				{sortedShownItems?.map((item, i) => {
					return <CardFull key={i} item={item} isFullWidth={gridView} />;
				})}
			</div>
		</>
	);
};

export default Grid;
