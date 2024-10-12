import React from "react";
import PinButton from "@/components/sidebar/pinButton";
import sidebarStyles from "@/components/sidebar/sidebar.module.css";
import LoadCVModels from "@/components/computerVision/computerVision";
type Props = {
  pinnedOpen: boolean;
  setPinnedOpen: (pinned: boolean) => void;
};

const ManageBar = ({ pinnedOpen, setPinnedOpen }: Props) => {
  return (
    <nav className={sidebarStyles.manage_bar}>
      <LoadCVModels />
      <PinButton pinned={pinnedOpen} setPinned={setPinnedOpen} />
    </nav>
  );
};

export default ManageBar;
