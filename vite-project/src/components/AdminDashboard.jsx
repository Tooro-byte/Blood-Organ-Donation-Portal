import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/donations", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:3000/api/donations/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const res = await axios.get("http://localhost:3000/api/donations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d._id}>
              <td>{d.userId.email}</td>
              <td>{d.type}</td>
              <td>{d.details}</td>
              <td>{d.status}</td>
              <td>
                <button
                  onClick={() => updateStatus(d._id, "approved")}
                  className="bg-green-500 text-white px-2 py-1 mr-1"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(d._id, "rejected")}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
