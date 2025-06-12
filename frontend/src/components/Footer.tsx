import { Github, Linkedin, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer id="contact" className="bg-muted/50 py-12 mt-20">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>

          <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-center">
            <div className="flex flex-col items-center md:items-start space-y-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src="https://avatars.githubusercontent.com/u/127577835?v=4" alt="Profile" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold">Alex Betances</h3>
                <p className="text-muted-foreground">Software Developer</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg">
                I'm passionate about creating tools that help people solve real problems. 
                Feel free to reach out if you have any questions, suggestions, 
                or just want to say hello!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://github.com/xAlexBFx" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://www.linkedin.com/in/alex-betances-1435b6361/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="mailto:alexbetancesx@gmail.com">
                    <Mail className="h-5 w-5" />
                    <span>Email</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ImageMagic. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
