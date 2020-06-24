import Link from "next/link";
import styles from "../components/style/landingpage.module.css";
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>$ {ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>details</a>
          </Link>
        </td>
      </tr>
    );
  });

  const jumboStyle = {
    backgroundImage:
      "url(" + "https://source.unsplash.com/Qq2h76kYRFI/1600x900" + ")",
    height: "100vh",
    width: "100%",
    backgroundSize: "cover",
  };

  return (
    <>
      <div className="row position-relative py-0">
        <div className="jumbotron-fluid d-flex text-white" style={jumboStyle}>
          <div style={{ margin: "auto" }}>
            <h1>
              <strong>E-Tickets from Fans to Fans</strong>
            </h1>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <h1>Available Tickets For Sale</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{ticketList}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
