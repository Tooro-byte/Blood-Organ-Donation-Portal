import { useState, useEffect } from "react";
import axios from "axios";

function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [type, setType] = useState("blood");
  const [details, setDetails] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/donations",
        { type, details },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchDonations();
      setDetails("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit donation");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Donor Dashboard</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mr-2 p-2 border"
        >
          <option value="blood">Blood</option>
          <option value="organ">Organ</option>
        </select>
        <input
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Details (e.g., Blood Type or Organ)"
          className="mr-2 p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit Donation
        </button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d._id}>
              <td>{d.type}</td>
              <td>{d.details}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DonorDashboard;
