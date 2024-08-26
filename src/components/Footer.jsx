import React from "react";
import { FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white w-full flex flex-col items-center justify-center p-4 mt-auto">
      <div className="font-poppins flex flex-row text-sm">
        <div className="flex">© 2024 Apartment Inc.</div>&nbsp;
        <div className="hidden sm:flex">
          User contributions licensed under CC BY-SA.
        </div>
      </div>
      <div className="font-poppins flex flex-row text-sm mt-2">
        <div className="flex">Contact us:</div>&nbsp;
        <div className="flex ml-2">
          <a
            href="https://www.facebook.com/profile.php?id=100012729762312"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="mr-1" /> Facebook
          </a>
        </div>
        &nbsp;|&nbsp;
        <div className="flex ml-2">
          <a href="tel:+1234567890">
            <FaPhone className="mr-1" /> Phone: +84 0938359708
          </a>
        </div>
        &nbsp;|&nbsp;
        <div className="flex ml-2">
          <a href="mailto:phucnguyenba217@gmail.com">
            <FaEnvelope className="mr-1" /> Gmail: phucnguyenba217@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
