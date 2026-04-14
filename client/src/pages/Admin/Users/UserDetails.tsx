import { adminUsers } from "../adminData";

const UserDetails = () => {
  const user = adminUsers[0];

  return (
    <section>
      <h2>User Details</h2>
      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h3>{user.fullName}</h3>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Total Orders: {user.orders}</p>
      </div>
    </section>
  );
};

export default UserDetails;

