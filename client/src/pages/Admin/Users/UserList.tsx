import DataTable from "../../../components/admin/DataTable";
import { useAdminUsers } from "../../../features/admin/useAdminUsers";

const UserList = () => {
  const { users, loading, error } = useAdminUsers();

  return (
    <section>
      <h2>Users</h2>
      <p>View users and role allocations.</p>
      {error ? <div className="admin-empty">{error}</div> : null}
      {loading ? <div className="admin-empty">Loading users...</div> : null}
      <DataTable
        rows={users}
        columns={[
          { key: "id", header: "User ID" },
          { key: "full_name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role" },
          { key: "phone", header: "Phone" },
        ]}
      />
    </section>
  );
};

export default UserList;

