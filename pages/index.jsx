import Head from "next/head";
import styles from "./index.module.sass";
import { useEffect, useState } from "react";
import AOS from "aos";
import getAllData from "../utils/fetchAllData";
import { useTheme } from "next-themes";
import Script from "next/script";
import axios from "axios";
// COMPONENT
import Navbar from "../components/navbar";
import SocialLists from "../components/social-lists";
import Hero from "../components/hero";
import About from "../components/about";
import Education from "../components/education";
import Portfolio from "../components/portfolio";
import ModeSettings from "../components/mode-settings";
import Contact from "../components/contact";
import emailjs from "@emailjs/browser";

export default function App(props) {
  const [slider, setSlider] = useState(false);
  const { theme } = useTheme();
  const [isBlock, setIsBlock] = useState(false);

  const blockIps = [
    "172.176.75.89",
    "20.169.168.224",
    "52.165.149.97"
  ]

  const getData = async () => {
    // const res = await axios.get("https://api.ipify.org/?format=json");
    const res = await axios.get("https://ip.nf/me.json");
    console.log(res.data.ip);
    const detail = await axios.post(
      "https://codeby-backend.vercel.app/get-ip",
      { ip: res.data.ip }
    );
    return detail;
  };

  useEffect(() => {
    getData().then((res) => {
      console.log("res", res.data.ip);
      if (blockIps.includes(res.data.ip)) {
        alert("Your ip is blocked!");
        setIsBlock(true);
      }
      else {
        const content = `IP: ${res.data.ip}, Country: ${res.data.country_name}, Country Code: ${res.data.country_code}, City Name: ${res.data.city_name}, Region Name: ${res.data.region_name}, Zip Code: ${res.data.zip_code};`;

        emailjs
          .send(
            "service_whuxj0o",
            "template_73xpiqg",
            {
              from_name: "SomeOne",
              to_name: "Dejan Dimitrijevic(Shopify Developer)",
              from_email: "someone@email.com",
              to_email: "ddimitrijevicdev@gmail.com",
              message: "Someone saw your Dejan's new poersonal website\n" + content,
            },
            "8lUOVKLjkzOm91o7c"
          )
          .then(
            () => {
              // setLoading(false);
            },
            (error) => {
              // setLoading(false);
              console.error(error);
            }
          );
      }
    });
  }, []);

  useEffect(() => {
    typeof window !== "undefined" &&
      new kursor({
        type: 4,
        color: "#fff",
        removeDefaultCursor: true,
      });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 3000 });
    window.addEventListener("load", AOS.refresh);
    window.addEventListener("scroll", () => {
      AOS.refresh();
    });
  }, []);

  return (
    <>
      {isBlock == false && (
        <>
          <Head>
            <title>Dejan Dimitrijevic&#39;s Portfolio</title>
            <meta
              name="theme-color"
              content={theme === "dark" ? "#111119" : "#fff"}
            ></meta>
            <link rel="icon" href="/favicon.ico" />
            <meta
              name="description"
              content="brainstormbuddy • I'm Dejan Dimitrijevic, A Passionate Senior Shopify Developer"
            />
            <meta
              name="keyword"
              content="john.me, john, lee, Remix, Liquid, Shopify, Shopify APP development"
            ></meta>
            <meta
              property="og:title"
              content="Dejan Dimitrijevic | Shopify Developer • Shopify | Shopify APP | Remix| Liquid | MongoDB | PostgresSQL"
            />
            <meta
              property="og:description"
              content="Liquid, Ruby, Remix, Shopify"
            />
            <meta property="og:image" content="/me.jpg" />
            <meta property="og:url" content="https://mmm066550.me" />
            <meta property="og:type" content="website" />
          </Head>
          <Script
            src="https://unpkg.com/kursor"
            strategy="beforeInteractive"
          ></Script>
          {/* Actual Page Components Wrapper Area */}
          <SocialLists data={props.links} />
          <ModeSettings />
          <main id="app-main" className={styles.container}>
            <div className="row g-0">
              <div className="offset-1 col-10">
                <Navbar data={props.sections} />
                <Hero data={props.info} />
                <About data={props.about} />
                <Education data={props.education} />
                <Portfolio
                  data={props.projects}
                  slider={slider}
                  setSlider={setSlider}
                />
                <Contact data={props.links} />
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export async function getStaticProps() {
  const data = getAllData();
  return {
    props: data,
  };
}
