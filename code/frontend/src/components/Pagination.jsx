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

const Pagination = (props) => {
	const { predefined, className } = props;

	// Use global data if predefined is not provided
	const { pagination } = useContextSelector("globalStore");
	const { searchQuery } = useContextSelector("searchStore");
	const { allItems, shownItems } = useContextSelector("itemsStore");
	const { currentUser } = useAuth();

	const dispatch = useContextDispatch();

	// Fallback to global data if predefined does not exist
	const itemsPerPage = predefined?.currentItemsPerPage || pagination.itemsPerPage;
	const totalItems = predefined?.currentTotalItems || pagination.totalItems;
	const currentPage = predefined?.currentCurrentPage || parseInt(new URLSearchParams(useLocation().search).get("page") || "1", 10);

	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const categoryName = params.get("cat") || "all";
	const othersUserId = params.get("id") || "";

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	useEffect(() => {
		// Only fetch items count if predefined is not provided
		if (predefined) return;

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
	}, [predefined, allItems, categoryName, currentUser, dispatch, searchQuery, shownItems]);

	const handlePageChange = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		if (!predefined) {
			// Update URL and navigate when not using predefined data
			params.set("page", newPage);
			navigate(`${location.pathname}?${params.toString()}`);
		} else {
			// Call a custom handler if provided in predefined props
			predefined?.onPageChange?.(newPage);
		}
	};

	const renderCounter = () => {
		if (totalItems === 0 || (!predefined && shownItems.length === 0)) return null;

		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(startItem + (predefined?.currentItemsPerPage || shownItems.length) - 1, totalItems);

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

	if (predefined?.currentTotalItems === 0 || (!predefined && shownItems.length <= 0)) return null;

	return (
		<div className={cns(styles["paginationContainer"], className)}>
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
