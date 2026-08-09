import { useState, useEffect } from "react";
import { demoBookingAPI } from "../../services/api";

export default function DemoBookings({ salesRepId = null }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [salesRepId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data = await demoBookingAPI.getAll();

      // ✅ Filter in frontend only
      const filtered = salesRepId
        ? data.filter((b) => b.sales_rep_id === salesRepId)
        : data;

      setBookings(filtered);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading demo bookings...</p>;
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>📅 Scheduled Demos</h2>

      {bookings.length === 0 ? (
        <p>No demo bookings scheduled.</p>
      ) : (
        <table className="company-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.company_name}</td>
                <td>{booking.meeting_date}</td>
                <td>{booking.meeting_time}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}