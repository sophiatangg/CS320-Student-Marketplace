import { fetchMessagesById, sendMessage, subscribeToMessages, unsubscribeFromMessages, updateChat } from "@database/chats";
import { getUser } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import styles from "@styles/ChatMessage.module.scss";
import cns from "@utils/classNames";
import { toastProps } from "@utils/toastProps";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ChatMessage = (props) => {
	const { activeChat } = props;

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [hoveredMessage, setHoveredMessage] = useState(null);

	const messageTextareaRef = useRef(null);
	const messageListRef = useRef(null);

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

					setMessages((prevMessages) => {
						const exists = prevMessages.some((msg) => msg.id === formattedNewMessage.id);
						return exists ? prevMessages : [...prevMessages, formattedNewMessage];
					});
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

	useEffect(() => {
		if (!messageTextareaRef.current || !messageListRef.current) return;

		const messageTextareaDimension = messageTextareaRef.current.getBoundingClientRect();
		const messageListElement = messageListRef.current;

		if (messageListElement.style) {
			messageListElement.style.height = `calc(100% - ${messageTextareaDimension.height}px)`;
		}
	}, [messageListRef, messageTextareaRef, newMessage]);

	const handleSendMessage = async (e) => {
		if (e.shiftKey && e.code === "Enter") return; // Prevent sending on Shift + Enter
		if (e.code !== "Enter") return; // Allow only Enter key to send
		if (!newMessage.trim()) return; // Prevent sending empty messages

		try {
			// Insert the message into the database
			const { data: newMessageData } = await sendMessage({
				chatId: activeChat.id,
				senderId: currentUser.id,
				message: newMessage.trim(),
			});

			setNewMessage("");

			if (!newMessageData) {
				toast.error("Error sending a message", toastProps);
				return;
			}

			// Update the chat's last message
			await updateChat({
				chatId: activeChat.id,
				message: newMessageData.message.trim(),
			});

			const user = await getUser(newMessageData.sender_id); // Fetch user data
			const newMessageDataObj = {
				id: newMessageData.id,
				user: user || {
					id: newMessageData.sender_id,
					name: "Unknown",
				},
				message: newMessageData.message,
				timeSent: newMessageData.created_at,
				isRead: newMessageData.is_read,
			};

			// Update local state
			setMessages((prevMessages) => {
				const exists = prevMessages.some((msg) => msg.id === newMessageDataObj.id);
				return exists ? prevMessages : [...prevMessages, newMessageDataObj];
			});
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const renderContent = () => {
		return (
			<div ref={messageListRef} className={styles["chatMessageContent"]}>
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
			const groupMessageDate = new Date(group[0].timeSent);
			const messengerName = group[0].name;

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
						<span className={styles["timestamp"]}>
							{groupMessageDate.toLocaleDateString([], {
								month: "long",
								day: "2-digit",
								year: "numeric",
							})}
						</span>
					</div>
					<div className={styles["messageContents"]}>
						{group.map((msg, msgIndex) => {
							// Determine the appropriate class
							const isOnlyMessage = group.length === 1;
							const isFirstMessage = msgIndex === 0 && group.length > 1;
							const isLastMessage = msgIndex === group.length - 1 && group.length > 1;

							const isHovered = hoveredMessage === `${groupIndex}-${msgIndex}`;
							const msgDate = new Date(msg.timeSent);

							return (
								<div
									key={msgIndex}
									className={cns(styles["messageContent"], {
										[styles["messageContentSingle"]]: isOnlyMessage,
										[styles["messageContentFirst"]]: isFirstMessage,
										[styles["messageContentLast"]]: isLastMessage,
									})}
									onMouseEnter={() => setHoveredMessage(`${groupIndex}-${msgIndex}`)}
									onMouseLeave={() => setHoveredMessage(null)}
								>
									<span className={styles["msg"]}>{msg.message}</span>
									{isHovered && (
										<span className={cns(styles["timestamp"], styles["altTime"])}>
											{msgDate.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									)}
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

		const firstName = String(activeChat.user.name || "Unknown").split(" ")[0];

		return (
			<div className={styles["chatMessageInputArea"]}>
				<textarea
					ref={messageTextareaRef}
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
		<div
			className={cns(styles["chatMessage"], {
				[styles["chatUnknown"]]: !activeChat,
			})}
		>
			{renderContent()}
			{renderInputArea()}
		</div>
	);
};

export default ChatMessage;
