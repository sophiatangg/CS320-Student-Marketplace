import CardMini from "@components/CardMini";
import Pagination from "@components/Pagination";
import {
	countAllTradeableItemsFromUser,
	selectAllItemsWithImages,
	selectAllTradeableItemsWithImagesFromUser,
	updateItemByColumn,
} from "@database/items";
import { initializeTradeStatus, storeTradeInDatabase } from "@database/trade";
import { getUser } from "@database/users";
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider.jsx";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider.jsx";
import styles from "@styles/TradeWindow.module.scss";
import { toastProps } from "@utils/toastProps.js";
import { useEffect, useRef, useState } from "react";
import { BsChatQuoteFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { PiSwapBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const TradeWindow = (props) => {
	const { currentUser } = useAuth();

	const { pagination: globalPagination } = useContextSelector("globalStore");
	const { allItems, selectedItem } = useContextSelector("itemsStore");
	const dispatch = useContextDispatch();

	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const categoryName = params.get("cat") || "all";
	const currentPage = parseInt(params.get("page") || "1", 10);
	const sortPropName = params.get("spn") || "date";
	const sortPropType = params.get("spt") || "asc";

	const [inventoryItems, setInventoryItems] = useState([]);
	const [selectedOfferItems, setSelectedOfferItems] = useState([]);

	const [pagination, setPagination] = useState({
		currentPage: 1,
		itemsPerPage: 6,
		totalInventory: 0,
	});

	const tradeWindowInnerRef = useRef(null);

	const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;

	const handleTradeOpen = (bool) => {
		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: bool,
		});
	};

	const handleRemoveWindow = (e) => {
		handleTradeOpen(false);
	};

	const handleItemOfferSelected = (e, item) => {
		e.preventDefault();

		if (selectedOfferItems.includes(item)) {
			const newList = selectedOfferItems.filter((i) => {
				return i !== item;
			});

			setSelectedOfferItems(newList);
		} else {
			setSelectedOfferItems((prev) => {
				return [...prev, item];
			});
		}
	};

	const handleOfferReset = (e) => {
		setSelectedOfferItems([]);
	};

	const handleInitiateChat = (e) => {
		console.log("Initiate chat");
	};

	const handleOfferSubmit = async (e) => {
		e.preventDefault();

		if (selectedOfferItems.length === 0) {
			// prevents traded if there are no selected items
			toast.error("Please select at least one item to offer.", toastProps);
			return;
		}

		const selectedOfferItemIds = selectedOfferItems.map((item) => {
			return item.id;
		});

		const sellerData = await getUser(selectedItem?.seller_id);
		if (!sellerData || !sellerData.name) {
			toast.error(`Error fetching trade info.`);
			throw Error("Error while fetching trade info. Check code");
		}

		const tradeData = {
			buyer_id: currentUser?.id,
			seller_id: selectedItem?.seller_id,
			offer_items_ids: selectedOfferItemIds,
			target_item_id: selectedItem?.id,
		};

		const tradeRes = await storeTradeInDatabase({ data: tradeData });
		if (!tradeRes) {
			const message = `Error initiating trade to ${sellerData.name}.`;
			toast.error(message, toastProps);
			throw new Error(message + " Check code!");
		}

		const { data: tradeStatusData, error: tradeStatusError } = await initializeTradeStatus({
			tradeId: tradeRes[0].id,
		});

		if (tradeStatusError) {
			const message = `Something unexpectedly went wrong. Check trade status ${tradeStatusData.id}.`;
			console.error(message);
			throw new Error(message + " Check code!");
		}

		try {
			// Use Promise.all to ensure all updates are processed
			await Promise.all(
				selectedOfferItemIds.map(async (itemId) => {
					const flaggedItemAsTraded = await updateItemByColumn({
						id: itemId,
						column: "in_trade",
						value: true,
					});

					if (!flaggedItemAsTraded) {
						throw new Error(`Error updating trade status for item ${itemId}`);
					}
				}),
			);

			const { data, error } = await selectAllItemsWithImages({
				limit: globalPagination.itemsPerPage,
				offset: offset,
				sortPropName: sortPropName,
				sortPropType: sortPropType,
			});

			if (data) {
				dispatch({
					type: "SET_ALL_ITEMS",
					payload: data,
				});
			} else {
				console.error("Failed to fetch new items:", error);
			}

			toast.success(`Trade offer sent to ${sellerData.name}!`, toastProps);
			handleRemoveWindow(e);
		} catch (error) {
			console.error("Error updating trade status for items:", error);
			toast.error("An error occurred while updating item trade statuses.", toastProps);
		}
	};

	const handlePageChange = (newPage) => {
		// Update the pagination state
		setPagination((prev) => ({
			...prev,
			currentPage: newPage,
		}));

		// Scroll the `tradeWindowInner` element to the top
		if (tradeWindowInnerRef.current) {
			tradeWindowInnerRef.current.scrollTop = 0;
		}
	};

	useEffect(() => {
		const fetchInventoryData = async () => {
			const { data: itemsData, error: itemsError } = await selectAllTradeableItemsWithImagesFromUser({
				userId: currentUser.id,
				limit: pagination.itemsPerPage,
				offset: offset,
			});

			const { count: itemsCounterNum, error: itemsCounterError } = await countAllTradeableItemsFromUser({
				userId: currentUser.id,
			});

			if (itemsError || itemsCounterError) {
				throw new Error("Error fetching inventory data.");
			}

			setPagination((prev) => {
				return {
					...prev,
					totalInventory: itemsCounterNum,
				};
			});

			setInventoryItems(itemsData);
		};

		fetchInventoryData();
	}, [allItems, currentUser, pagination.currentPage, pagination.itemsPerPage]);

	return (
		<Window dispatchType={"SET_TRADE_DISPLAYED"}>
			<div className={styles["tradeWindowContainer"]}>
				<div className={styles["tradeWindowHeader"]}>
					<h1>Initiate Trade</h1>
					<div className={styles["closeButton"]} tabIndex={0}>
						<IoClose
							tabIndex={0}
							style={{
								width: "100%",
								height: "100%",
							}}
							onClick={handleRemoveWindow}
						/>
					</div>
				</div>
				<div ref={tradeWindowInnerRef} className={styles["tradeWindowInner"]}>
					<div className={styles["tradeWindowContent"]}>
						<div className={styles["tradeListContainer"]} id="top">
							<h4>What you want</h4>
							<div className={styles["tradingList"]}>
								<CardMini item={selectedItem} isDefaultSelected={true} />
							</div>
						</div>
						<div className={styles["tradeListContainer"]} id="bottom">
							<h4>What you can trade</h4>
							<div className={styles["tradingList"]}>
								{inventoryItems.map((item, itemIndex) => {
									return (
										<CardMini
											key={itemIndex}
											item={item}
											source={"tradeWindow"}
											isDefaultSelected={selectedOfferItems.includes(item)}
											handleItemOfferSelected={handleItemOfferSelected}
											selectedOfferedItems={selectedOfferItems}
										/>
									);
								})}
							</div>
							<Pagination
								className={styles["inventoryPages"]}
								predefined={{
									currentCurrentPage: pagination.currentPage,
									currentItemsPerPage: pagination.itemsPerPage,
									currentTotalItems: pagination.totalInventory,
									onPageChange: handlePageChange,
								}}
							/>
						</div>
					</div>
				</div>
				<div className={styles["tradeFloatBottom"]}>
					<button
						id="chat"
						className={styles["button"]}
						onClick={(e) => {
							handleInitiateChat(e);
						}}
					>
						<span className={styles["icon"]}>
							<BsChatQuoteFill />
						</span>
						<span className={styles["label"]}>Chat</span>
					</button>
					<button
						id="trade"
						className={styles["button"]}
						onClick={async (e) => {
							await handleOfferSubmit(e);
						}}
					>
						<span className={styles["icon"]}>
							<PiSwapBold />
						</span>
						<span className={styles["label"]}>Send Trade</span>
					</button>
					<button
						id="reset"
						className={styles["button"]}
						onClick={(e) => {
							handleOfferReset(e);
						}}
					>
						Reset
					</button>
					<button
						id="cancel"
						className={styles["button"]}
						onClick={(e) => {
							handleRemoveWindow(e);
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</Window>
	);
};

export default TradeWindow;
