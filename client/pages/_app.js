import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Navbar from "../components/navbar";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Navbar currentUser={currentUser} />

      <Component currentUser={currentUser} {...pageProps} />
    </>
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
