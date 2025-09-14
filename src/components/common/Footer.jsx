import { Typography } from "@material-tailwind/react";

// SVG Icon for LinkedIn
const LinkedInIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-1.2-2.5-2.5-2.5S11 12.85 11 14.25V19h-3v-9h3v1.39c.78-1.4 2.22-1.64 3.5-1.39 1.5.3 2.5 1.5 2.5 3v6z"></path>
  </svg>
);

// SVG Icon for GitHub
const GitHubIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"></path>
  </svg>
);


export default function FooterWithLogo() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-card border-t border-border p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Column: Personal Paragraph */}
                    <div className="text-center md:text-left">
                        <Typography as="a" href="/" className="font-bold text-xl md:text-2xl text-white">
                           HostelBuddy
                        </Typography>
                        <Typography color="gray" className="mt-4 max-w-md text-blue-gray-300">
                           This website was crafted with passion by RITIK KUMAR. You can follow his work on LinkedIn and GitHub to see more interesting projects. Stay connected for future updates and innovations!
                        </Typography>
                        <div className="flex justify-center md:justify-start gap-4 mt-6 text-blue-gray-300">
                            <a href="https://github.com/codeCraft-Ritik" target="_blank" rel="noopener noreferrer">
                                <GitHubIcon className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
                            </a>
                            <a href="https://www.linkedin.com/in/ritik-kumar-30828032a/" target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                    {/* Right Column: Navigation Links */}
                    <div className="grid grid-cols-2 justify-between gap-4">
                        <div className="text-center md:text-left">
                           <Typography color="white" className="font-semibold mb-3">Quick Links</Typography>
                           <ul className="space-y-2 text-slate-400">
                               <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Contribute</a></li>
                           </ul>
                        </div>
                        <div className="text-center md:text-left">
                           <Typography color="white" className="font-semibold mb-3">Resources</Typography>
                           <ul className="space-y-2 text-slate-400">
                               <li><a href="#" className="hover:text-white transition-colors">License</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                               <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                           </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-border pt-6 md:flex-row md:justify-between">
                    <Typography
                        variant="small"
                        className="mb-4 text-center font-normal text-slate-500 md:mb-0"
                    >
                        &copy; {currentYear} <a href="/" className="text-white">HostelBuddy</a>. All
                        Rights Reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    );
}