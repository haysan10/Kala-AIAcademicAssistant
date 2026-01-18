import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { cn } from '@/Lib/cn';

export default function Dropdown({
    trigger,
    items = [],
    align = 'right',
    width = 'w-48'
}) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button as="div" className="cursor-pointer">
                    {trigger || (
                        <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-white/50 transition-colors">
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>
                    )}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={cn(
                        "absolute z-50 mt-2 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-slate-100 dark:divide-white/5 overflow-hidden",
                        align === 'right' ? 'right-0' : 'left-0',
                        width
                    )}
                >
                    <div className="p-1">
                        {items.map((item, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <button
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                e.stopPropagation(); // Prevent accordion/item click
                                                item.onClick(e);
                                            }
                                        }}
                                        disabled={item.disabled}
                                        className={cn(
                                            "group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                                            active ? 'bg-slate-100 dark:bg-white/10' : '',
                                            item.danger
                                                ? (active ? 'text-red-600 dark:text-red-400' : 'text-red-500')
                                                : 'text-slate-700 dark:text-white/80',
                                            item.disabled && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={cn(
                                                    "h-4 w-4",
                                                    item.danger ? "text-red-500" : "text-slate-400 dark:text-white/40",
                                                    active && !item.danger && "text-kala-500 dark:text-white"
                                                )}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {item.label}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
