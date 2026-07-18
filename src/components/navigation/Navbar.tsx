import { ROUTES } from "@/config/routes";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>{ROUTES.home}</li>
        <li>{ROUTES.dashboard}</li>
        <li>{ROUTES.settings}</li>
      </ul>
    </nav>
  );
}
