import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { useAuth } from "../../context/AuthContext";
import { fullName } from "../../utils/format";

const people = [
  { id: 1, first_name: "Maya", last_name: "Chen", email: "maya.chen@school.edu", role: "lecturer", department: "Computer Science" },
  { id: 2, first_name: "Andre", last_name: "Williams", email: "andre.williams@school.edu", role: "lecturer", department: "Information Systems" },
  { id: 3, first_name: "Talia", last_name: "Brown", email: "talia.brown@school.edu", role: "student", department: "Computer Science" },
  { id: 4, first_name: "Noah", last_name: "Singh", email: "noah.singh@school.edu", role: "student", department: "Software Engineering" }
];

export default function MembersPage() {
  const { role } = useAuth();

  return (
    <Card>
      <CardHeader title="Members" description={`${role === "admin" ? "System-wide" : "Course"} roster overview with role-aware visibility.`} />
      <CardBody>
        <Table
          rows={people}
          getKey={(row) => row.id}
          columns={[
            { key: "name", header: "Name", render: fullName },
            { key: "email", header: "Email" },
            { key: "role", header: "Role", render: (row) => <span className="capitalize">{row.role}</span> },
            { key: "department", header: "Department / Major" }
          ]}
        />
      </CardBody>
    </Card>
  );
}
