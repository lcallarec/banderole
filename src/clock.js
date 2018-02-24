// Original code from my fellow colleague https://github.com/alexvictoor

const systemClock = () => {
  return new Date();
};

let currentClock = systemClock;

const freezeClock = (currentDate) => {
  return currentClock = () => currentDate;
};

module.exports = {systemClock, freezeClock, currentClock};
