import React, { useState, useRef, useEffect } from 'react';

function Dropdown({ options, value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {options.map((option) => (
            <a
              key={option}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
