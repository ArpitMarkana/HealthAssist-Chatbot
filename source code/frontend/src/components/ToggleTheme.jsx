import PropTypes from 'prop-types';
import useDarkMode from '../hooks/useDarkMode';
import { MdOutlineNightlight, MdOutlineWbSunny } from 'react-icons/md';

/**
 * A toggle for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 * @param {boolean} props.open - Whether the sidebar is open or not.
 */
const ToggleTheme = (props) => {
  const [theme, setTheme] = useDarkMode();
  const { setThm } = props;
  /**
   * Toggles the dark mode.
   */
  const handleToggle =async () => {
   await setTheme(theme === 'light' ? 'dark' : 'light');
    if (theme === 'light') setThm(true);
    else setThm(false);
  };

  return (
    <a onClick={handleToggle}>
      {theme=='dark' ? (
        <>
          <MdOutlineWbSunny size={15} />
          <p className={`${!props.open && 'hidden'}`}>Light mode</p>
        </>
      ) : (
        <>
          <MdOutlineNightlight size={15} />
          <p className={`${!props.open && 'hidden'}`}>Night mode</p>
        </>
      )}
    </a>
  );
};

export default ToggleTheme;

ToggleTheme.propTypes = {
  open: PropTypes.bool,
};
