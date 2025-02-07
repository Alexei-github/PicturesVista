import compStyles from '@/components/components.module.css';
import SideBar from '@/components/sidebar/Sidebar';
import { fireEvent, render, screen } from '@testing-library/react';

// describe("SideBar", () => {
//   it("renders a PinButton and SidebarDragLine", () => {
//     render(<SideBar />);

//     expect(screen.getByRole("button")).toBeInTheDocument();
//     expect(screen.getByRole("separator")).toBeInTheDocument();
//   });
//   it("PinButton have blue colour which means it is in pinned psition", () => {
//     render(<SideBar />);

//     const stylesBtn = getComputedStyle(screen.getByRole("button"));
//     expect(stylesBtn.textShadow).toBe("0 0 0 blue");
//   });
// });
