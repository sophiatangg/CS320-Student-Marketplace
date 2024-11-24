import { useAuth } from "@providers/AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	const { currentUser, authLoading } = useAuth();

	if (authLoading) {
		return <div>Loading...</div>; // Show a loading state
	}

	if (!currentUser) {
		return <Navigate to="/login" />; // Redirect if not logged in
	}

	return children;
};

export default ProtectedRoute;
