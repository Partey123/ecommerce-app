import DataTable from "../../../components/admin/DataTable";
import { adminUsers } from "../adminData";

const UserList = () => {
  return (
    <section>
      <h2>Users</h2>
      <p>View users and role allocations.</p>
      <DataTable
        rows={adminUsers}
        columns={[
          { key: "id", header: "User ID" },
          { key: "fullName", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role" },
          { key: "orders", header: "Orders" },
        ]}
      />
    </section>
  );
};

export default UserList;

