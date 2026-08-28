import { SVGProps } from "react";

export function CMUKLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={props.className}
      {...props}
    >
      {/* Heart shape - single color version */}
      <path
        fill="currentColor"
        d="M50 88L14.7 52.7C4.4 42.4 4.4 25.6 14.7 15.3C25 5 41.8 5 52.1 15.3L50 17.4L47.9 15.3C37.6 5 20.8 5 10.5 15.3C0.2 25.6 0.2 42.4 10.5 52.7L50 92L89.5 52.7C99.8 42.4 99.8 25.6 89.5 15.3C79.2 5 62.4 5 52.1 15.3L50 17.4L47.9 15.3C41.6 9 33.2 5.8 24.8 5.8L50 31Z"
      />
      {/* Fork lines inside heart */}
      <path
        fill="currentColor"
        d="M38 60 L38 40 L42 40 L42 60 Z M46 60 L46 40 L50 40 L50 60 Z M54 60 L54 40 L58 40 L58 60 Z M62 60 L62 40 L66 40 L66 60 Z M38 65 L66 65 L66 69 L38 69 Z"
      />
    </svg>
  );
}
