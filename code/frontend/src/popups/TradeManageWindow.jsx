import CardMini from "@components/CardMini";
import { updateItemByColumn } from "@database/items";
import { fetchTradeRequestCounts, fetchTradeRequests, removeTradeById } from "@database/trade"; // Assuming fetchTradeRequests is here
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider"; // Assuming you have an auth provider
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/TradeManageWindow.module.scss";
import cns from "@utils/classNames";
import { toastProps } from "@utils/toastProps";
import { useEffect, useRef, useState } from "react";
import { BsChatQuoteFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";
import { toast } from "react-toastify";

const TradeManageWindow = () => {
	const { currentUser } = useAuth();

	const tradeWindowRef = useRef();
	const sliderRef = useRef();

	const [activeTab, setActiveTab] = useState("RECEIVED");
	const [isLoading, setIsLoading] = useState(false);
	const [requestCounterBadge, setRequestCounterBadge] = useState({
		received: 0,
		sent: 0,
	});

	const [showBadges, setShowBadges] = useState(false);

	const [tradeRequests, setTradeRequests] = useState([]);

	const dispatch = useContextDispatch();

	const isTradeRequestsEmpty = tradeRequests.length === 0;

	const loadTradeRequests = async () => {
		if (!currentUser || !currentUser.id) return;

		setIsLoading(true);

		try {
			const requests = await fetchTradeRequests({
				userId: currentUser.id,
				type: activeTab,
			});

			setTradeRequests(requests);
		} catch (error) {
			console.error(`Error loading ${activeTab.toLowerCase()} trade requests:`, error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenTradeManageWindow = (bool) => {
		dispatch({
			type: "SET_TRADE_MANAGE_DISPLAYED",
			payload: bool,
		});
	};

	const handleChat = (e, request) => {
		e.preventDefault();

		dispatch({
			type: "SET_TRADE_MANAGE_DISPLAYED",
			payload: false,
		});

		setTimeout(() => {
			dispatch({
				type: "SET_CHAT_DISPLAYED",
				payload: true,
			});
		}, 10);
	};

	const handleAcceptOffer = (e, request) => {
		console.log(e);

		switch (activeTab) {
			case "RECEIVED":
				break;
			case "SENT":
				break;
			case "COMPLETED":
				break;
			default:
				break;
		}
	};

	const handleRejectOffer = async (e, request) => {
		if (!request) return;
		const { id: tradeId, trade_goal, trade_offers, trader } = request;

		const offeredItemIds = trade_offers.map((item) => item.id);

		// set "in_trade" to false to each OFFERED items when cancelling sent trade requests
		// this also works when rejecting received trades
		// FUTURE GOAL: send chat notification when rejecting offer!
		await Promise.all(
			offeredItemIds.map(async (itemId) => {
				const flaggedItemAsTraded = await updateItemByColumn({
					id: itemId,
					column: "in_trade",
					value: false,
				});

				if (!flaggedItemAsTraded) {
					throw new Error(`Error updating trade status for item ${itemId}`);
				}
			}),
		);

		const { error } = await removeTradeById({
			id: tradeId,
		});

		if (error) {
			throw new Error("Error removing trade from given id.", error);
		}

		switch (activeTab) {
			case "RECEIVED":
				// Straightforward: remove the row data from "Trade" table
				// If successful, render a toast to notify successful removal of received trade
				toast.success(`Successfully rejected trade offer from ${trader.name}!`, toastProps);

				break;
			case "SENT":
				// This will be followed by removing the row data from "Trade" table
				// If successful, render a toast to notify successful removal of sent trade
				toast.success(`Success. Previously sent trade has been cancelled!`, toastProps);

				break;
			case "COMPLETED":
				break;
			default:
				break;
		}

		await loadTradeRequests();
	};

	useEffect(() => {
		loadTradeRequests();
	}, [activeTab, currentUser]);

	// tabs
	useEffect(() => {
		if (!sliderRef.current) return;
		if (!tradeWindowRef.current) return;

		// Update slider position and width whenever the active tab changes
		const activeTab = tradeWindowRef.current.querySelector(`.${styles.activeTab}`);
		if (activeTab && sliderRef.current) {
			const { offsetLeft, offsetWidth } = activeTab;

			sliderRef.current.style.transform = `translateX(${offsetLeft}px) translateY(-50%)`; // Only include -50% for Y
			sliderRef.current.style.width = `${offsetWidth}px`;
		}
	}, [activeTab]);

	// badge counter
	useEffect(() => {
		const loadTradeRequestsCount = async () => {
			if (!currentUser || !currentUser.id) return;

			try {
				const requestCount = await fetchTradeRequestCounts({
					userId: currentUser.id,
					type: activeTab,
				});

				setRequestCounterBadge((prev) => {
					return {
						...prev,
						[activeTab.toLowerCase()]: requestCount.length || 0,
					};
				});
			} catch (error) {
				console.error(`Error loading ${activeTab.toLowerCase()} trade request counter:`, error);
			}
		};

		loadTradeRequestsCount();
	}, [activeTab, currentUser]);

	// badge counter initial
	useEffect(() => {
		const loadTradeRequestsCountInitial = async () => {
			if (!currentUser || !currentUser.id) return;

			try {
				const receivedRequests = await fetchTradeRequests({
					userId: currentUser.id,
					type: "RECEIVED",
				});

				const sentRequests = await fetchTradeRequests({
					userId: currentUser.id,
					type: "SENT",
				});

				setRequestCounterBadge({
					received: receivedRequests.length,
					sent: sentRequests.length,
				});
			} catch (error) {
				console.error(`Error loading ${activeTab.toLowerCase()} trade requests badges`, error);
			}
		};

		loadTradeRequestsCountInitial();
	}, []);

	const renderHeader = () => {
		return (
			<div className={styles["header"]}>
				<h1>Manage Trade Offers</h1>
				<div
					className={styles["closeButton"]}
					tabIndex={0}
					onClick={(e) => {
						e.preventDefault();
						handleOpenTradeManageWindow(false);
					}}
				>
					<IoClose
						tabIndex={0}
						style={{
							width: "100%",
							height: "100%",
						}}
					/>
				</div>
			</div>
		);
	};

	const renderBadgeCounter = (type) => {
		return (
			<div className={styles["tabItemBadge"]}>
				<span>{requestCounterBadge[type]}</span>
			</div>
		);
	};

	const renderTabs = () => {
		const tabsList = ["Received", "Sent", "Completed"];

		return (
			<div className={styles["tabContainer"]}>
				{tabsList.map((tab, tabIndex) => {
					return (
						<div
							key={tabIndex}
							className={cns(styles["tabItem"], {
								[styles["activeTab"]]: activeTab === tab.toUpperCase(),
							})}
							onClick={() => setActiveTab(tab.toUpperCase())}
						>
							<span>{tab}</span>
							{showBadges && renderBadgeCounter(tab.toLowerCase())}
						</div>
					);
				})}
				<div ref={sliderRef} className={styles["tabSlider"]} />
			</div>
		);
	};

	const renderButtons = (request) => {
		const buttonOpt = [
			{
				name: "chat",
				className: "chatButton",
				onClick: async (e) => {
					handleChat(e, request);
				},
				icon: () => {
					return <BsChatQuoteFill />;
				},
			},
			{
				name: "accept",
				className: "acceptButton",
				onClick: async (e) => {
					handleAcceptOffer(e, request);
				},
				icon: () => {
					return <LuCheck />;
				},
			},
			{
				name: "reject",
				className: "rejectButton",
				onClick: async (e) => {
					await handleRejectOffer(e, request);
				},
				icon: () => {
					return <IoClose />;
				},
			},
		];

		return (
			<div className={styles["tradeInfoButtons"]}>
				{buttonOpt.map((button, buttonIdx) => {
					return (
						<div key={buttonIdx} id={button.name} className={styles["tradeInfoButton"]} tabIndex={0} onClick={button.onClick}>
							<span>{button.icon()}</span>
						</div>
					);
				})}
			</div>
		);
	};

	const renderTradeRequestsIsLoading = () => {
		return (
			<div className={styles["tradeRequestPlaceholder"]}>
				<p>Loading...</p>
			</div>
		);
	};

	const renderTradeRequestsEmpty = () => {
		return (
			<div className={styles["tradeRequestEmpty"]}>
				<p>
					{activeTab === "RECEIVED" && <span>No trade requests found</span>}
					{activeTab === "SENT" && <span>No sent trade requests found</span>}
					{activeTab === "COMPLETED" && <span>You have not completed any trade offers</span>}
				</p>
			</div>
		);
	};

	const renderTradeRequests = () => {
		if (isLoading) {
			return renderTradeRequestsIsLoading();
		}

		if (isTradeRequestsEmpty) {
			return renderTradeRequestsEmpty();
		}

		return tradeRequests.map((request, index) => {
			return (
				<div key={index} className={styles["tradeRequestCard"]}>
					<div className={styles["tradeInfoFrom"]}>
						<h2>
							<p>
								{activeTab === "RECEIVED" ? (
									<>
										From <span>{request.trader?.name || "Unknown Trader"}</span>
									</>
								) : (
									<>
										To <span>{request.trader?.name || "Unknown Seller"}</span>
									</>
								)}
							</p>
						</h2>
						{activeTab !== "COMPLETED" && renderButtons(request)}
					</div>
					<div className={styles["tradeRequestCardInner"]}>
						<div className={styles["tradeItem"]}>
							<h2>{activeTab === "RECEIVED" ? "What they want" : "What you want"}</h2>
							{request.trade_goal && <CardMini item={request.trade_goal} isDefaultSelected={false} />}
						</div>
						<div className={styles["tradeItem"]}>
							<h2>{activeTab === "RECEIVED" ? "What they offer" : "What you offer"}</h2>
							<div className={styles["tradeOfferItems"]}>
								{request.trade_offers.map((item, itemIndex) => {
									return (
										<div key={itemIndex} className={styles["offeredItem"]}>
											<CardMini item={item} isDefaultSelected={false} />
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			);
		});
	};

	return (
		<Window dispatchType={"SET_TRADE_MANAGE_DISPLAYED"}>
			<div className={styles["tradeManageWindowContainer"]} ref={tradeWindowRef}>
				{renderHeader()}
				<div className={styles["inner"]}>
					{renderTabs()}
					<div
						className={cns(styles["innerContent"], {
							[styles["contentLoading"]]: isLoading,
							[styles["contentEmpty"]]: isTradeRequestsEmpty,
						})}
					>
						{renderTradeRequests()}
					</div>
				</div>
			</div>
		</Window>
	);
};

export default TradeManageWindow;
