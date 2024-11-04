import CardFull from "@components/CardFull";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/Grid.module.scss";
import cns from "@utils/classNames";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Grid = (props) => {
	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const categoryName = params.get("cat") || "";

	const { allItems, shownItems } = useContextSelector("itemsStore");
	const { gridDisplay, items: localStorageItems } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");

	const dispatch = useContextDispatch();

	useEffect(() => {
		let items;
		if (!searchQuery) {
			if (!categoryName || categoryName == "all") {
				items = allItems;
			} else if (categoryName === "my-items") {
				items = localStorageItems;
			} else if (categoryName === "wishlist") {
				items = allItems.filter((item) => item.isLiked);
			} else {
				items = allItems.filter((item) => item.category.toLowerCase() === categoryName.toLowerCase());
			}
		} else {
			const foundItems = allItems.filter((item, i) => {
				const name = item.name.toLowerCase().replace(" ", "");
				const query = searchQuery.toLowerCase().replace(" ", "");

				return name.includes(query);
			});

			items = foundItems;
		}

		dispatch({
			type: "SET_SHOWN_ITEMS",
			payload: items,
		});
	}, [allItems, categoryName, localStorageItems, searchQuery]);

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
				{!shownItems?.length && (
					<div className={styles["placeholder"]}>
						<h1>No items</h1>
					</div>
				)}
				{shownItems?.map((item, i) => {
					return <CardFull key={i} item={item} isFullWidth={gridDisplay} />;
				})}
			</div>
		</>
	);
};

export default Grid;
