import Link from "next/link";

export default ({ currentUser }) => {
  //Show links depending if user is signed in or not
  const links = [
    !currentUser && {
      label: "Sign in",
      href: "/auth/signin",
      btnClassName: "nav-link btn btn-outline-primary",
    },
    !currentUser && {
      label: "Sign up",
      href: "/auth/signup",
      btnClassName: "nav-link btn btn-primary",
    },
    currentUser && {
      label: "Sell Tickets",
      href: "/tickets/new",
      btnClassName: "nav-link btn btn-success",
    },
    currentUser && {
      label: "My Orders",
      href: "/orders",
      btnClassName: "nav-link btn btn-primary",
    },
    currentUser && {
      label: "Sign out",
      href: "/auth/signout",
      btnClassName: "nav-link btn btn-primary",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href, btnClassName }) => {
      return (
        <li className="nav-item mx-2" key={href}>
          <Link href={href}>
            <a className={btnClassName}>{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <div className="container">
      <nav className="navbar fixed-top navbar-dark bg-transparent">
        <Link href="/">
          <a className="navbar-brand mx-5">Fan2Fan</a>
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center mx-5">{links}</ul>
        </div>
      </nav>
    </div>
  );
};
