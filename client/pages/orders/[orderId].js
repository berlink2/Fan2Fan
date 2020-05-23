import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Link from "next/link";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderDetail = ({ order, currentUser }) => {
  const [timer, setTimer] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push("/orders");
    },
  });
  useEffect(() => {
    const calculateTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimer(Math.round(timeLeft / 1000));
    };
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timer < 0) {
    return (
      <div>
        <p>Sorry, your order has expired!</p>
        <p>
          <Link href={`/tickets/${order.ticket.id}`}>
            <a>Return to ticket</a>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      You have {timer} seconds to complete order.
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_RxlrJLRbNOZJ4z9Ui5YlqQ6S00TcgFn2ny"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderDetail.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    order: data,
  };
};

export default OrderDetail;
