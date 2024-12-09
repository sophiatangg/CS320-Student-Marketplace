import DissolveFilter from "@components/DissolveFilter";
import ScrollPageToTop from "@components/ScrollPageToTop";
import "@media/fonts/walsheim/GTWalsheimPro-Bold.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Light.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Medium.ttf";
import "@media/fonts/walsheim/GTWalsheimPro-Regular.ttf";
import { AuthProvider } from "@providers/AuthProvider";
import { StoreProvider } from "@providers/StoreProvider";
import "@styles/_.scss";
import { createRoot } from "react-dom/client";
import "react-perfect-scrollbar/dist/css/styles.css";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

const elem = document.getElementById("root");
const root = createRoot(elem);

root.render(
	<>
		<StoreProvider>
			<BrowserRouter>
				<AuthProvider>
					<ScrollPageToTop />
					<App />
				</AuthProvider>
			</BrowserRouter>
		</StoreProvider>
		<DissolveFilter />
	</>,
);
