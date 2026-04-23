import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer id="contact" className="mt-20 border-t border-white/10 bg-background/20 backdrop-blur-xl py-12">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>

          <div className="grid gap-8 items-center justify-items-center">
            <div className="flex flex-col items-center space-y-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src="https://avatars.githubusercontent.com/u/127577835?v=4" alt="Profile" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">Alex Betances</h3>
                <p className="text-muted-foreground">Software Developer</p>
              </div>
            </div>
            
            <div className="space-y-6 text-center max-w-2xl">
              <p className="text-lg">
                If you have ideas for demos (filters, kernels, or visualizations) that help explain what a computer vision model “pays attention to”,
                feel free to reach out.
              </p>
              
              <div className="flex justify-center pt-6">
                <Button
                  className="group relative overflow-hidden rounded-2xl px-12 py-6 text-xl font-semibold text-white transition-all duration-200 bg-gradient-to-b from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 border border-white/10 dark:border-zinc-300/40 shadow-[0_18px_0_rgba(0,0,0,0.35),0_26px_60px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 hover:shadow-[0_22px_0_rgba(0,0,0,0.32),0_30px_70px_rgba(0,0,0,0.28)] active:translate-y-[2px] active:shadow-[0_10px_0_rgba(0,0,0,0.32),0_18px_40px_rgba(0,0,0,0.22)]"
                  asChild
                >
                  <a href="https://betancesdev.netlify.app" target="_blank" rel="noopener noreferrer">
                    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
                      <span className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.28),transparent_45%),radial-gradient(circle_at_70%_85%,rgba(99,102,241,0.20),transparent_55%)]" />
                      <span className="absolute inset-x-0 top-0 h-[2px] bg-white/40 dark:bg-white/60" />
                      <span className="absolute inset-x-0 bottom-0 h-[10px] bg-black/25 dark:bg-black/10" />
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-140%] group-hover:translate-x-[140%] transition-transform duration-700" />
                    </span>

                    <span className="relative z-10 flex items-center justify-center tracking-tight">
                      See My Portfolio
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Image Black Box. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
