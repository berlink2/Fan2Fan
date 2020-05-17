import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          type="email"
          placeholder="Enter email address"
          onChange={(e) => {
            setEmail(e.currentTarget.value);
          }}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          className="form-control"
        />
      </div>

      {errors}

      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};
