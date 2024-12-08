import { addWishlistItemByUser, removeWishlistItemByUser } from "@database/items";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/LikeButton.module.scss";
import cns from "@utils/classNames";
import { toastProps } from "@utils/toastProps";
import { useEffect, useState } from "react";
import { TiHeartFullOutline, TiHeartOutline } from "react-icons/ti";
import { toast } from "react-toastify";

const WishlistButton = (props) => {
	const { item } = props;

	const [isItemWishlisted, setIsItemWishlisted] = useState(false);

	const { currentUser } = useAuth();

	const { ownWishlistItems } = useContextSelector("itemsStore");
	const dispatch = useContextDispatch();

	const handleAddWishlist = async ({ id }) => {
		const res = await addWishlistItemByUser({
			userId: currentUser.id,
			itemId: id,
		});

		if (res) {
			toast.success(`${item.name} is added to your wishlist!`, toastProps);

			dispatch({
				type: "SET_WISHLIST_ITEMS",
				payload: [...ownWishlistItems, res], // adding the new object to the list
			});
		} else {
			throw Error(`Error whitelisting ${item.name}.`);
		}
	};

	const handleRemoveWishlist = async ({ id }) => {
		const res = await removeWishlistItemByUser({
			userId: currentUser.id,
			itemId: id,
		});

		if (res) {
			toast.success(`${item.name} is removed from your wishlist!`, toastProps);

			dispatch({
				type: "SET_WISHLIST_ITEMS",
				payload: ownWishlistItems.filter((wishlistItem) => {
					return wishlistItem.item_id !== id;
				}),
			});
		} else {
			throw Error(`Error removal of ${item.name} from wishlist.`);
		}
	};

	const handleClick = async ({ id }) => {
		if (isNaN(id)) {
			console.error("Check liked id!");
			return;
		}

		if (!isItemWishlisted) {
			handleAddWishlist({ id });
		} else {
			handleRemoveWishlist({ id });
		}
	};

	const handleMouseEnter = (e) => {};

	const handleMouseLeave = (e) => {};

	useEffect(() => {
		if (!currentUser) return;
		if (!Array.isArray(ownWishlistItems)) return;

		const hasFoundWishlistedItem = ownWishlistItems.some((wishlistItem) => {
			return wishlistItem.item_id === item?.id && wishlistItem.user_id == currentUser.id;
		});

		setIsItemWishlisted(hasFoundWishlistedItem);
	}, [currentUser, ownWishlistItems]);

	if (!item) return null;

	return (
		<div className={styles["like-container"]} id={item?.id}>
			<button
				className={cns(styles["like"], {
					[styles["red"]]: isItemWishlisted,
				})}
				id={item?.id}
				aria-label="Like"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					handleClick({ id: item.id });
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{isItemWishlisted ? (
					<TiHeartFullOutline style={{ fill: "#F53333" }} className={styles["likeSVG"]} />
				) : (
					<TiHeartOutline style={{ fill: "#cccccc" }} className={styles["likeSVG"]} />
				)}
			</button>
		</div>
	);
};

export default WishlistButton;
