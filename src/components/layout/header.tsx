// components/layout/header.tsx
import { Breadcrumbs } from './breadcrumbs';
// We will create and import UserProfile later
// import { UserProfile } from './user-profile';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 min-h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Breadcrumbs on the left */}
      <div className="flex items-center h-full">
        <Breadcrumbs />
      </div>

      {/* User Profile on the right */}
      <div className="flex items-center gap-4">
        {/* Placeholder for future components */}
        {/* <UserProfile /> */}
      </div>
    </header>
  );
}