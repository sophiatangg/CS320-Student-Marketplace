import AnimatedCard from "@/containers/AnimatedCard";
import styles from "@styles/TradeButton.module.scss";

const TradeButton = () => {
	return (
		<>
			<AnimatedCard>
				<div className={styles["tradeButton"]}>
					<h4>Trade now</h4>
				</div>
			</AnimatedCard>
		</>
	);
};

export default TradeButton;
