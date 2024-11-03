import styles from "@styles/TradeButton.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { PiSwapBold } from "react-icons/pi";

const TradeButton = (props) => {
	const { isBig, handleTradeOpen } = props;

	const [isHovered, setHovered] = useState(false);

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

	return (
		<>
			<div
				className={cns(styles["tradeButton"], {
					[styles["isBig"]]: isBig,
				})}
				onClick={(e) => {
					handleInitiateTradeWindow(e);
				}}
				onMouseEnter={(e) => {
					handleComponentHover(e);
				}}
				onMouseLeave={(e) => {
					handleComponentHover(e);
				}}
			>
				<h4 style={{ color: handleChangeHoverColor() }}>Trade now</h4>
				<span className={styles["icon"]}>
					<PiSwapBold style={{ width: handleIconDimension(), height: handleIconDimension(), fill: handleChangeHoverColor() }} />
				</span>
			</div>
		</>
	);
};

export default TradeButton;
