import React from "react";
import imgsDisplayStyle from "@/components/imgsDisplay/imgsDisplay.module.css";
import styled from "styled-components";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  objectName: string;
  confidence: string;
  color: string;
};

const BBox = ({
  x,
  y,
  width,
  height,
  objectName,
  confidence,
  color,
}: Props) => {
  return (
    <StyledBtn
      tabIndex={0}
      className={imgsDisplayStyle.bbox}
      $c={`${color}`}
      style={{
        left: `${Math.max(x, 0) * 100}%`,
        top: `${Math.max(y, 0) * 100}%`,
        right: `${Math.min(1 - (x + width), 1) * 100}%`,
        bottom: `${Math.max(1 - (y + height), 0) * 100}%`,
      }}
      data-tooltip={`${objectName} : ${confidence}%`}
    ></StyledBtn>
  );
};

const StyledBtn = styled.button<{ $c: string }>`
  --w: 4px;
  border: 2px dashed ${(p) => p.$c};
  background: linear-gradient(
        to right,
        ${(p) => p.$c} var(--w),
        transparent var(--w)
      )
      0 0,
    linear-gradient(to right, ${(p) => p.$c} var(--w), transparent var(--w)) 0%
      100%,
    linear-gradient(to left, ${(p) => p.$c} var(--w), transparent var(--w)) 100%
      0,
    linear-gradient(to left, ${(p) => p.$c} var(--w), transparent var(--w)) 100%
      100%,
    linear-gradient(to bottom, ${(p) => p.$c} var(--w), transparent var(--w)) 0
      0,
    linear-gradient(to bottom, ${(p) => p.$c} var(--w), transparent var(--w))
      100% 0,
    linear-gradient(to top, ${(p) => p.$c} var(--w), transparent var(--w)) 0
      100%,
    // rgba(255, 255, 255, 0.1)
    linear-gradient(to top, ${(p) => p.$c} var(--w), transparent var(--w)) 100%
      100%;

  background-repeat: no-repeat;
  background-origin: border-box;
  background-size: 10% 10%;

  &:focus {
    z-index: auto;
    border: 4px solid ${(p) => p.$c};
  }

  &:hover::before,
  &:focus::before {
    content: attr(data-tooltip);
    position: absolute;
    top: 0px;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -90%);
    white-space: nowrap;
    background-color: var(--imgs-bcgnd);
    padding: 0.3rem;
    border-radius: 0.5rem;
    line-height: 1;
    font-size: 1rem;
    z-index: 1;
    border: 2px solid ${(p) => p.$c};
  }
`;

export default React.memo(BBox);
