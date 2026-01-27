import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function PayPalIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.773.773 0 0 1 .763-.642h6.127c2.541 0 4.338.67 5.337 1.993.9 1.195 1.095 2.668.575 4.504-.07.248-.147.486-.233.715a7.24 7.24 0 0 1-.371.841c-.82 1.582-2.168 2.594-3.898 2.93-.496.097-1.02.146-1.56.146H9.474a.773.773 0 0 0-.763.642l-.81 5.116a.641.641 0 0 1-.633.537l-.192-.165Z"
        fill="#003087"
      />
      <path
        d="M19.32 7.29c-.042.153-.09.309-.144.468-.87 2.625-2.843 3.97-5.866 3.97h-1.533a.773.773 0 0 0-.763.643l-.982 6.218a.557.557 0 0 0 .55.648h3.126a.678.678 0 0 0 .67-.563l.027-.143.53-3.354.034-.185a.678.678 0 0 1 .67-.563h.421c2.73 0 4.868-1.109 5.494-4.315.262-1.34.126-2.458-.567-3.245a2.697 2.697 0 0 0-.773-.579h.106Z"
        fill="#0070E0"
      />
      <path
        d="M18.336 6.872a5.5 5.5 0 0 0-.672-.149 8.49 8.49 0 0 0-1.348-.098h-4.09a.663.663 0 0 0-.656.563l-.87 5.511-.025.162a.773.773 0 0 1 .763-.643h1.586c3.023 0 5.039-1.228 5.686-4.778.02-.105.036-.208.05-.309a3.7 3.7 0 0 0-.424-.259Z"
        fill="#003087"
      />
    </svg>
  );
}

export function MpesaIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#4CAF50" />
      <path
        d="M8 12.5L10.5 15L16 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="8"
        textAnchor="middle"
        fill="white"
        fontSize="4"
        fontWeight="bold"
        fontFamily="Arial"
      >
        M
      </text>
    </svg>
  );
}

export function MpesaFullIcon({ className }: IconProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="w-8 h-8 rounded-full bg-mpesa flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
      </div>
      <span className="font-semibold text-mpesa">PESA</span>
    </div>
  );
}

export function PaystackIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" fill="#00C3F7" />
      <path
        d="M6 8h12M6 12h8M6 16h10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
