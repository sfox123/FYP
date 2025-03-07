import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Checkbox, HStack } from "@chakra-ui/react";
import { FaFileExport } from "react-icons/fa";

const CustomSidebar = ({
  onClose,
  setViewOrientation,
  handleModelChange,
  model,
  setIsExportModalOpen,
}) => {
  return (
    <Sidebar backgroundColor="transparent">
      <Menu backgroundColor="transparent">
        <MenuItem>Dashboard</MenuItem>
        <SubMenu label="View">
          <MenuItem
            onClick={() => {
              setViewOrientation("vertical");
              onClose();
            }}
          >
            Vertical (Default)
          </MenuItem>
          <MenuItem
            onClick={() => {
              setViewOrientation("horizontal");
              onClose();
            }}
          >
            Horizontal
          </MenuItem>
        </SubMenu>
        <SubMenu label="Model">
          <MenuItem>
            <Checkbox
              isChecked={model === "codex"}
              onChange={() => handleModelChange("codex")}
            >
              CodeX
            </Checkbox>
          </MenuItem>
          <MenuItem>
            <Checkbox
              isChecked={model === "GPT-4o"}
              onChange={() => handleModelChange("GPT-4o")}
            >
              GPT-4o
            </Checkbox>
          </MenuItem>
          <MenuItem>
            <Checkbox
              isChecked={model === "Gemini-2.0"}
              onChange={() => handleModelChange("Gemini-2.0")}
            >
              Gemini-2.0
            </Checkbox>
          </MenuItem>
        </SubMenu>
        <MenuItem
          onClick={() => {
            setIsExportModalOpen(true);
            onClose();
          }}
        >
          <HStack spacing={2}>
            <span>Export</span>
            <FaFileExport />
          </HStack>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;
