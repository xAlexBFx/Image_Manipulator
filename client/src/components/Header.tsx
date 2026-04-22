import { ThemeToggle } from './ThemeToggle';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from './ui/navigation-menu';

export function Header() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Image Black Box Logo" className="h-10 w-10 rounded-lg" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-100 bg-clip-text text-transparent">
              Image Black Box
            </h1>
            <p className="text-xs text-muted-foreground">What Does a Deep Learning Model See while Being Trained?</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuContent className="w-[95vw] md:w-[400px] lg:w-[500px]">
                  <ul className="grid gap-3 p-4 md:grid-cols-2">
                    <li className="row-span-3 col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-zinc-900 to-zinc-700 p-6 no-underline outline-none focus:shadow-md"
                          href="#"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Image Processing Web App
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover our full collection of image processing tools
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#"
                        >
                          <div className="text-sm font-medium leading-none">Image Resizer</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Resize your images to specific dimensions
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#"
                        >
                          <div className="text-sm font-medium leading-none">Filter Gallery</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Apply creative filters to your images
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li className="col-span-1">
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#"
                        >
                          <div className="text-sm font-medium leading-none">Image Converter</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Convert between different image formats
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={scrollToContact}
                  className={navigationMenuTriggerStyle()}
                >
                  Contact
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
