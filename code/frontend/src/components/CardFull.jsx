import AddToCartButton from "@components/AddToCartButton";
import LikeButton from "@components/LikeButton";
import TradeButton from "@components/TradeButton";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/CardFull.module.scss";
import cns from "@utils/classNames";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CardFull = (props) => {
	const { item, isFullWidth } = props;

	const navigate = useNavigate();

	const variants = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const { allItems } = useContextSelector("itemsStore");
	const { searchQuery } = useContextSelector("searchStore");
	const dispatch = useContextDispatch();

	const handleTradeOpen = (bool) => {
		dispatch({
			type: "SET_TRADE_DISPLAYED",
			payload: bool,
		});
	};

	const handleSelectItem = ({ id }) => {
		const clickedItem = allItems?.find((_item) => {
			return _item.id === id;
		});

		dispatch({
			type: "SET_SELECTED_ITEM",
			payload: clickedItem,
		});

		navigate(`/store/${clickedItem.surname}`);
	};

	const handleCurrentHoveredItem = ({ id }) => {
		if (isNaN(id)) {
			console.error("Check id!");
			return;
		}

		const hoveredItem = allItems?.find((item) => {
			return item.id === id;
		});

		dispatch({
			type: "SET_SELECTED_ITEM",
			payload: hoveredItem,
		});
	};

	const renderItemName = ({ text, highlight }) => {
		if (!highlight) return text;

		const parts = text.split(new RegExp(`(${highlight})`, "gi"));
		return parts.map((part, index) =>
			part.toLowerCase() === highlight.toLowerCase() ? (
				<span key={index} className={styles["highlight"]}>
					{part}
				</span>
			) : (
				part
			),
		);
	};

	return (
		<motion.div
			className={cns(styles["cardFull"], {
				[styles["cardFullWidth"]]: !isFullWidth,
			})}
			onMouseEnter={(e) => {
				handleCurrentHoveredItem({ id: item.id });
			}}
			onMouseLeave={(e) => {
				handleCurrentHoveredItem({ id: item.id });
			}}
			id={item.id}
			style={{ margin: 0, padding: 0 }}
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<div
				className={styles["thumbnail"]}
				onClick={(e) => {
					handleSelectItem({ id: item.id });
				}}
			>
				<img src={item.images[0]} className={styles["img"]} alt="Item Cover Image" />
			</div>
			<div className={styles["content"]}>
				<h2
					className={styles["name"]}
					onClick={(e) => {
						handleSelectItem({ id: item.id });
					}}
				>
					{renderItemName({
						text: item.name,
						highlight: searchQuery,
					})}
				</h2>
				<div className={styles["buttons"]}>
					<div className={styles["price-cart-trade"]}>
						<span className={styles["price"]}>${item.price}</span>
						<div className={styles["cart-trade"]}>
							<AddToCartButton item={item} isBig={false} />
							<TradeButton handleTradeOpen={handleTradeOpen} />
						</div>
					</div>
					<LikeButton item={item} />
				</div>
			</div>
		</motion.div>
	);
};

export default CardFull;
