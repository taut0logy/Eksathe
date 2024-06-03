import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";

export default function UserPicker({ value, options, onSelect }) {
    const [selected, setSelected] = useState(value);
    const [search, setSearch] = useState("");
    const filteredOptions =
        search === ""
            ? options
            : options.filter((option) =>
                  option.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(search.toLowerCase().replace(/\s+/g, "")),
              );

    const onSelected = (options) => {
        setSelected(options);
        onSelect(options);
    };

    return (
        <>
            <Combobox value={selected} onChange={setSelected} multiple>
                <div className="relative mt-1">
                    <div
                        className="reIative w-full cursor-default overflow-hidden rounded-Ig
                                text-left shadow-md focus:outline-none focus-visible:ring-2
                                focus-visible:ring-white/75 focus-visible:ring-offset-2
                                focus-visible:ring-offset-teal-300 sm:text-sm"
                    >
                        <Combobox.Input
                            className={
                                "w-full rounded-lg bg-base-100 border-none py-2 pr-10 pl-3 text-sm/6 focus:ring-0 leading-5 border border-gray-200 focus:border-primary"
                            }
                            placeholder="Search users..."
                            // value={search}
                            displayValue={(value) =>
                                value.length
                                    ? `${value.length} users selected`
                                    : ``
                            }
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setSearch("")}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filteredOptions.length === 0 && search !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredOptions.map((person) => (
                                    <Combobox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 rounded ${
                                                active
                                                    ? "bg-accent text-gray-800"
                                                    : ""
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active
                                                                ? "text-white"
                                                                : "text-teal-600"
                                                        }`}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
            {
                selected && (
                    <div className="flex gap-2 mt-3">
                        {
                            selected.map((person) => (
                                <div key={person.id} className="badge badge-primary gap-2">
                                    <span>{person.name}</span>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    );
}
