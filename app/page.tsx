/**
 * Root landing page.
 *
 * The default landing UI lives in @/components/landing-default.
 * To replace it with your own:
 *   1. Delete (or keep) the `components/landing-default/` folder.
 *   2. Replace the import below with your own component.
 *   3. That's it — no other files need to change.
 */
import { LandingPage } from "@/components/landing-default";

export default function HomePage() {
  return <LandingPage />;
}
