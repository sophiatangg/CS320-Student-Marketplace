import { fetchMessagesById, sendMessage, subscribeToMessages, unsubscribeFromMessages } from "@database/chats";
import { useAuth } from "@providers/AuthProvider";
import styles from "@styles/ChatMessage.module.scss";
import cns from "@utils/classNames";
import { useEffect, useState } from "react";

const ChatMessage = (props) => {
	const { activeUser, setActiveUser } = props;

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	const { currentUser } = useAuth();

	useEffect(() => {
		if (!activeUser || !activeUser.id) return;

		let messageSubscription;

		const initializeChat = async () => {
			try {
				// Fetch existing messages
				const fetchedMessages = await fetchMessagesById(activeUser.id);

				setMessages(fetchedMessages ?? []);

				// Subscribe to new messages
				messageSubscription = subscribeToMessages(activeUser.id, (newMessage) => {
					setMessages((prevMessages) => [...prevMessages, newMessage]);
				});
			} catch (error) {
				console.error("Error initializing chat:", error);
			}
		};

		initializeChat();

		return () => {
			unsubscribeFromMessages(messageSubscription);
		};
	}, [activeUser]);

	const handleSendMessage = async (e) => {
		if (e.shiftKey && e.code === "Enter") return; // Prevent sending on Shift + Enter
		if (e.code !== "Enter") return; // Allow only Enter key to send
		if (!newMessage.trim()) return; // Prevent sending empty messages

		try {
			// Insert the message into the database
			const newMessageData = await sendMessage({
				chatId: activeUser.id,
				senderId: currentUser.id,
				message: newMessage.trim(),
			});

			// Update the chat's last message
			await updateChat(activeUser.id, newMessage.trim());

			// Update local state
			setMessages((prevMessages) => {
				return [...prevMessages, newMessageData];
			});

			setNewMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
		}
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
