import React from 'react';
import Badge from './badge';

const Header = ({
  badgeContent,
  title,
  description,
}: {
  badgeContent: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="mb-2 flex flex-col items-center sm:mb-4">
      <Badge content={badgeContent} />
      <h1 className="mb-2 mt-4 bg-gradient-to-b from-custom-sage via-custom-teal to-custom-darkblue bg-clip-text text-center font-display text-3xl font-bold text-transparent dark:from-white dark:via-white dark:to-zinc-400 sm:text-5xl">
        {title}
      </h1>
      <p className="mb-4 text-center text-sm text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
};

export default Header;
