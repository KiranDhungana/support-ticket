import { useEffect, useState } from "react";
import TicketTable from "../../components/TicketTable";
import { getTickets } from "../../services/api";

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <div className="mt-[100px]">Loading tickets...</div>;
  if (error) return <div className="mt-[100px] text-red-500">{error}</div>;

  return (
    <>
      <div>
        <TicketTable isAdmin={false} data={tickets} refreshTickets={fetchTickets} />
      </div>
    </>
  );
};

export default UserTickets;
