import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/ChatButton.module.scss";
import { useState } from "react";
import { BsChatQuoteFill } from "react-icons/bs";

const ChatButton = () => {
	const dispatch = useContextDispatch();

	const [badgeCount, setBadgeCount] = useState(0);

	const handleOpenChatList = (e) => {
		e.preventDefault();

		dispatch({
			type: "SET_CHAT_DISPLAYED",
			payload: true,
		});
	};

	return (
		<div
			className={styles["chatButton"]}
			onClick={(e) => {
				handleOpenChatList(e);
			}}
		>
			{badgeCount > 0 && (
				<div className={styles["badge"]}>{badgeCount}</div> // Badge to show the count
			)}
			<div className={styles["icon"]}>
				<BsChatQuoteFill
					style={{
						fill: "#fff",
					}}
				/>
			</div>
		</div>
	);
};

export default ChatButton;
