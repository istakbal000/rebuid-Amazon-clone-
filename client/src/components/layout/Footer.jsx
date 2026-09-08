const Footer = () => {
  return (
    <footer className="mt-auto">
      {/* Back to top */}
      <div 
        className="bg-[#37475A] hover:bg-[#485769] text-white text-center py-3 text-sm cursor-pointer transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Main Footer Content */}
      <div className="bg-amazon-light text-white py-10 px-8">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3">Get to Know Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">About Amazon</a></li>
              <li><a href="#" className="hover:underline">Investor Relations</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Make Money with Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><a href="#" className="hover:underline">Sell products on Amazon</a></li>
              <li><a href="#" className="hover:underline">Sell on Amazon Business</a></li>
              <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Amazon Payment Products</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><a href="#" className="hover:underline">Amazon Business Card</a></li>
              <li><a href="#" className="hover:underline">Shop with Points</a></li>
              <li><a href="#" className="hover:underline">Reload Your Balance</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Let Us Help You</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Your Orders</a></li>
              <li><a href="#" className="hover:underline">Shipping Rates & Policies</a></li>
              <li><a href="#" className="hover:underline">Returns & Replacements</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-amazon-dark text-center py-8 text-white">
        <div className="flex items-center justify-center mb-4">
          <span className="text-2xl font-bold tracking-tighter mr-8">amazon<span className="text-amazon-orange text-xs">.clone</span></span>
        </div>
        <div className="text-xs text-gray-300 space-x-4">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Consumer Health Data Privacy Disclosure</a>
          <a href="#" className="hover:underline">Your Ads Privacy Choices</a>
        </div>
        <p className="text-xs text-gray-300 mt-2">© 1996-2026, Amazon.com, Inc. or its affiliates (Clone Project)</p>
      </div>
    </footer>
  );
};

export default Footer;
