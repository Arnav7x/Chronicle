import React from "react";
import { FaLinkedin, FaInstagram, FaFacebook, FaTelegram, FaXTwitter } from "react-icons/fa6";



const Footer = () => {
  return (
    <footer className="border-t mt-4 bg-white">
      <div className="max-w-6xl mx-auto py-6 px-4 text-center text-gray-500 text-sm">
        <div className="absolute left-5 flex space-x-5">
            <a href="/help" className="text-gray-700 dark:text-black-300 font-bold hover:underline">Help</a>
            <a href="/privacy" className="text-gray-700 dark:text-black-300 font-bold hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-gray-700 dark:text-black-300 font-bold hover:underline">Terms</a>
        </div>
        <p className="font-bold text-black-600 text-xl">Chronicle</p>
        <p className="text-black-500 mb-3 font-bold ">Sharing insights that matter.</p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-4 text-xl">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:opacity-80">
                    <FaLinkedin />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:opacity-80">
                    <FaInstagram />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80">
                    <FaFacebook />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-black dark:text-black hover:opacity-80">
                    <FaXTwitter />
                </a>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:opacity-80">
                    <FaTelegram />
                </a>
        </div>

        <p className="text-gray-600 dark:text-black-400 text-sm font-bold italic">© 2025 Chronicle. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;