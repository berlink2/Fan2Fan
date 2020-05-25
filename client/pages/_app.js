import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Navbar from "../components/navbar";
<script
  src="https://kit.fontawesome.com/6b38a7ee17.js"
  crossorigin="anonymous"
></script>;
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Navbar currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { pageProps, ...data };
};

export default AppComponent;
