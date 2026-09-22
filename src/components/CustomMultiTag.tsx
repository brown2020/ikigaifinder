import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomMultiTagProps {
  options: string[];
  placeholder: string;
  maxTags?: number;
  value?: string[];
  onChange: (value: string[]) => void;
  onOptionsChange?: (newOptions: string[]) => void;
}

const EMPTY_TAGS: string[] = [];

const CustomMultiTag: React.FC<CustomMultiTagProps> = ({
  options,
  placeholder,
  maxTags,
  value,
  onChange,
  onOptionsChange,
}) => {
  const selectedValues = value ?? EMPTY_TAGS;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [internalOptions, setInternalOptions] = useState(options);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => new Set(selectedValues), [selectedValues]);

  const filteredOptions = useMemo(
    () =>
      internalOptions.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [internalOptions, inputValue]
  );

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    if (!selected.has(tag) && (!maxTags || selectedValues.length < maxTags)) {
      onChange([...selectedValues, tag]);
      setInputValue("");
      if (!internalOptions.includes(tag)) {
        const newOptions = [...internalOptions, tag];
        setInternalOptions(newOptions);
        onOptionsChange?.(newOptions);
      }
    }
  };

  const removeTag = (tag: string) => {
    onChange(selectedValues.filter((t) => t !== tag));
  };

  const activateOption = (tag: string) => {
    addTag(tag);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="min-h-12 p-2 border rounded-md relative bg-white flex items-center gap-1 w-full">
        <div className="flex flex-wrap items-center gap-1 flex-1">
          {selectedValues.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-base font-medium px-3 py-0.5 rounded-full inline-flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800 leading-none"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="outline-none p-1 text-base font-semibold sm:max-w-max max-w-14"
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue) {
                e.preventDefault();
                addTag(inputValue);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            onFocus={() => setIsOpen(true)}
            aria-label={placeholder || "Add tags"}
          />
        </div>
        <button
          type="button"
          className={`mr-1 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-label={isOpen ? "Close options" : "Open options"}
          aria-expanded={isOpen}
          onClick={() => {
            setIsOpen((open) => !open);
            inputRef.current?.focus();
          }}
        >
          <ChevronDown className="min-w-5" aria-hidden="true" />
        </button>
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredOptions.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={selected.has(option)}
              tabIndex={0}
              className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${
                selected.has(option) ? "bg-blue-50" : ""
              }`}
              onClick={() => activateOption(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  activateOption(option);
                }
              }}
            >
              {option}
            </li>
          ))}
          {inputValue && !filteredOptions.includes(inputValue) && (
            <li
              role="option"
              aria-selected={false}
              tabIndex={0}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-blue-600"
              onClick={() => activateOption(inputValue)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  activateOption(inputValue);
                }
              }}
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
