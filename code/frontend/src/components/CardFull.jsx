import AddToCartButton from "@components/AddToCartButton";
import TradeButton from "@components/TradeButton";
import WishlistButton from "@components/WishlistButton";
import { getUser } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/CardFull.module.scss";
import cns from "@utils/classNames";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

const CardFull = (props) => {
	const { item, isFullWidth } = props;

	const [owner, setOwner] = useState("");

	const { currentUser } = useAuth();

	const navigate = useNavigate();

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

	useEffect(() => {
		if (!item || !item.seller_id) return;

		getUser(item.seller_id)
			.then((res) => {
				setOwner(res.name);
			})
			.catch((error) => {
				console.error("Error finding owner of the item. Check the code!");
			});
	}, [item, owner]);

	const renderItemName = ({ text, highlight }) => {
		if (!text) return;
		if (!highlight) return text;

		const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
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

	const isOwnItem = item.seller_id === currentUser.id;

	return (
		<motion.div
			className={cns(styles["cardFull"], {
				[styles["cardFullWidth"]]: !isFullWidth,
				[styles["cardFullOwnItem"]]: isOwnItem,
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
				<div
					className={cns(styles["ownerInfo"], {
						[styles["ownerInfoFull"]]: isFullWidth,
						[styles["ownerDataFetching"]]: !owner,
					})}
				>
					{owner ? (
						<>
							<span>Posted by</span>
							<span>{owner}</span>
						</>
					) : (
						<span>Fetching seller name...</span>
					)}
				</div>

				<div className={styles["buttons"]}>
					<div className={styles["price-cart-trade"]}>
						<span className={styles["price"]}>${item.price}</span>
						{!isOwnItem && (
							<div className={styles["cart-trade"]}>
								<AddToCartButton item={item} isBig={false} />
								<TradeButton handleTradeOpen={handleTradeOpen} item={item} />
							</div>
						)}
					</div>
					{!isOwnItem && (
						<>
							<WishlistButton item={item} />
						</>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default CardFull;
