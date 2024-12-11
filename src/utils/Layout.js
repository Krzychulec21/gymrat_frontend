import { Route, Routes, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import React from "react";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import AuthPage from "../pages/AuthPage";
import OAuth2RedirectHandler from "../components/OAuth2RedirectHandler";
import FriendPage from "../pages/FriendPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import Footer from "../components/Footer";
import StatsPage from "../pages/StatsPage";
import TrainingPlansPage from "../pages/TrainingPlanPage";
import TrainingPlanDetails from "../components/trainingPlan/TrainingPlanDetails";
import TrainingPlanForm from "../components/trainingPlan/TrainingPlanForm";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import authService from "../service/authService";
import ChallengeDetailsPage from "../pages/ChallengeDetailsPage";
import ChallengePage from "../pages/ChallengePage";

function Layout() {
    const location = useLocation();
    const role = authService.getRole();
    const isAdmin = role === "ROLE_ADMIN";
    const showNavbar = !isAdmin && location.pathname !== "/auth";
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <>
                {showNavbar && <Navbar />}
                <Box
                    sx={{
                        flex: "1 0 auto",
                    }}
                >
                    <Routes>
                        {/* Public route */}
                        <Route element={<PublicRoute redirectPath="/profile" />}>
                            <Route path="/" element={<Home />} />
                        </Route>
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                        {/*admin only*/}
                        <Route element={<PrivateRoute adminOnly={true} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        </Route>

                        {/* private routes for userss */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/challenges" element={<ChallengePage/>} />
                            <Route path="/challenges/:id/details" element={<ChallengeDetailsPage/>} />
                            <Route path="/friends" element={<FriendPage />} />
                            <Route path="/profile/:userId?" element={<ProfilePage />} />
                            <Route path="/stats" element={<StatsPage />} />
                            <Route path="/plans" element={<TrainingPlansPage />} />
                            <Route path="/plans/:id" element={<TrainingPlanDetails />} />
                            <Route
                                path="/plans/new"
                                element={<TrainingPlanForm open={true} onClose={() => {}} isEditMode={false} />}
                            />
                        </Route>

                        {/* Error 404 */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>

                </Box>
                <Footer />
            </>
        </Box>
    );
}

export default Layout;
