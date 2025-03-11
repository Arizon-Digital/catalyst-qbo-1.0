import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed mb-[78px] mr-[27px] p-[12px] w-[55px] z-50 h-[55px] flex justify-center items-center bottom-4 right-4 bg-white text-black shadow-lg hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 !bg-opacity-100 border border-[#e0e1e4]"
          style={{ backgroundColor: 'white' }}
          aria-label="Scroll to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className="h-12 w-10"
          >
            <path 
              d="M4 15L12 7L20 15" 
              stroke="currentColor" 
              strokeWidth="3"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;