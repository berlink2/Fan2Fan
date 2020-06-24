import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import styles from "../../components/style/signin.module.css";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
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
    <div className="container-fluid my-5">
      <h1>Sign in</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <input
            type="email"
            name="email"
            className={styles.input}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder=""
            autoComplete="off"
          />
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
        </div>
        <div className={styles.field}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={styles.input}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder=""
          />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <span
            className={styles.togglePW}
            onClick={() => {
              setShowPassword(!showPassword);
              console.log(showPassword);
            }}
          >
            {showPassword ? "🙈" : "🐵"}
          </span>
        </div>
        {errors}
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
};
