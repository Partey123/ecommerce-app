import { Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../features/auth/useAuth";
import "./Profile.css";

const Profile = () => {
  const { user, isLoading } = useAuth();

  const profile = useMemo(() => {
    if (!user) return null;
    const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();
    const fallbackName = user.email?.split("@")[0] ?? "User";
    const displayName = fullName && fullName.length > 0 ? fullName : fallbackName;
    const role =
      (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined) ??
      "user";

    return {
      displayName,
      email: user.email ?? "No email",
      role,
      joinedOn: new Date(user.created_at).toLocaleDateString(),
    };
  }, [user]);

  if (isLoading) {
    return <main className="profile-page">Loading profile...</main>;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <p className="profile-kicker">Account</p>
        <h1>My Profile</h1>
        <p>Manage your account details and access your personalized area.</p>

        <div className="profile-grid">
          <article>
            <span>Full Name</span>
            <strong>{profile?.displayName}</strong>
          </article>
          <article>
            <span>Email</span>
            <strong>{profile?.email}</strong>
          </article>
          <article>
            <span>Role</span>
            <strong>{profile?.role}</strong>
          </article>
          <article>
            <span>Joined</span>
            <strong>{profile?.joinedOn}</strong>
          </article>
        </div>

        <div className="profile-actions">
          <Link to="/shop" className="profile-btn profile-btn-secondary">
            Back to Shop
          </Link>
          {profile?.role === "admin" ? (
            <Link to="/admin" className="profile-btn profile-btn-primary">
              Open Admin Dashboard
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default Profile;
