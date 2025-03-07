import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          //   card: "bg-white shadow-md rounded-lg",
          //   headerSubtitle: "hidden", // Hide the default subtitle if you don't want it
          //   logoBox: "mx-auto mb-4", // Center the logo and add margin
          formButtonPrimary: 'bg-slate-700 hover:bg-slate-800', // Customize button color
        },
      }}
    />
  );
}
