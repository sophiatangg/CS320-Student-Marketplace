import {
	countAllItems,
	countAllItemsFromCategory,
	countAllItemsFromUser,
	countAllWishlistItemsByUser,
	countSearchItemsFromQuery,
} from "@database/items";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Pagination.module.scss";
import cns from "@utils/classNames";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Pagination = () => {
	const { pagination } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");
	const { allItems, shownItems } = useContextSelector("itemsStore");
	const { currentUser } = useAuth();

	const dispatch = useContextDispatch();

	const { itemsPerPage, totalItems } = pagination;

	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const categoryName = params.get("cat") || "all";
	const currentPage = parseInt(params.get("page") || "1", 10);
	const othersUserId = params.get("id") || "";

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	useEffect(() => {
		const fetchItemsCount = async () => {
			try {
				let counter = 0;

				if (searchQuery) {
					// Count search results
					const { count: searchCount, error: searchError } = await countSearchItemsFromQuery({ searchQuery });

					if (searchError) {
						console.error("Error calculating search result count:", searchError);
					}

					counter = searchCount;
				} else {
					// Count items based on category
					switch (categoryName) {
						case "all":
							const { count: itemsCount } = await countAllItems();

							counter = itemsCount;
							break;

						case "wishlist":
							const { count: wishlistCount } = await countAllWishlistItemsByUser({
								userId: othersUserId ?? null,
							});

							counter = wishlistCount;
							break;

						case "my-items":
							const { count: ownItemsCount } = await countAllItemsFromUser({
								userId: currentUser.id,
							});

							counter = ownItemsCount;
							break;
						default:
							if (categoryName === "") {
								counter = 0;
								return;
							}

							const { count: categoryItemsCount } = await countAllItemsFromCategory({
								category: categoryName,
							});

							counter = categoryItemsCount;
							break;
					}
				}

				// Update pagination totalItems
				dispatch({
					type: "SET_PAGINATION",
					payload: {
						totalItems: counter,
					},
				});
			} catch (error) {
				console.error("Error fetching items count:", error);
			}
		};

		fetchItemsCount();
	}, [allItems, categoryName, currentUser, dispatch, searchQuery, shownItems]);

	const handlePageChange = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		params.set("page", newPage);
		navigate(`${location.pathname}?${params.toString()}`);
	};

	const renderCounter = () => {
		if (totalItems === 0 || shownItems.length === 0) return null;

		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(startItem + shownItems.length - 1, totalItems);

		return (
			<div className={styles["counterContainer"]}>
				<span>
					Showing{" "}
					<b>
						{startItem} - {endItem}
					</b>{" "}
					of <b>{totalItems}</b> {totalItems > 1 ? "Items" : "Item"}
				</span>
			</div>
		);
	};

	const renderPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;
		const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return (
			<div className={styles["pageNumbers"]}>
				{pages.map((page, i) => {
					return (
						<div
							key={i}
							className={cns(styles["navButton"], styles["secondary"], {
								[styles["active"]]: page === currentPage,
							})}
							onClick={(e) => {
								e.preventDefault();

								handlePageChange(page);
							}}
							tabIndex={1}
						>
							<span>{page}</span>
						</div>
					);
				})}
			</div>
		);
	};

	if (shownItems.length <= 0) return null;

	return (
		<div className={styles["paginationContainer"]}>
			{renderCounter()}
			<div className={styles["paginationInner"]}>
				<div
					className={cns(styles["navButton"], styles["primary"], {
						[styles["disabled"]]: currentPage === 1,
					})}
					onClick={() => {
						handlePageChange(currentPage - 1);
					}}
				>
					<span>Previous</span>
				</div>
				{renderPageNumbers()}
				<div
					className={cns(styles["navButton"], styles["primary"], {
						[styles["disabled"]]: currentPage === totalPages,
					})}
					onClick={() => {
						handlePageChange(currentPage + 1);
					}}
				>
					<span>Next</span>
				</div>
			</div>
		</div>
	);
};

export default Pagination;
