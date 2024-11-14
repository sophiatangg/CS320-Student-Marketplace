import { useContextDispatch, useContextSelector } from "@providers/StoreProvider";
import styles from "@styles/Sidebar.module.scss";
import cns from "@utils/classNames";
import { useState } from "react";
import { BiSolidFridge, BiSolidShoppingBags } from "react-icons/bi";
import { BsBagPlusFill } from "react-icons/bs";
import { GiLaptop, GiPoloShirt } from "react-icons/gi";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { SiMicrosoftacademic, SiWish } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = (props) => {
	const { allItems } = useContextSelector("itemsStore");
	const dispatch = useContextDispatch();

	const navigate = useNavigate();
	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const categoryName = params.get("cat") || "";

	const uniqueCategoriesFromList = [...new Set(allItems.map((item) => item.category))]
		.map((category) => category.charAt(0).toUpperCase() + category.slice(1))
		.sort();

	const categoryList = ["All", "My Items", "Wishlist", ...uniqueCategoriesFromList];

	const [hoverStates, setHoverStates] = useState(Array(categoryList.length).fill(false));

	const handleItemHover = (index, isHover) => {
		setHoverStates((prev) => {
			return prev.map((hover, i) => {
				return i === index ? isHover : hover;
			});
		});
	};

	const handleCategorySelect = ({ id, name }) => {
		navigate(`/browse?cat=${name.toLowerCase().replace(" ", "-")}`);
	};

	const renderFilterSVG = (filterName, isHover) => {
		const style = { width: 30, height: 30, fill: isHover ? "#000000" : "#fff" };

		const className = styles["filterSVG"];

		switch (filterName) {
			case "My Items":
				return <BsBagPlusFill className={className} style={style} />;
			case "Wishlist":
				return <SiWish className={className} style={style} />;
			case "All":
				return <BiSolidShoppingBags className={className} style={style} />;
			case "Academic":
				return <SiMicrosoftacademic className={className} style={style} />;
			case "Apparel":
				return <GiPoloShirt className={className} style={style} />;
			case "Appliance":
			case "Appliances":
				return <BiSolidFridge className={className} style={style} />;
			case "Other":
			case "Others":
			case "Misc":
				return <RiShoppingBag3Fill className={className} style={style} />;
			case "Tech":
				return <GiLaptop className={className} style={style} />;
			default:
				return <div className={className} style={style} />;
		}
	};

	const renderList = ({ start, end }) => {
		const list = end ? categoryList.slice(start, end) : categoryList.slice(start);

		return list.map((category, categoryIndex) => {
			const currentIndex = start + categoryIndex;
			const isSelected = category.toLowerCase().replace(" ", "-") === categoryName;

			return (
				<div
					key={currentIndex}
					id={currentIndex}
					className={cns(styles["filterDiv"], {
						[styles["selected"]]: isSelected,
					})}
					onMouseEnter={() => {
						handleItemHover(currentIndex, true);
					}}
					onMouseLeave={() => {
						handleItemHover(currentIndex, false);
					}}
					onClick={(e) => {
						handleCategorySelect({
							id: currentIndex,
							name: category,
						});
					}}
				>
					<button className={styles["filterBtn"]} style={{ backgroundColor: hoverStates[currentIndex] || isSelected ? "#fff" : "#2d2d2d" }}>
						{renderFilterSVG(category, hoverStates[currentIndex])}
					</button>
					{category}
				</div>
			);
		});
	};

	return (
		<div className={styles["filters"]}>
			<div className={styles["globalFilters"]}>{renderList({ start: 0, end: 3 })}</div>

			<div className={styles["categoryFilters"]}>
				<h2>Categories</h2>
				{renderList({ start: 3 })}
			</div>
		</div>
	);
};

export default Sidebar;
