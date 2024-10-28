import { useState, useEffect } from "react";

export function useCountdown(startingTime: number) {
  const [remainingTime, setRemainingTime] = useState<number>(startingTime);

  useEffect(() => {
    setRemainingTime(startingTime);

    if (startingTime > 0) {
      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startingTime]);

  return remainingTime;
}
