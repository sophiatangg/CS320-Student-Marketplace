import ChatListWindow from "@popups/ChatListWindow";
import ChatMessageWindow from "@popups/ChatMessageWindow";
import styles from "@styles/ChatWindow.module.scss";
import { useState } from "react";

const ChatWindow = () => {
	const [activeChat, setActiveChat] = useState(null);

	const handleChatSelect = (user) => {
		setActiveChat(user);
	};

	return (
		<div className={styles["chat"]}>
			<div className={styles["chatInner"]}>
				{activeChat && <ChatMessageWindow activeUser={activeChat} setActiveUser={setActiveChat} />}
				<ChatListWindow onSelectChat={handleChatSelect} />
			</div>
		</div>
	);
};

export default ChatWindow;
