import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const onBlur = () => {
    const priceFloat = parseFloat(price);

    if (isNaN(priceFloat)) {
      return;
    }

    setPrice(priceFloat.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create new ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Ticket Price (USD)</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Create Ticket</button>
      </form>
    </div>
  );
};

export default NewTicket;
