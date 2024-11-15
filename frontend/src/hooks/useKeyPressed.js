import { useState, useEffect } from 'react';

export const useKeyPressed = () => {
  const [keysPressed, setKeyPressed] = useState({});

  const onKeyDown = (e) => {
    setKeyPressed((prevState) => ({
      ...prevState,
      [e.key]: true,
    }));
  };

  const onKeyUp = (e) => {
    setKeyPressed((prevState) => {
      if (prevState[e.key]) {
        const { [e.key]: _, ...rest } = prevState;
        return rest;
      }
      return prevState;
    });
  };

  useEffect(() => {
    const handleFocus = () => {
      setKeyPressed({});
    };

    const container = document.getElementById('buttons-sales');

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    container.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      container.removeEventListener('focus', handleFocus);
    };
  }, []);

  return keysPressed;
};
