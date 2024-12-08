import { fetchMessagesById, sendMessage, subscribeToMessages, unsubscribeFromMessages, updateChat } from "@database/chats";
import { getUser } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import styles from "@styles/ChatMessage.module.scss";
import cns from "@utils/classNames";
import { useEffect, useState } from "react";

const ChatMessage = (props) => {
	const { activeChat } = props;

	const [currentChatWith, setCurrentChatWith] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	const { currentUser } = useAuth();

	useEffect(() => {
		if (!activeChat || !activeChat.id) return;

		let messageSubscription;
		const initializeChat = async () => {
			try {
				// Fetch existing messages
				const fetchedMessages = await fetchMessagesById({ chatId: activeChat.id });

				if (!fetchedMessages) {
					setMessages([]);
					console.error("Error fetching messages");
					return;
				}

				const currentChatter = await getUser(currentUser.id === activeChat.initiator_id ? activeChat.receiver_id : activeChat.initiator_id);
				if (!currentChatter) {
					setCurrentChatWith(null);
					throw new Error("Error fetching chat receiver");
				}

				setCurrentChatWith(currentChatter);

				// Map messages and fetch user data for each sender
				const formattedMessages = await Promise.all(
					fetchedMessages.map(async (msg) => {
						const user = await getUser(msg.sender_id); // Fetch user data
						return {
							id: msg.id,
							user: user || { id: msg.sender_id, name: "Unknown" }, // Fallback for unknown users
							message: msg.message,
							timeSent: msg.created_at,
							isRead: msg.is_read,
						};
					}),
				);

				setMessages(formattedMessages);

				// Subscribe to new messages
				messageSubscription = subscribeToMessages(activeChat.id, async (newMessage) => {
					const user = await getUser(newMessage.sender_id); // Fetch user data for the new message
					const formattedNewMessage = {
						id: newMessage.id,
						user: user || { id: newMessage.sender_id, name: "Unknown" },
						message: newMessage.message,
						timeSent: newMessage.created_at,
						isRead: newMessage.is_read,
					};

					setMessages((prevMessages) => [...prevMessages, formattedNewMessage]);
				});
			} catch (error) {
				console.error("Error initializing chat:", error);
			}
		};

		initializeChat();

		return () => {
			unsubscribeFromMessages(messageSubscription);
		};
	}, [activeChat, currentUser]);

	const handleSendMessage = async (e) => {
		if (e.shiftKey && e.code === "Enter") return; // Prevent sending on Shift + Enter
		if (e.code !== "Enter") return; // Allow only Enter key to send
		if (!newMessage.trim()) return; // Prevent sending empty messages

		try {
			// Insert the message into the database
			const newMessageData = await sendMessage({
				chatId: activeChat.id,
				senderId: currentUser.id,
				message: newMessage.trim(),
			});

			// Update the chat's last message
			await updateChat({
				chatId: activeChat.id,
				message: newMessage.trim(),
			});

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
		// Group consecutive messages by the same user
		const groupedMessages = messages.reduce((acc, msg, index) => {
			if (index === 0 || msg.user.id !== messages[index - 1].user.id) {
				// Start a new group if it's the first message or the sender changes
				acc.push([msg]);
			} else {
				// Add to the existing group
				acc[acc.length - 1].push(msg);
			}
			return acc;
		}, []);

		// Render the grouped messages
		return groupedMessages.map((group, groupIndex) => {
			const isCurrentUser = group[0].user.id === currentUser.id;
			const date = new Date(group[0].timeSent);

			return (
				<div
					key={groupIndex}
					id={groupIndex}
					className={cns(styles["messageGroup"], {
						[styles["messageGroupSelf"]]: isCurrentUser,
						[styles["messageGroupOther"]]: !isCurrentUser,
					})}
				>
					<div className={styles["messageHeader"]}>
						<strong>{group[0].user.name}</strong>
						<span className={styles["timestamp"]}>{date.toLocaleDateString([], { month: "short", day: "numeric" })}</span>
					</div>
					<div className={styles["messageContents"]}>
						{group.map((msg, msgIndex) => {
							// Determine the appropriate class
							const isOnlyMessage = group.length === 1;
							const isFirstMessage = msgIndex === 0 && group.length > 1;
							const isLastMessage = msgIndex === group.length - 1 && group.length > 1;

							return (
								<div
									key={msgIndex}
									className={cns(styles["messageContent"], {
										[styles["messageContentSingle"]]: isOnlyMessage,
										[styles["messageContentFirst"]]: isFirstMessage,
										[styles["messageContentLast"]]: isLastMessage,
									})}
								>
									<span>{msg.message}</span>
								</div>
							);
						})}
					</div>
				</div>
			);
		});
	};

	const renderInputArea = () => {
		const adjustTextareaHeight = (e) => {
			e.target.style.height = "auto";

			e.target.style.height = `${e.target.scrollHeight}px`;
		};

		const firstName = String(currentChatWith?.name || "Unknown").split(" ")[0];

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
