import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  Tooltip,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from "@mui/material";
import {
  ButtonWithTracking,
  ButtonWithTrackingProps,
} from "../ButtonWithTracking";

export interface DropDownButtonProps extends Omit<ButtonGroupProps, "onClick"> {
  items: Array<ButtonWithTrackingProps & { tooltip?: string | undefined }>;
  selectedItemIndex?: number;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    button: ButtonWithTrackingProps
  ) => void;
}

export const DropDownButton: React.FC<DropDownButtonProps> = ({
  items,
  selectedItemIndex = 0,
  onClick,
  ...buttonGroupProps
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(selectedItemIndex);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) =>
    items[selectedIndex].onClick?.(event) ||
    onClick?.(event, items[selectedIndex]);

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        disableElevation
        {...buttonGroupProps}
      >
        <Tooltip title={items[selectedIndex].tooltip}>
          <ButtonWithTracking
            onClick={handleClick}
            eventName={items[selectedIndex].eventName}
            eventProperties={items[selectedIndex].eventProperties}
          >
            {items[selectedIndex].children}
          </ButtonWithTracking>
        </Tooltip>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="actions"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {items.map((option, index) => (
                    <Tooltip title={option.tooltip}>
                      <MenuItem
                        key={option.id ?? option.key ?? index}
                        disabled={option.disabled}
                        selected={index === selectedIndex}
                        onClick={() => handleMenuItemClick(index)}
                      >
                        {option.children}
                      </MenuItem>
                    </Tooltip>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};
