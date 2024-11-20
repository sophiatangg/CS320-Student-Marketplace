import { getUser } from "@database/users";
import { useAuth } from "@providers/AuthProvider";
import styles from "@styles/ChatListWindow.module.scss";
import cns from "@utils/classNames";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ChatListWindow = (props) => {
	const { onSelectChat } = props;

	const { currentUser } = useAuth();

	const [chatList, setChatList] = useState([]);
	const [isMinimized, setIsMinimized] = useState(true);
	const [userAvatarURL, setUserAvatarURL] = useState("");

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	useEffect(() => {
		if (!currentUser) return;

		const fetchUser = async () => {
			const res = await getUser(currentUser.id);

			if (!res) {
				throw Error("Error fetching user for chat.");
			}

			setUserAvatarURL(res.avatar_url);
		};

		fetchUser();
	}, [currentUser]);

	useEffect(() => {
		const fetchChats = async () => {
			const chats = [
				{
					id: 1,
					name: "User 1",
					avatar_url: "",
					lastMessage: "Hi!!",
				},
				{
					id: 2,
					name: "User 2",
					avatar_url: "",
					lastMessage: "Hello~",
				},
			];

			setChatList(chats);
		};

		fetchChats();
	}, []);

	const isChatListEmpty = chatList.length === 0;

	const renderChatList = () => {
		return (
			<div className={styles["chatContentList"]}>
				{chatList.map((chat) => (
					<div
						key={chat.id}
						className={styles["chatItem"]}
						onClick={(e) => {
							onSelectChat(chat);
						}}
					>
						<div className={styles["chatAvatarContainer"]}>{chat.avatar && <img src={chat.avatar} className={styles["avatar"]} />}</div>
						<div className={styles["chatContent"]}>
							<span className={styles["chatName"]}>{chat.name}</span>
							<div className={styles["chatMessagePreview"]}>
								<span>{chat.lastMessage}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	};

	const renderEmptyContainer = () => {
		return (
			<div className={styles["emptyContentInner"]}>
				<span>Start a conversation with someone!</span>
			</div>
		);
	};

	return (
		<div
			className={cns(styles["chatList"], {
				[styles["minimized"]]: isMinimized,
				[styles["maximized"]]: !isMinimized,
			})}
		>
			<div className={styles["header"]}>
				<div className={styles["avatarContainer"]}>
					{userAvatarURL && <img src={userAvatarURL} alt="User Avatar" className={styles["avatar"]} />}
				</div>
				<span className={styles["title"]}>Chat</span>
				<div className={styles["buttons"]}>
					<div className={cns(styles["button"])} onClick={toggleMinimize}>
						{isMinimized ? <FaChevronUp /> : <FaChevronDown />}
					</div>
				</div>
			</div>
			{!isMinimized && (
				<div
					className={cns(styles["content"], {
						[styles["emptyContent"]]: isChatListEmpty,
					})}
				>
					{isChatListEmpty ? renderEmptyContainer() : renderChatList()}
				</div>
			)}
		</div>
	);
};

export default ChatListWindow;
