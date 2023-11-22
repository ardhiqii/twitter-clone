import Link from "next/link";
import React, { FC } from "react";

const TopNavLink: FC<TopNavLinkProps> = ({title="Tweet",url='/'}) => {
  return (
    <Link href={url}>
      <div className="flex gap-3 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>
        <span>{title}</span>
      </div>
    </Link>
  );
};

export default TopNavLink;

interface TopNavLinkProps{
  title?: string,
  url?: string
}