import React from 'react';
import { getCurrentUser } from '@/app/(auth)/_lib/currentUser';
import { Button } from '@/components/ui/button';

const Account = async () => {

  const loggedInUser = await getCurrentUser({ withFullUser: true });

  if (!loggedInUser) return;

  return (
    <section>
      <div className="relative rounded-t-lg overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary-300 to-primary-200"></div>
        <div className="px-8 pb-8">
          <div className="flex items-start gap-6 -mt-8 relative z-10">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-2xl font-bold text-white">
                {loggedInUser.firstName[0]}
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-8">
              <div className="flex items-center justify-between">
                <div className='flex flex-col'>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {loggedInUser.firstName} {loggedInUser.lastName}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{loggedInUser.email}</p>
                </div>

                <Button>
				  Edit Profile
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Account;
