import React from 'react';
import { RightSidebarProps } from './rightSidebar.types';

const RightSidebar = ({ user, transactions, banks } : RightSidebarProps) => {
  return (
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-8'>
        <div className='profile-banner'>
          <div className='profile'>
            <div className='profile-img'>
              <span className='text-5xm font-bold text-primary-500'>
                {user.firstName[0]}
              </span>
            </div>
            <div className='profile-details'>
              <h1 className='profile-name'>
                {user.firstName} {user.lastName}
			  </h1>
			  <p className='profile-email'>{user.email}</p>

            </div>

          </div>

        </div>

      </section>
    </aside>
  );
};

export default RightSidebar;
