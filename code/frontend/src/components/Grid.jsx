import CardFull from "@components/CardFull";
import {
	searchItemsWithImagesFromQuery,
	selectAllItemsWithImages,
	selectAllItemsWithImagesFromCategory,
	selectAllItemsWithImagesFromUser,
	selectAllWishlistedItemsWithImagesFromUser,
} from "@database/items";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Grid.module.scss";
import cns from "@utils/classNames";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Grid = (props) => {
	const { currentUser } = useAuth();

	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const categoryName = params.get("cat") || "all";
	const othersUserId = params.get("id") || "";
	const currentPage = parseInt(params.get("page") || "1", 10);
	const sortPropName = params.get("spn") || "date";
	const sortPropType = params.get("spt") || "asc";

	const { allItems } = useContextSelector("itemsStore");
	const { gridView, pagination } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");

	const { itemsPerPage } = pagination;
	const offset = (currentPage - 1) * itemsPerPage;

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
						const { data } = await selectAllItemsWithImages({
							limit: itemsPerPage,
							offset: offset,
							sortPropName: sortPropName,
							sortPropType: sortPropType,
						});

						items = data;
					} else if (categoryName === "my-items") {
						const { data } = await selectAllItemsWithImagesFromUser({
							userId: currentUser.id,
							limit: itemsPerPage,
							offset: offset,
							sortPropName: sortPropName,
							sortPropType: sortPropType,
						});

						items = data ?? [];
					} else if (categoryName === "wishlist") {
						const { data } = await selectAllWishlistedItemsWithImagesFromUser({
							userId: othersUserId ?? currentUser.id,
							limit: itemsPerPage,
							offset: offset,
							sortPropName: sortPropName,
							sortPropType: sortPropType,
						});

						items = data ?? [];
					} else {
						const { data } = await selectAllItemsWithImagesFromCategory({
							category: categoryName.toLowerCase(),
							limit: itemsPerPage,
							offset: offset,
							sortPropName: sortPropName,
							sortPropType: sortPropType,
						});

						items = data ?? [];
					}
				} else {
					const { data } = await searchItemsWithImagesFromQuery({
						searchQuery: searchQuery,
					});

					items = data ?? [];
				}

				setBaseShownItems(items); // Update the filtered items
			} catch (error) {
				console.error("Error processing items in Grid:", error);
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		};

		updateBaseItems();
	}, [allItems, categoryName, currentUser, currentPage, itemsPerPage, offset, othersUserId, searchQuery, sortPropName, sortPropType, dispatch]);

	useEffect(() => {
		if (!baseShownItems) return;

		setSortedShownItems(baseShownItems);
		dispatch({
			type: "SET_SHOWN_ITEMS",
			payload: baseShownItems,
		});
	}, [baseShownItems, dispatch]);

	const renderPlaceHolder = () => {
		let message = "";

		if (!searchQuery) {
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
				message = `No results for ${categoryName}`;
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
