import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/LikeButton.module.scss";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";

const LikeButton = (props) => {
	const { item } = props;

	const { allItems } = useContextSelector("itemsStore");
	const dispatch = useContextDispatch();

	const handleLike = ({ id }) => {
		if (isNaN(id)) {
			console.error("Check liked id!");
			return;
		}

		const handledLike = allItems.map((item, i) => {
			if (id === item.id) {
				item.isLiked = !item.isLiked;
			}

			return item;
		});

		dispatch({
			type: "SET_ALL_ITEMS",
			payload: handledLike,
		});
	};

	const handleMouseEnter = (e) => {};

	const handleMouseLeave = (e) => {};

	return (
		<div className={styles["like-container"]} id={item.id}>
			<button
				className={styles["like"]}
				id={item.id}
				aria-label="Like"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					handleLike({ id: item.id });
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{item.isLiked ? (
					<TiHeartFullOutline style={{ fill: "#F53333" }} className={styles["likeSVG"]} />
				) : (
					<TiHeartOutline style={{ fill: "#cccccc" }} className={styles["likeSVG"]} />
				)}
			</button>
		</div>
	);
};

export default LikeButton;
