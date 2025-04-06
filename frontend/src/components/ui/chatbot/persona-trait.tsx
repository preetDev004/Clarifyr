'use client';
import React from 'react';
import { Switch } from './switch';

const CustomSwitch = ({
  title,
  description,
  isSelected,
  onToggle,
}: {
  title: string;
  description: string;
  isSelected: boolean;
  onToggle: (isSelected: boolean) => void;
}) => {
  return (
    <div className="rounded-lg bg-primary/5 p-4 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="space-y-1">
            <label htmlFor={`trait-${title}`} className="text-base font-medium">
              {title}
            </label>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Switch
          id={`trait-${title}`}
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default CustomSwitch;
