export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  upload: "/upload",
  invite: "/invite",
  join: "/join",
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof ROUTES;
