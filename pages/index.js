import Container from "./components/container";
import Header from "./components/header";

const index = () => (
  <div className="bg-gray-800 h-screen">
    <Header />

    <div className="flex p-2">
      <Container title="Active users" type={false} />
      <Container title="Blocked users" type={true} />
    </div>
  </div>
);

export default index;
