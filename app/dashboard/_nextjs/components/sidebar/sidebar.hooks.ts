
import { useState, useEffect } from 'react';

const useIsSidebarExpanded = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
	  const saved = window.localStorage.getItem('sidebarExpanded');
	  if (saved !== null) {
        setIsSidebarExpanded(JSON.parse(saved));
	  }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
	  window.localStorage.setItem(
        'sidebarExpanded',
        JSON.stringify(isSidebarExpanded),
	  );
    }
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return { isSidebarExpanded, toggleSidebar };
};

export default useIsSidebarExpanded;
