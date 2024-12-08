import { fetchTradeRequestCounts } from "@database/trade";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/TradeCenterButton.module.scss";
import { useEffect, useState } from "react";
import { PiSwapBold } from "react-icons/pi";

const TradeCenterButton = () => {
	const { currentUser } = useAuth();
	const [tradeRequestsCount, setTradeRequestsCount] = useState(0);

	const { allItems, shownItems } = useContextSelector("itemsStore");

	const dispatch = useContextDispatch();

	const handleOpenTradeManageWindow = (bool) => {
		dispatch({
			type: "SET_TRADE_MANAGE_DISPLAYED",
			payload: bool,
		});
	};

	useEffect(() => {
		const loadTradeRequests = async () => {
			if (!currentUser || !currentUser.id) return;

			try {
				// Fetch RECEIVED trade requests
				const receivedRequests = await fetchTradeRequestCounts({
					userId: currentUser.id,
					type: "RECEIVED",
				});

				// Fetch SENT trade requests
				const sentRequests = await fetchTradeRequestCounts({
					userId: currentUser.id,
					type: "SENT",
				});

				const receivedRequestsCount = receivedRequests || 0;
				const sentRequestsCount = sentRequests || 0;

				setTradeRequestsCount(receivedRequestsCount + sentRequestsCount);
			} catch (error) {
				console.error("Error loading trade requests:", error);
			}
		};

		loadTradeRequests();
	}, [allItems, currentUser, shownItems]);

	return (
		<div
			className={styles["tradeButtonCenterContainer"]}
			onClick={(e) => {
				handleOpenTradeManageWindow(true);
			}}
		>
			<div className={styles["iconContainer"]}>
				{tradeRequestsCount > 0 && <div className={styles["badge"]}>{tradeRequestsCount}</div>}
				<div className={styles["icon"]}>
					<PiSwapBold style={{ color: "#fff" }} />
				</div>
			</div>
			<div className={styles["title"]}>
				<span>Trade</span>
			</div>
		</div>
	);
};

export default TradeCenterButton;
