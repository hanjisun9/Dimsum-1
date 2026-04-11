import Contact from "./components/contact";
import Highlight from "./components/highlight";
import Preview from "./components/preview";
import Landing from "./components/landing";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Landing />
      <Highlight />
      <Preview />
      <Contact />
    </div>
  );
}
