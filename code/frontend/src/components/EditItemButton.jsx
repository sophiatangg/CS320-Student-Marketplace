import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/EditItemButton.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

const EditItemButton = (props) => {
	const { isBig, itemId } = props;

	const [isHovered, setHovered] = useState(false);
	const dispatch = useContextDispatch();

	const handleComponentHover = (e) => {
		setHovered(!isHovered);
	};

	const handleChangeHoverColor = () => {
		return isHovered ? "#92f" : "#999";
	};

	const handleIconDimension = () => {
		return isBig ? 20 : 18;
	};

	const handleEditItem = () => {
		if (itemId) {
			// editItemInDatabase(itemId);

			dispatch({
				type: "SET_SELECTED_ITEM_ID_TO_EDIT",
				payload: itemId,
			});

			console.log(`Editing item with ID: ${itemId}`);
		} else {
			console.error("No item ID provided");
		}
	};

	return (
		<>
			<div
				className={cns(styles["editItemButton"], {
					[styles["isBig"]]: isBig,
				})}
				onClick={(e) => {
					handleEditItem(e);
				}}
				onMouseEnter={(e) => {
					handleComponentHover(e);
				}}
				onMouseLeave={(e) => {
					handleComponentHover(e);
				}}
			>
				<span
					style={{
						width: handleIconDimension(),
						height: handleIconDimension(),
					}}
				>
					<FaEdit style={{ width: handleIconDimension(), height: handleIconDimension(), fill: handleChangeHoverColor() }} />
				</span>
				<h4 style={{ color: handleChangeHoverColor() }}>Edit</h4>
			</div>
		</>
	);
};

export default EditItemButton;
