import styles from "@styles/DeleteItemButton.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { editItemInDatabase } from "../../../middleware/Item/editItem.js";

const EditItemButton = (props) => {
	const { isBig, itemId } = props;

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

	const handleEditItem = () => {
		if (itemId != null || itemId > -1) {
			editItemInDatabase(itemId);
			console.log(`Deleting item with ID: ${itemId}`);
		} else {
			console.error("No item ID provided");
		}
	};

	return (
		<>
			<div
				className={cns(styles["EditItemButton"], {
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
				<h4 style={{ color: handleChangeHoverColor() }}>Edit</h4>
				<span className={styles["icon"]}>
					<FiEdit style={{ width: handleIconDimension(), height: handleIconDimension(), fill: handleChangeHoverColor() }} />
				</span>
			</div>
		</>
	);
};

export default EditItemButton;
