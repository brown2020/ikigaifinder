import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface CustomMultiTagProps {
  options: string[];
  placeholder: string;
  maxTags?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onOptionsChange?: (newOptions: string[]) => void;
}

const CustomMultiTag: React.FC<CustomMultiTagProps> = ({
  options,
  placeholder,
  maxTags,
  value = [],
  onChange,
  onOptionsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [internalOptions, setInternalOptions] = useState(options);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(
      internalOptions.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [internalOptions, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (tag: string) => {
    if (!value.includes(tag) && (!maxTags || value.length < maxTags)) {
      const newValue = [...value, tag];
      onChange(newValue);
      setInputValue("");

      if (!internalOptions.includes(tag)) {
        const newOptions = [...internalOptions, tag];
        setInternalOptions(newOptions);
        onOptionsChange?.(newOptions);
      }
    }
  };

  const removeTag = (tag: string) => {
    const newValue = value.filter((t) => t !== tag);
    onChange(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="min-h-12 p-2 border rounded-md relative bg-white flex items-center gap-1 cursor-text"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap items-center gap-1">
          {value.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-base font-medium px-3 py-0.5 rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="ml-1 text-blue-600 hover:text-blue-800 leading-none flex items-center"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="outline-none p-1 text-base font-semibold sm:max-w-max max-w-14"
          placeholder={value.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <div
          className={`mr-2 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          } absolute right-0`}
        >
          <ChevronDown className="min-w-5" />
        </div>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${
                value.includes(option) ? "bg-blue-50" : ""
              }`}
              onClick={() => addTag(option)}
            >
              {option}
            </li>
          ))}
          {inputValue && !filteredOptions.includes(inputValue) && (
            <li
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-blue-600"
              onClick={() => addTag(inputValue)}
            >
              Create {inputValue}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomMultiTag;
