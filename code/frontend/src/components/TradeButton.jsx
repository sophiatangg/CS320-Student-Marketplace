import { findItemDataFromTrade } from "@database/trade";
import { useAuth } from "@providers/AuthProvider";
import styles from "@styles/TradeButton.module.scss";
import cns from "@utils/classNames";
import { useEffect, useState } from "react";
import { PiSwapBold } from "react-icons/pi";

const TradeButton = (props) => {
	const { isBig, item, handleTradeOpen } = props;

	const [isHovered, setHovered] = useState(false);
	const [hasAlreadySentTrade, setHasAlreadySentTrade] = useState(false);

	const { currentUser } = useAuth();

	const handleComponentHover = (e) => {
		setHovered(!isHovered);
	};

	const handleChangeHoverColor = () => {
		return isHovered ? "#92f" : "#999";
	};

	const handleIconDimension = () => {
		return isBig ? 24 : 18;
	};

	const handleInitiateTradeWindow = (e) => {
		e.preventDefault();
		e.stopPropagation();

		handleTradeOpen(true);
	};

	useEffect(() => {
		if (!item || !item.id || !item.seller_id) return;
		if (!currentUser || !currentUser.id) return;

		const checkTrade = async () => {
			try {
				// If the item is already marked as traded, no need to fetch from the database
				if (item.in_trade) {
					setHasAlreadySentTrade(true);
					return;
				}

				const itemData = await findItemDataFromTrade({
					itemId: item.id,
					userId: currentUser.id,
					sellerId: item.seller_id,
				});

				// Set to true if trade exists, otherwise false
				setHasAlreadySentTrade(!!itemData);
			} catch (error) {
				console.error("Error checking trade:", error);
				setHasAlreadySentTrade(false);
			}
		};

		checkTrade();
	}, [currentUser, item]);

	const renderIcon = () => {
		return (
			<>
				<h4 style={{ color: handleChangeHoverColor() }}>Trade now</h4>
				<span className={styles["icon"]}>
					<PiSwapBold style={{ width: handleIconDimension(), height: handleIconDimension(), fill: handleChangeHoverColor() }} />
				</span>
			</>
		);
	};

	const renderTradedLabel = () => {
		return (
			<>
				<h4 style={{ color: "#92f" }}>Traded</h4>
			</>
		);
	};

	return (
		<div
			className={cns(styles["tradeButton"], {
				[styles["isBig"]]: isBig,
				[styles["tradeSent"]]: hasAlreadySentTrade,
			})}
			onClick={(e) => {
				if (hasAlreadySentTrade) return;

				handleInitiateTradeWindow(e);
			}}
			onMouseEnter={(e) => {
				handleComponentHover(e);
			}}
			onMouseLeave={(e) => {
				handleComponentHover(e);
			}}
		>
			{!hasAlreadySentTrade ? renderIcon() : renderTradedLabel()}
		</div>
	);
};

export default TradeButton;
