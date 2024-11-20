import styles from "@styles/ChatMessage.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";

const ChatMessage = (props) => {
	const { activeUser, setActiveUser } = props;

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	const removeMessageWindow = () => {
		setActiveUser(null);
	};

	const handleSendMessage = (e) => {
		if (e.shiftKey && e.code === "Enter") return; // Prevent sending on Shift + Enter
		if (e.code !== "Enter") return; // Allow only Enter key to send
		if (!newMessage.trim()) return; // Prevent sending empty messages

		setMessages((prevMessages) => [...prevMessages, { sender: "Me", content: newMessage, timestamp: new Date() }]);
		setNewMessage("");
	};

	const renderContent = () => {
		return (
			<div className={styles["chatMessageContent"]}>
				<div className={styles["messageList"]}>{renderMessages()}</div>
			</div>
		);
	};

	const renderMessages = () => {
		return messages.map((msg, index) => (
			<div key={index} className={styles["messageItem"]}>
				<div className={styles["messageHeader"]}>
					<strong>{msg.sender}</strong>
					<span className={styles["timestamp"]}>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
				</div>
				<div className={styles["messageContent"]}>
					<span>{msg.content}</span>
				</div>
			</div>
		));
	};

	const renderInputArea = () => {
		const adjustTextareaHeight = (e) => {
			e.target.style.height = "auto";

			e.target.style.height = `${e.target.scrollHeight}px`;
		};

		const firstName = String(activeUser.name).split(" ")[0];

		return (
			<div className={styles["chatMessageInputArea"]}>
				<textarea
					type="text"
					value={newMessage}
					onChange={(e) => {
						e.preventDefault();
						setNewMessage(e.target.value);
					}}
					onInput={adjustTextareaHeight}
					onKeyDown={handleSendMessage}
					placeholder={`Type a message to ${firstName}...`}
				/>
			</div>
		);
	};

	return (
		<div className={cns(styles["chatMessage"], {})}>
			{renderContent()}
			{renderInputArea()}
		</div>
	);
};

export default ChatMessage;
