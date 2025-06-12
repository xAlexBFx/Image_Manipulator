import { ThemeToggle } from './ThemeToggle';
import { Sparkles } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from './ui/navigation-menu';

export function Header() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 blur-lg opacity-30 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ImageMagic
            </h1>
            <p className="text-xs text-muted-foreground">Free Image Processing Tool</p>
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
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-purple-600 p-6 no-underline outline-none focus:shadow-md"
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
