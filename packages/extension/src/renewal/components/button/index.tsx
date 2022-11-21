import React, {
  FunctionComponent,
  MouseEventHandler,
  ReactElement,
} from "react";
import styled from "styled-components";
import { ColorPalette } from "../../styles";
import { Box } from "../box";
import { IconProps } from "../icon/types";

type ButtonColor = "primary" | "secondary" | "danger" | "success";
type ButtonVariant = "solid" | "transparent";
type ButtonSize = "block" | "md";

export interface ButtonProps {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rightIcon?: ReactElement<IconProps>;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button: FunctionComponent<ButtonProps> = ({
  color = "primary",
  variant = "solid",
  size = "block",
  rightIcon,
  onClick,
  children,
}) => {
  return (
    <Container {...{ onClick, color, variant, size }}>
      {children}
      {rightIcon && <Box paddingLeft="8px">{rightIcon}</Box>}
    </Container>
  );
};

const styleFromColorAndVariant = {
  primary: {
    solid: `background-color: ${ColorPalette["blue-400"]}; color: ${ColorPalette["white"]};`,
    transparent: `background-color: transparent; color: ${ColorPalette["blue-400"]};`,
  },
  secondary: {
    solid: `background-color: ${ColorPalette["blue-100"]}; color: ${ColorPalette["blue-400"]};`,
    transparent: `background-color: transparent; color: ${ColorPalette["blue-100"]};`,
  },
  success: {
    solid: `background-color: ${ColorPalette["green-400"]}; color: ${ColorPalette["white"]};`,
    transparent: `background-color: transparent; color: ${ColorPalette["green-400"]};`,
  },
  danger: {
    solid: `background-color: ${ColorPalette["red-400"]}; color: ${ColorPalette["white"]};`,
    transparent: `background-color: transparent; color: ${ColorPalette["red-400"]};`,
  },
};

const styleFromSizeAndVariant = {
  block: {
    solid: "width: 100%; height: 3.25rem;",
    transparent: "width: 100%; height: 2rem;",
  },
  md: {
    solid: "width: 10rem; height: 3.25rem;",
    transparent: "width: 10rem; height: 2rem;",
  },
};

const Container = styled.button<ButtonProps>`
  height: 3.25rem;
  ${({ size, variant }) =>
    size && variant && styleFromSizeAndVariant[size][variant]}
  ${({ color, variant }) =>
    color && variant && styleFromColorAndVariant[color][variant]}
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  max-width: 400px;

  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
`;
