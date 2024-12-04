import { countChatsByUserId } from "@database/chats";
import { useAuth } from "@providers/AuthProvider";
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/ChatButton.module.scss";
import { useEffect, useState } from "react";
import { BsChatQuoteFill } from "react-icons/bs";

const ChatButton = () => {
	const [badgeCount, setBadgeCount] = useState(0);

	const { currentUser } = useAuth();
	const dispatch = useContextDispatch();

	const handleOpenChatList = (e) => {
		e.preventDefault();

		dispatch({
			type: "SET_CHAT_DISPLAYED",
			payload: true,
		});
	};

	useEffect(() => {
		const fetchChatCount = async () => {
			if (currentUser && currentUser.id) {
				const count = await countChatsByUserId(currentUser.id);
				setBadgeCount(count);
			}
		};

		fetchChatCount();
	}, [currentUser]);

	return (
		<div
			className={styles["chatButton"]}
			onClick={(e) => {
				handleOpenChatList(e);
			}}
		>
			<div className={styles["iconContainer"]}>
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
			<div className={styles["title"]}>
				<span>Chat</span>
			</div>
		</div>
	);
};

export default ChatButton;
