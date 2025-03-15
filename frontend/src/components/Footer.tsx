import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="container mx-auto pt-8">
      <div className="p-6 md:p-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Clarifyr. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 hidden md:flex flex-wrap items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer