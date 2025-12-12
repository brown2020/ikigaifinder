import HomePage from "./_components/home-page";
import FooterNavBar from "@/components/FooterNavBar";

export default function Home() {
  return (
    <>
      <HomePage />
      <div id="recent-article">
        <FooterNavBar />
      </div>
    </>
  );
}
