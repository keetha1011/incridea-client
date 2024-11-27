import { NextPage } from "next";
import { MdCall, MdLocationOn, MdMail } from "react-icons/md";

const Contact: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-300 to-primary-500 px-4 pt-32 text-white md:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className={`titleFont text-center text-4xl text-white md:text-5xl`}>
          Contact Us
        </h2>
        <h5 className="bodyFont mx-auto mt-5 max-w-7xl text-center text-base md:mt-7 md:text-xl">
          Any queries should be directed to the student organizers and college
          staff at the following contact information:
        </h5>
        <div className="bodyFont mx-auto mt-6 max-w-7xl rounded-sm bg-white/20 px-5 py-4 md:mt-8 md:px-10 md:py-7">
          <div className="flex items-center space-x-2 text-base font-semibold md:text-2xl">
            <MdMail />
            <a>Mail</a>
          </div>
          <p className="mt-2">
            <a
              href="mailto:incridea@nmamit.in"
              className="mt-2 hover:underline"
            >
              {" "}
              incridea@nmamit.in
            </a>
          </p>
          <div className="mt-5 flex items-center space-x-2 text-base font-semibold md:text-2xl">
            <MdCall />
            <a>Phone Numbers</a>
          </div>
          <p className="mt-2">
            Phone: +91{" "}
            <a href="tel:9448815186" className="hover:underline">
              94488 15186
            </a>{" "}
            or +91{" "}
            <a href="tel:96863 56123" className="hover:underline">
              96863 56123
            </a>
          </p>
          <div className="mt-5 flex items-center space-x-2 text-base font-semibold md:text-2xl">
            <MdLocationOn />
            <a>Address</a>
          </div>
          <p className="mt-2 flex flex-col gap-3">
            <div className="">
              <p>NMAM Institute of Technology,</p>
              <p>Nitte, Karkala Taluk, Udupi,</p>
              <p>Karnataka, India - 574110</p>
            </div>
            <div className="">
              <p>
                A unit of Nitte (Deemed to be University), Nitte Education Trust
              </p>
              <p>6th Floor, University Enclave,</p>
              <p>Medical Sciences Complex,</p>
              <p>Deralakatte, Mangaluru - 575018</p>
              <p>Karnataka, India</p>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
