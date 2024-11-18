import { fetchTradeRequests } from "@database/trade";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/TradeCenterButton.module.scss";
import { useEffect, useState } from "react";
import { PiSwapBold } from "react-icons/pi";

const TradeCenterButton = () => {
	const { currentUser } = useAuth();
	const [tradeRequestsCount, setTradeRequestsCount] = useState(0);

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
				const tradeRequests = await fetchTradeRequests({ userId: currentUser.id });

				if (tradeRequests && tradeRequests.length > 0) {
					setTradeRequestsCount(tradeRequests.length); // Update the badge count
				} else {
					setTradeRequestsCount(0); // No trade offers
				}
			} catch (error) {
				console.error("Error loading trade requests:", error);
			}
		};

		loadTradeRequests();
	}, [currentUser]);

	return (
		<div
			className={styles["tradeButtonCenterContainer"]}
			onClick={(e) => {
				handleOpenTradeManageWindow(true);
			}}
		>
			{tradeRequestsCount > 0 && (
				<div className={styles["badge"]}>{tradeRequestsCount}</div> // Badge to show the count
			)}
			<div className={styles["icon"]}>
				<PiSwapBold style={{ color: "#fff" }} />
			</div>
		</div>
	);
};

export default TradeCenterButton;
