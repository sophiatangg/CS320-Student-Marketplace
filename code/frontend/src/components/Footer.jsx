import Instagram from "@media/image/instagram.png";
import Twitter from "@media/image/twitter.png";
import styles from "@styles/Footer.module.scss";
import cns from "@utils/classNames";
import { PiStudentBold } from "react-icons/pi";

const Footer = (props) => {
	const {} = props;

	return (
		<div className={styles["footer"]}>
			<div className={styles["footerTop"]}>
				<div>
					<PiStudentBold className={styles["logo"]} />
				</div>
			</div>
			<div className={styles["sections"]}>
				<div className={cns(styles["section"])}>
					<h3 className={styles["first"]}>Company</h3>
					<h3>About</h3>
					<h3>Press Center</h3>
					<h3>Careers</h3>
				</div>
				<div className={cns(styles["section"])}>
					<h3 className={styles["first"]}>Resources</h3>
					<h3>Help Center</h3>
					<h3>Contact</h3>
				</div>
				<div className={cns(styles["section"])}>
					<h3 className={styles["first"]}>Product Help</h3>
					<h3>Support</h3>
					<h3>File a Bug</h3>
				</div>
			</div>
			<div className={styles["footerInfo"]}>
				<div className={styles["infoLeft"]}>
					<p>This page was built with React.</p>
					<p>&copy; 2024 - Current</p>
				</div>
				<div className={styles["infoRight"]}></div>
			</div>
			<div className={styles["footerEnd"]}>
				<div className={styles["endLeft"]}>
					<h4>Privacy</h4>
					<h4>Security</h4>
					<h4>Cookies</h4>
					<h4>Legal</h4>
					<h4>Collaborative Guidelines</h4>
				</div>

				<div className={styles["endRight"]}>
					<img className={styles["social"]} src={`${Twitter}`} alt="Twitter Logo" />
					<img className={styles["social"]} src={`${Instagram}`} alt="Instagram Logo" />
				</div>
			</div>
		</div>
	);
};

export default Footer;
