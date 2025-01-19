import React from 'react';
import PinButton from '@/components/sidebar/PinButton';
import sidebarStyles from '@/components/sidebar/sidebar.module.css';
import LoadCVModels from '@/components/computerVision/ComputerVision';
type Props = {
  pinnedOpen: boolean;
  openManageBar: boolean;
  setPinnedOpen: (pinned: boolean) => void;
  onChange: (value: boolean) => void;
};

const ManageBar = ({ pinnedOpen, openManageBar, setPinnedOpen, onChange }: Props) => {
  const [openBar, setOpeBar] = React.useState(openManageBar);

  React.useEffect(() => {
    setOpeBar(openManageBar);
  }, [openManageBar]);

  return (
    <nav
      className={sidebarStyles.manage_bar}
      style={
        openBar
          ? { height: '2rem', transition: 'height 0.2s ease' }
          : { height: '0px', transition: 'height 0.5s ease' }
      }
      onMouseEnter={() => {
        setOpeBar(true);
        onChange(true);
      }}
    >
      <LoadCVModels />
      <PinButton pinned={pinnedOpen} setPinned={setPinnedOpen} />
    </nav>
  );
};

export default ManageBar;
