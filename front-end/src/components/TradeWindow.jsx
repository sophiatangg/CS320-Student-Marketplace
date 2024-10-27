import AnimatedWindow from "@animations/AnimatedWindow";
import CardMini from "@components/CardMini";
import { useContextSelector } from "@stores/StoreProvider";
import styles from "@styles/TradeWindow.module.scss";
import { useState } from "react";
import { IoChatbubble, IoClose } from "react-icons/io5";
import { PiSwapBold } from "react-icons/pi";
import { Bounce, toast } from "react-toastify";

const TradeWindow = (props) => {
	const { handleTradeOpen, selectedItem } = props;

	const localStorageItems = useContextSelector("globalStore").items;

	const [inventoryItems, setInventoryItems] = useState([...localStorageItems]);
	const [selectedOfferedItems, setSelectedOfferedItems] = useState([]);

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

	const handleOfferSubmit = (e) => {
		console.log(selectedOfferedItems);

		toast.success("Trade complete!", {
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

		handleRemoveWindow(e);
	};

	return (
		<AnimatedWindow>
			<div className={styles["tradeWindow"]}>
				<div className={styles["tradeWindowBG"]} onClick={handleRemoveWindow}></div>
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
			</div>
		</AnimatedWindow>
	);
};

export default TradeWindow;
