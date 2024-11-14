import CardMini from "@components/CardMini";
import Window from "@popups/Window";
import { useContextDispatch, useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/TradeWindow.module.scss";
import { useState } from "react";
import { IoChatbubble, IoClose } from "react-icons/io5";
import { PiSwapBold } from "react-icons/pi";
import { toast } from "react-toastify";
import { storeTradeInDatabase } from "../../../middleware/Trade/trade.js";

const TradeWindow = (props) => {
	const { selectedItem } = useContextSelector("itemsStore");
	const { items: localStorageItems } = useContextSelector("globalStore");

	const dispatch = useContextDispatch();

	const [inventoryItems, setInventoryItems] = useState([...localStorageItems]);
	const [selectedOfferedItems, setSelectedOfferedItems] = useState([]);

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
		if (selectedOfferedItems.includes(item)) {
			const newList = selectedOfferedItems.filter((i) => {
				return i !== item;
			});

			setSelectedOfferedItems(newList);
		} else {
			setSelectedOfferedItems((prev) => {
				return [...prev, item];
			});
		}
	};

	const handleOfferReset = (e) => {
		setSelectedOfferedItems([]);
	};

	const handleInitiateChat = (e) => {
		console.log("Initiate chat");
	};

	const handleOfferSubmit = async (e) => {
		// I'm so sorry idk what else to do
		console.log(selectedOfferedItems);

		e.preventDefault();
		if (selectedOfferedItems.length === 0) {
			//prevents nothing from being traded
			toast.error("Please select at least one item to offer.");
			return;
		}

		const newItem = {
			id: 1234,
			userInitiator: "initiatorUserId",
			userReceiver: selectedItem.ownerId,
			items_in_trade: selectedOfferedItems.map((item) => item.id),
		};
		try {
			storeTradeInDatabase(newItem);
			toast.success("Trade offer sent!", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				transition: Bounce,
			});

			dispatch({
				type: "SET_TRADE_DISPLAYED",
				payload: false,
			});
		} catch (error) {
			console.error("Error initiating trade:", error);
			toast.error("An error occurred. Please try again.");
		}

		handleRemoveWindow(e);

		// try {
		// 	const response = await fetch("/https://localhost:6969/trade", {
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json" },
		// 		body: JSON.stringify({
		// 			itemIds: selectedOfferedItems.map((item) => item.id), //hope and prayers
		// 			userInitiator: "initiatorUserId",
		// 			userReceiver: selectedItem.ownerId,
		// 			timestamp: new Date().toISOString(),
		// 		}),
		// 	});

		// 	if (response.ok) {
		// 		//wrapped from previously written code
		// 		toast.success("Trade offer sent!", {
		// 			position: "top-center",
		// 			autoClose: 5000,
		// 			hideProgressBar: false,
		// 			closeOnClick: true,
		// 			pauseOnHover: true,
		// 			draggable: true,
		// 			progress: undefined,
		// 			theme: "dark",
		// 			transition: Bounce,
		// 		});

		// 		dispatch({
		// 			type: "SET_TRADE_DISPLAYED",
		// 			payload: false,
		// 		});
		// 	} else {
		// 		console.error("Failed to store trade");
		// 		toast.error("Failed to send trade offer. Please try again.");
		// 	}
	};

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
											isDefaultSelected={selectedOfferedItems.includes(item)}
											handleItemOfferSelected={handleItemOfferSelected}
											selectedOfferedItems={selectedOfferedItems}
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
						onClick={(e) => {
							handleOfferSubmit(e);
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
