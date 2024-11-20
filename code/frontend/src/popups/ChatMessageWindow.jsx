import styles from "@styles/ChatMessage.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ChatMessageWindow = (props) => {
	const { activeUser, setActiveUser } = props;

	const [isMinimized, setIsMinimized] = useState(false);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

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

	const renderHeader = () => {
		return (
			<div className={styles["chatMessageHeader"]}>
				<div className={styles["avatarContainer"]}>
					{activeUser.avatar_url && <img src={activeUser.avatar_url} alt="User Avatar" className={styles["avatar"]} />}
				</div>
				<span className={styles["title"]}>{activeUser.name}</span>
				<div className={styles["chatMessageButtons"]}>
					<div className={cns(styles["button"])} onClick={toggleMinimize}>
						{isMinimized ? <FaChevronUp /> : <FaChevronDown />}
					</div>
					<div className={styles["button"]} onClick={removeMessageWindow}>
						<IoClose
							style={{
								width: "20px",
								height: "20px",
							}}
						/>
					</div>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		return (
			!isMinimized && (
				<div className={styles["chatMessageContent"]}>
					<div className={styles["messageList"]}>{renderMessages()}</div>
				</div>
			)
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
					placeholder="Type a message..."
				/>
			</div>
		);
	};

	return (
		<div
			className={cns(styles["chatMessageWindow"], {
				[styles["minimized"]]: isMinimized,
				[styles["maximized"]]: !isMinimized,
			})}
		>
			{renderHeader()}
			{renderContent()}
			{renderInputArea()}
		</div>
	);
};

export default ChatMessageWindow;
