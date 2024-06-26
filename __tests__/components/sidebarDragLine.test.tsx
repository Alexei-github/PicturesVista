import "@testing-library/jest-dom";
import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SidebarDragLine from "@/components/sidebarDragLine";

describe("SidebarDragLine", () => {
  const onClickAndDrag = jest.fn();

  it("renders dragline", async () => {
    render(
      <SidebarDragLine
        setSidebarSize={onClickAndDrag}
        setEffectiveSidebarSize={onClickAndDrag}
        resizeMargin={50}
      />
    );

    expect(screen.getByRole("separator")).toBeInTheDocument();
    // const dragLine = document.querySelectorAll('hr[class^="vertical_line"]')[0];
    const dragLine = document.getElementsByClassName("vertical_line")[0];
    expect(dragLine).toBeInTheDocument();
  });
  it("dragline has correct style class assigned", async () => {
    render(
      <SidebarDragLine
        setSidebarSize={onClickAndDrag}
        setEffectiveSidebarSize={onClickAndDrag}
        resizeMargin={50}
      />
    );

    // const dragLine = document.querySelectorAll('hr[class^="vertical_line"]')[0];
    const dragLine = document.getElementsByClassName("vertical_line")[0];
    expect(dragLine).toBeInTheDocument();

    // apperantly it is near impossible to test not inline css with jest.
    // tried the follwoign libraries:
    // "jest-css-modules-transform": "^4.4.2",
    // "jest-css-modules": "^2.1.0",
    // "identity-obj-proxy": "^3.0.0",
    // "jest-transform-css": "^6.0.1",
    // const stylesDragLine = window.getComputedStyle(dragLine);
    // expect(stylesDragLine.width).toBe("4px");
    // await waitFor(() => {}, { timeout: 1200 });
  });
});
