import { MantineLogo } from "@mantinex/mantine-logo";
import { Link, useLocation } from "react-router-dom";
import classes from "./SideBar.module.css";
import { Tooltip, UnstyledButton } from "@mantine/core";

interface LinkItem {
  icon: React.FC<{ size: number; stroke: number }>;
  label: string;
  path: string;
}

interface SideBarProps {
  links: LinkItem[];
}

export function SideBar({ links }: SideBarProps) {
  const location = useLocation();

  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.wrapper}>
          <div className={classes.aside}>
            <div className={classes.logo}>
              <MantineLogo type="mark" size={30} />
            </div>
            {links.map((link) => (
              <Tooltip label={link.label} position="right" withArrow transitionProps={{ duration: 0 }} key={link.label}>
                <UnstyledButton
                  component={Link}
                  to={link.path}
                  className={classes.mainLink}
                  data-active={location.pathname === link.path || undefined}
                >
                  <div className="flex flex-row gap-2 ">
                    <link.icon size={22} stroke={1.5} />
                  </div>
                </UnstyledButton>
              </Tooltip>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
