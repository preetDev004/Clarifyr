import React from 'react';

const BotCardHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-medium sm:text-xl">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default BotCardHeader;
