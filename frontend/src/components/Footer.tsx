import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="container mx-auto pt-8">
      <div className="flex flex-col items-center justify-between border-t border-border p-6 md:flex-row md:p-8">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Clarifyr. All rights reserved.
        </p>
        <div className="mt-4 hidden flex-wrap items-center gap-6 md:mt-0 md:flex">
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
