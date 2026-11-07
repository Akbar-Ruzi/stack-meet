import posthog from "posthog-js"

const isDev = process.env.NODE_ENV === "development";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: '2025-05-24',
  capture_exceptions: !isDev, // This enables capturing exceptions using Error Tracking

  // In development PostHog stays loaded but sends nothing, so local testing doesn't
  // pollute analytics and ad blockers don't fill the console with blocked requests.
  // Test analytics with a production build (npm run build && npm start).
  ...(isDev && {
    opt_out_capturing_by_default: true,
    advanced_disable_flags: true,
    disable_session_recording: true,
    disable_surveys: true,
    disable_external_dependency_loading: true,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
  }),
});
