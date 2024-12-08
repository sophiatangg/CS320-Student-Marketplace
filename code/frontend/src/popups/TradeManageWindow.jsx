import CardMini from "@components/CardMini";
import { updateItemByColumn } from "@database/items";
import { fetchTradeRequestCounts, fetchTradeRequests, fetchTradeStatus, updateTradeByColumn, updateTradeStatus } from "@database/trade"; // Assuming fetchTradeRequests is here
import Window from "@popups/Window";
import { useAuth } from "@providers/AuthProvider"; // Assuming you have an auth provider
import { useContextDispatch } from "@providers/StoreProvider";
import styles from "@styles/TradeManageWindow.module.scss";
import cns from "@utils/classNames";
import { formattedDate } from "@utils/formatDate";
import { toastProps } from "@utils/toastProps";
import { useEffect, useRef, useState } from "react";
import { BsChatQuoteFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";
import { toast } from "react-toastify";

const TAB_LIST = ["Received", "Sent", "Completed", "Rejected"];

const TradeManageWindow = () => {
	const { currentUser } = useAuth();

	const tradeWindowRef = useRef();
	const sliderRef = useRef();

	const [activeTab, setActiveTab] = useState("RECEIVED");
	const [isLoading, setIsLoading] = useState(false);
	const [requestCounterBadge, setRequestCounterBadge] = useState({
		received: 0,
		sent: 0,
		completed: 0,
		rejected: 0,
	});

	const [showBadges, setShowBadges] = useState(true);

	const [tradeRequests, setTradeRequests] = useState([]);
	const [tradeRequestsStatus, setTradeRequestsStatus] = useState([]);

	const dispatch = useContextDispatch();

	const isTradeRequestsEmpty = tradeRequests.length === 0;

	const loadTradeRequests = async () => {
		if (!currentUser || !currentUser.id) return;

		setIsLoading(true);

		try {
			const requests = await fetchTradeRequests({
				userId: currentUser.id,
				type: activeTab.toUpperCase(),
			});

			if (!requests) throw new Error("Error fetching trade requests");

			// Fetch trade statuses in parallel
			const statuses = await Promise.all(
				requests.map(async (request) => {
					const { data: statusData, error } = await fetchTradeStatus({
						tradeId: request.id,
					});

					if (error) {
						console.error(`Error fetching trade status for trade ID ${request.id}:`, error);
						return {
							...statusData,
							status: "unknown",
						}; // Default to "unknown" on error
					}

					return statusData;
				}),
			);

			// Filter requests based on the active tab and status
			const filteredRequests = requests.filter((request) => {
				const statusObj = statuses.find((status) => status.trade_id === request.id);

				if (request.tradee.id == currentUser.id || request.trader.id === currentUser.id) {
					return true;
				}

				if (!statusObj) return false;

				const { status } = statusObj;
				if (activeTab === "RECEIVED" || activeTab === "SENT") {
					return status === "pending";
				} else if (activeTab === "COMPLETED") {
					return status === "completed";
				} else if (activeTab === "REJECTED") {
					return status === "rejected";
				}

				return false;
			});

			// Update state
			setTradeRequests(filteredRequests);
			setTradeRequestsStatus(statuses);
		} catch (error) {
			console.error(`Error loading ${activeTab.toLowerCase()} trade requests:`, error);
		} finally {
			setIsLoading(false);
		}
	};

	const loadTradeRequestsCount = async () => {
		if (!currentUser || !currentUser.id) return;

		try {
			// Fetch counts for all tabs in parallel
			const counts = await Promise.all(
				TAB_LIST.map(async (tab) => {
					const requestCount = await fetchTradeRequestCounts({
						userId: currentUser.id,
						type: tab.toUpperCase(),
					});

					return {
						tab: tab.toLowerCase(),
						count: requestCount || 0,
					};
				}),
			);

			// Update the counter badge state
			setRequestCounterBadge((prev) => {
				const updatedBadge = { ...prev };
				counts.forEach(({ tab, count }) => {
					updatedBadge[tab] = count;
				});

				return updatedBadge;
			});
		} catch (error) {
			console.error("Error loading trade request counters:", error);
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

	const handleAcceptOffer = async (e, request) => {
		if (!request) return;
		const { id: tradeId, status, trade_goal, trade_offers, tradee, trader } = request;

		const offeredItemIds = trade_offers.map((item) => item.id);

		// Rejecting a trade should set its trade status as "rejected"!
		const { data: tradeStatusData, error: tradeStatusError } = await updateTradeStatus({
			tradeId: tradeId,
			status: "completed",
		});

		if (tradeStatusError) {
			throw new Error(`Something unexpected happen with trade ${tradeId}:`, tradeStatusError);
		}

		switch (activeTab) {
			case "RECEIVED":
				// when accepting a trade, ALL items in a given trade (both the goal and offers)
				// will no longer be available to trade. Thus, "available" column in the "Item" table
				// should be set to FALSE.
				// In addition, ALL items in a given trade should have its "in_trade" status set to
				// TRUE, to indicate that ALL items are indeed in trade.
				// Following the two, the "completed" column in the "Trade" table
				// should also be set to TRUE, signifying that the trade has been officially accepted.
				// When successful, display alert message

				const allItemsWithinTrade = [...offeredItemIds, trade_goal.id];

				await Promise.all(
					allItemsWithinTrade.map(async (itemId) => {
						const flaggedItemAsUnavailable = await updateItemByColumn({
							id: itemId,
							column: "available",
							value: false,
						});

						if (!flaggedItemAsUnavailable) {
							throw new Error(`Error updating trade status for item ${itemId}`);
						}
					}),
				);

				await Promise.all(
					allItemsWithinTrade.map(async (itemId) => {
						const flaggedTradeGoalItemInTrade = await updateItemByColumn({
							id: itemId,
							column: "in_trade",
							value: true,
						});

						if (!flaggedTradeGoalItemInTrade) {
							throw new Error(`Error updating item ${trade_goal.id} for trade ${tradeId}`);
						}
					}),
				);

				const flaggedTradeAsCompleted = await updateTradeByColumn({
					id: tradeId,
					column: "completed",
					value: true,
				});

				if (!flaggedTradeAsCompleted) {
					throw new Error(`Error updating trade status for trade ${tradeId}`);
				}

				toast.success(`Successfully accepted trade offer from ${trader.name}!`, toastProps);

				break;
			case "SENT":
				// no operations: nothing should be here to ensure sent trades are only
				// done by receivers of trade.
				break;
			case "COMPLETED":
				// no operations: there is nothing to "accept"
				// when trade has already been completed.
				break;
			default:
				break;
		}

		// update trade items here
		await loadTradeRequests();
	};

	const handleRejectOffer = async (e, request) => {
		if (!request) return;
		const { id: tradeId, status, trade_goal, trade_offers, tradee, trader } = request;

		// Rejecting a trade should set its trade status as "rejected"!
		const { data: tradeStatusData, error: tradeStatusError } = await updateTradeStatus({
			tradeId: tradeId,
			status: "rejected",
		});

		if (tradeStatusError) {
			throw new Error(`Something unexpected happen with trade ${tradeId}:`, tradeStatusError);
		}

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
				// no operation here.
				break;
			default:
				break;
		}

		// update trade items here
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
		loadTradeRequestsCount();
	}, [activeTab, currentUser, tradeRequests, tradeRequestsStatus]);

	// badge counter initial
	useEffect(() => {
		loadTradeRequestsCount();
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
		return (
			<div className={styles["tabContainer"]}>
				{TAB_LIST.map((tab, tabIndex) => {
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

		// Conditionally filter the buttons!
		// 1. Filter out "accept" button if activeTab is "SENT"
		//    This is to ensure that the sent trades can only be accepted by the receiver!
		// 2. Only render the "chat" button for "REJECTED" and "COMPLETED" tab
		const filteredButtons = buttonOpt.filter((button) => {
			if (activeTab === "SENT") {
				return button.name !== "accept"; // Remove "accept" button for "SENT"
			} else if (activeTab === "REJECTED" || activeTab === "COMPLETED") {
				return button.name === "chat"; // Only include "accept" button for "REJECTED" or "COMPLETED"
			}
			return true; // Include all buttons for other tabs
		});

		return (
			<div className={styles["tradeInfoButtons"]}>
				{filteredButtons.map((button, buttonIdx) => {
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
		let message;

		switch (activeTab) {
			case "RECEIVED":
				message = "No trade requests found";
				break;
			case "SENT":
				message = "No sent trade requests found";
				break;
			case "COMPLETED":
				message = "You have not completed any trade offers";
				break;
			case "REJECTED":
				message = "You do not have rejected any trade offers";
				break;
			default:
				message = "";
				break;
		}

		return (
			<div className={styles["tradeRequestEmpty"]}>
				<p>{message}</p>
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
			const selectedStatusFromRequest = tradeRequestsStatus.find((req) => {
				return req.trade_id === request.id;
			});

			const formattedDateFromStatus = formattedDate(
				selectedStatusFromRequest.status === "pending" ? selectedStatusFromRequest.date_added : selectedStatusFromRequest.date_edited,
			);

			let footerMessage;
			let subTitleLeft;
			let subTitleRight;
			switch (selectedStatusFromRequest?.status) {
				case "pending":
					if (activeTab === "SENT") {
						subTitleLeft = "What you want";
						subTitleRight = "What you offer";
						footerMessage = `Trade offer sent at`;
					} else {
						subTitleLeft = "What they want";
						subTitleRight = "What they offer";
						footerMessage = `Trade received at`;
					}
					break;
				case "rejected":
					if (request.trader.id === currentUser.id) {
						subTitleLeft = "What you want";
						subTitleRight = "What you offer";
						footerMessage = `Trade cancelled at`;
					} else {
						subTitleLeft = "What they want";
						subTitleRight = "What they offer";
						footerMessage = `Trade rejected at`;
					}
					break;
				case "completed":
					footerMessage = `Trade accepted at`;
					if (request.tradee.id !== currentUser.id) {
						subTitleLeft = "What you want";
						subTitleRight = "What you offer";
					} else {
						subTitleLeft = "What they want";
						subTitleRight = "What they offer";
					}
					break;
				default:
					break;
			}

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
										To <span>{request.tradee?.name || "Unknown Seller"}</span>
									</>
								)}
							</p>
						</h2>
						{renderButtons(request)}
					</div>
					<div className={styles["tradeRequestCardInner"]}>
						<div className={styles["tradeItem"]}>
							<h2>{subTitleLeft}</h2>
							{request.trade_goal && <CardMini item={request.trade_goal} isDefaultSelected={false} />}
						</div>
						<div className={styles["tradeItem"]}>
							<h2>{subTitleRight}</h2>
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
					<div className={styles["tradeRequestCardFooter"]}>
						<span>
							{footerMessage} <b>{formattedDateFromStatus.date}</b> <b>{formattedDateFromStatus.time}</b>
						</span>
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
