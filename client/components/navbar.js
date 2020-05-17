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
      label: "Sign out",
      href: "/auth/signout",
      btnClassName: "nav-link btn btn-primary",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href, btnClassName }) => {
      return (
        <li className="nav-item mx-1" key={href}>
          <Link href={href}>
            <a className={btnClassName}>{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Fan2Fan</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
