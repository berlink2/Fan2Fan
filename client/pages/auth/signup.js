import { useState, useRef } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import styles from "../../components/style/signup.module.css";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwStrength, setPWStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  //Function for checking strength of password
  const checkPassword = (e) => {
    let password = e.target.value;
    if (!password) {
      setPWStrength("");
    }
    let validations = [
      password.length >= 8,
      password.search(/[A-Z]/) > -1,
      password.search(/[0-9]/) > -1,
      password.search(/[!$&+,:;=?@#]/) > -1,
    ];

    let strength = validations.reduce((acc, curr) => acc + curr);
    switch (strength) {
      case 1:
        setPWStrength("Very Weak");
        passwordRef.current.style.color = "red";
        break;
      case 2:
        setPWStrength("Weak");
        passwordRef.current.style.color = "orange";
        break;
      case 3:
        setPWStrength("Fairly Strong");
        passwordRef.current.style.color = "darkgoldenrod";
        break;
      case 4:
        setPWStrength("Strong");
        passwordRef.current.style.color = "green";
        break;
      default:
    }
    setPassword(password);
  };

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
    <div className="container-fluid my-5">
      <h2>Create your Fan2Fan account</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <input
            type="email"
            name="email"
            className={styles.input}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder=""
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
            onChange={checkPassword}
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
        Password strength:<span ref={passwordRef}> {pwStrength}</span>
        <ul>
          <li>must be at least 8 characters</li>
          <li>must contain a capital letter</li>
          <li>must contain a number</li>
          <li>must contain a special character</li>
        </ul>
        {errors}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
    // <form onSubmit={onSubmit}>
    //   <h1>Sign up</h1>
    //   <div className="form-group">
    //     <label>Email</label>
    //     <input
    //       value={email}
    //       type="email"
    //       placeholder="Enter email address"
    //       onChange={(e) => {
    //         setEmail(e.currentTarget.value);
    //       }}
    //       className="form-control"
    //     />
    //   </div>
    //   <div className="form-group">
    //     <label>Password</label>
    //     <input
    //       type="password"
    //       value={password}
    //       placeholder="Enter Password"
    //       onChange={(e) => {
    //         setPassword(e.currentTarget.value);
    //       }}
    //       className="form-control"
    //     />
    //   </div>

    //   {errors}

    //   <button className="btn btn-primary">Sign up</button>
    // </form>
  );
};
