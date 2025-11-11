import { useState, useEffect, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { BiUser } from "react-icons/bi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = useCallback(
    (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen("");
      }
    },
    [dropdownOpen],
  );

  useEffect(() => {
    if (!isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside, isOpen]);

  const navigationItems = [
    {
      name: "Home",
    },
    {
      name: "Hotels",
      dropdownItems: [
        "Hotel name 1",
        "Hotel name 2",
        "Hotel name 3",
        "Hotel name 4",
        "Hotel name 5",
        "Hotel name 6",
        "Hotel name 7",
        "Hotel name 8",
        "Hotel name 10",
        "Hotel name 11",
        "Hotel name 12",
        "Hotel name 13",
        "Hotel name 14",
        "Hotel name 15",
      ],
    },
    {
      name: "Offers",
      dropdownItems: [
        "Offer 1",
        "Offer 2",
        "Offer 3",
        "Offer 4",
        "Offer 5",
        "Offer 6",
        "Offer 7",
        "Offer 8",
      ],
    },
    { name: "Contact" },
  ];

  const Dropdown = ({ items, name }) => (
    <div className="dropdown-container">
      <button
        className="font-sans font-semibold flex items-center space-x-1 px-4 py-2 rounded-md hover:opacity-[.7] transition-all duration-300"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(dropdownOpen === name ? "" : name);
        }}
        aria-expanded={dropdownOpen === name}
        aria-haspopup="true">
        <span>{name}</span>
        <FaChevronDown
          className={`transition-transform duration-300 ${
            dropdownOpen === name ? "rotate-180" : ""
          }`}
        />
      </button>
      {dropdownOpen === name && (
        <div
          className={`absolute top-full left-0 right-0 h-[40vh] w-screen z-99 rounded-b-3xl pt-10`}
          style={{
            background: "linear-gradient(to top, #2978b5, #004874 80%)",
          }}
          >
          <div
            className="py-4 container mx-auto  grid grid-rows-3 auto-cols-max gap-4"
            style={{ gridAutoFlow: "column" }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu">
            {items.map((item) => (
              <a
                key={item}
                href="#"
                className="font-sans block px-4 py-2 font-semibold text-md text-[#ffff] rounded-md hover:font-bold transition-colors duration-300"
                role="menuitem">
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );



  return (
    <header
      className="font-sans pb-1 text-[#ffff] mb-10 relative z-9"
      style={{ background: "linear-gradient(to bottom, #2978b5, #004874)",
        borderRadius: dropdownOpen ? 0 : "0 0 1rem 1rem"
      }}>
      <nav className="container mx-auto px-4 py-4 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="ayla logo" width={140} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.dropdownItems ? (
                  <Dropdown items={item.dropdownItems} name={item.name} />
                ) : (
                  <a
                    href="#"
                    className="font-sans font-semibold px-4 py-2 rounded-md hover:opacity-[.7] transition-all duration-300">
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:opacity-[.7] transition-all duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="md:hidden mt-4 space-y-2 absolute z-9 w-screen left-0 top-[65%] rounded-b-2xl pt-10 h-[calc(100vh-72px)] overflow-auto pb-[34px]"
            style={{
              background: "linear-gradient(to top, #2978b5, #004874 80%)",
            }}>
            {navigationItems.map((item) => (
              <div key={item.name} className="py-2">
                {item.dropdownItems ? (
                  <div className="space-y-2">
                    <button
                      className="flex items-center font-semibold justify-between w-full px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-300"
                      onClick={() =>
                        setDropdownOpen(
                          dropdownOpen === item.name ? "" : item.name,
                        )
                      }>
                      {item.name}
                      <FaChevronDown
                        className={`transition-transform duration-300 ${
                          dropdownOpen === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {dropdownOpen === item.name && (
                      <div className="pl-4 space-y-2">
                        {item.dropdownItems.map((subItem) => (
                          <a
                            key={subItem}
                            href="#"
                            className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">
                            {subItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="#"
                    className=" font-semibold block px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
