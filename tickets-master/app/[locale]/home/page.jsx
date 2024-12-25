// import Link from "next/navigation";
import TopHeader from "@/components/header/top-header";
import Header from "@/components/header";
import Hero from "@/components/hero"
import { MobileDateSearchCalendar } from "@/components/search-form/flights/DateSearch"
import { FlightsSearchProvider } from '@/components/search-form/flights/FlightsSearchProvider'
import TopCities from "@/components/slider/TopCities";
import CounterHome from "@/components/counter/CounterHome";
import RecommendedFlights from "@/components/flight/RecommendedFlights";
import TopDestinations from "@/components/destinations/TopDestinations";
// import Blog from "@/components/home/BlogHome";
import Locations from "@/components/locations";
// import CallToActions from "@/components/common/CallToActions";
import Footer from "@/components/footer";
import HelpfulFeedback from "@/components/common/HelpfulFeedback";
import ImpactVerification from '@/components/head/ImpactVerification';
import AppBanner from "@/components/banner/AppBanner";
import DomainList from "@/components/common/DomainList";
import SeoText from "@/components/seo/BigText";

const home = ({ t }) => {
  return (
    <>
      <ImpactVerification />
      <TopHeader t={t} />
      <Header marginTop="mt-30" />
      
      <FlightsSearchProvider>
        <MobileDateSearchCalendar />
        <Hero />
      </FlightsSearchProvider>

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  {t('home.top_destinations')}
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t('home.top_destinations_sub')}
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <div className="d-flex x-gap-5 items-center justify-center pt-40 sm:pt-20">
                <div className="col-auto">
                  <button className="d-flex items-center text-24 arrow-left-hover js-places-prev">
                    <i className="icon icon-arrow-left text-dark-1" />
                  </button>
                </div>
                {/* End prev */}

                <div className="col-auto">
                  <div className="pagination -dots text-border js-places-pag" />
                </div>
                {/* End pagination */}

                <div className="col-auto">
                  <button className="d-flex items-center text-24 arrow-right-hover js-places-next">
                    <i className="icon icon-arrow-right text-dark-1" />
                  </button>
                </div>
                {/* End Next */}
              </div>
            </div>
            {/* End .col for navigation and pagination */}
          </div>
          {/* End .row */}
          
          <TopCities />

        </div>
        {/* End .container */}
      </section>

      <CounterHome />
      
      <section className="layout-pt-sm layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t('home.flights_near_you')}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t('home.flights_near_you_sub')}
                </p>
              </div>
            </div>
            {/* End .col */}

            {/*<div className="col-auto">
              <Link
                href="/flights" target="_blank"
                rel="noopener noreferrer"
                className="button -md -blue-1 bg-dark-4 text-white"
              >
                More <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>*/}
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-20">
            <RecommendedFlights />
          </div>

          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Recommended Flights Section */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t('home.continent_destinations_title')}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t('home.continent_destinations_sub')}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-40 justify-between pt-40 sm:pt-20">
            <TopDestinations />
          </div>
          {/* End .row */}
        </div>
      </section>

      {/* <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h3 className="sectionTitle__title">
                  Latest Travel Tips and Trends
                </h3>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Stay informed about the hottest travel trends, insider insights, destination guides, and expert tips
                </p>
              </div>
            </div>
            <div className="col-auto">
              <Link
                href={`https://blog.ttm.org`} 
                target="_blank"
                rel="noopener noreferrer"
                className="button -md -dark-4 bg-blue-1-05 text-black"
              >
                Our Blog <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
          </div>

          <div className="row y-gap-30 pt-40">
            <Blog />
          </div>
        </div>
      </section> */}
      {/* End Blog Section */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t('home.cheap_destinations_title')}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t('home.cheap_destinations_sub')}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 pb-20">
            <Locations />
          </div>

          <div className="d-flex x-gap-10 items-center text-10 mt-10">
            <HelpfulFeedback id="3" />
          </div>

        </div>
      </section>

      <AppBanner />

      <SeoText tKey="home" />

      <section className="layout-pt-md">
        <div className="container">
          <DomainList />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default home
