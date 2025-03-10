import { SignIn } from '@clerk/nextjs';
import { customAppearance } from '../../../../../constants';
export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignIn appearance={customAppearance} />
    </div>
  );
}
