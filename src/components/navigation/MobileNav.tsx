import { ROUTES } from "@/config/routes";

export default function MobileNav() {
  return (
    <nav>
      <ul>
        <li>{ROUTES.home}</li>
        <li>{ROUTES.login}</li>
        <li>{ROUTES.signup}</li>
      </ul>
    </nav>
  );
}
