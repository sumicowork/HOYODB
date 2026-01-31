import React, { useState } from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  Navigation24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
import { useTheme } from '../contexts/ThemeContext';

interface MobileMenuProps {
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

const useStyles = makeStyles({
  menuButton: {
    color: 'white',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

const MobileMenu: React.FC<MobileMenuProps> = ({
  title,
  children,
  trigger,
  className,
}) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          appearance="subtle"
          icon={<Navigation24Regular />}
          className={`${styles.menuButton} ${className || ''}`}
          onClick={() => setIsOpen(true)}
          title="菜单"
        />
      )}

      <Drawer
        type="overlay"
        separator
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
        position="start"
      >
        <DrawerHeader style={{ background: colors.headerBg, color: 'white' }}>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsOpen(false)}
                style={{ color: 'white' }}
              />
            }
          >
            {title}
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody
          style={{ backgroundColor: colors.sidebarBg, padding: '16px' }}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </DrawerBody>
      </Drawer>
    </>
  );
};

export default MobileMenu;

