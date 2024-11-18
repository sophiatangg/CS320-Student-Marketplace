import CardMini from "@components/CardMini";
import { storeTradeInDatabase } from "@database/trade";
import { getUser } from "@database/users";
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider.jsx";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider.jsx";
import styles from "@styles/TradeWindow.module.scss";
import { toastProps } from "@utils/toastProps.js";
import { useEffect, useState } from "react";
import { IoChatbubble, IoClose } from "react-icons/io5";
import { PiSwapBold } from "react-icons/pi";
import { toast } from "react-toastify";

const TradeWindow = (props) => {
	const { currentUser } = useAuth();

	const { allItems, selectedItem } = useContextSelector("itemsStore");

	const dispatch = useContextDispatch();

	const [inventoryItems, setInventoryItems] = useState([]);
	const [selectedOfferItems, setSelectedOfferItems] = useState([]);

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

		const sellerData = await getUser(selectedItem.seller_id);
		if (!sellerData || !sellerData.name) {
			toast.error(`Error fetching trade info.`);
			throw Error("Error while fetching trade info. Check code");
		}

		const tradeData = {
			buyer_id: currentUser.id,
			seller_id: selectedItem.seller_id,
			offer_items_ids: selectedOfferItemIds,
			target_item_id: selectedItem.id,
		};

		const tradeRes = await storeTradeInDatabase({ data: tradeData });
		if (!tradeRes) {
			const message = `Error initiating trade to ${sellerData.name}.`;
			toast.error(message, toastProps);
			throw Error(message + " Check code!");
		}

		// Update the allItems global state to mark the item as traded.
		// Otherwise, users would have to refresh the page to have show the updates
		dispatch({
			type: "SET_ALL_ITEMS",
			payload: allItems.map((item) => {
				const newItem = { ...item, isTraded: true };

				return item.id === selectedItem.id ? newItem : item;
			}),
		});

		toast.success(`Trade offer sent to ${sellerData.name}!`, toastProps);

		handleRemoveWindow(e);
	};

	useEffect(() => {
		const personalItems = allItems.filter((item) => {
			return item.seller_id === currentUser.id;
		});

		setInventoryItems(personalItems);
	}, [allItems]);

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
				<div className={styles["tradeWindowInner"]}>
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
											isDefaultSelected={selectedOfferItems.includes(item)}
											handleItemOfferSelected={handleItemOfferSelected}
											selectedOfferedItems={selectedOfferItems}
										/>
									);
								})}
							</div>
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
							<IoChatbubble />
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
