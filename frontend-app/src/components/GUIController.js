//This supposedly will add gui controls for me to use to better edit the scene!
import { GUI } from 'lil-gui';
import { useEffect } from 'react';

export const useGUIController = (params) => {
  useEffect(() => {
    const gui = new GUI();
    Object.keys(params).forEach((key) => {
      gui.add(params, key).onChange((value) => {
        console.log(`${key} changed to ${value}`);
      });
    });
    return () => gui.destroy();
  }, [params]);
};
