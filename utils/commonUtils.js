export const inAllowedTime = async () => {
    try {
        let now = new Date();
        let currentHour = now.getHours();
        let currentMinutes = now.getMinutes();

        let isMorningSlot = (currentHour === 10 || currentHour === 11) || (currentHour === 12 && currentMinutes === 0);
        return isMorningSlot;
    } catch (error) {
        console.error('Error checking time intervals:', error);
        return false;
    }
};

export const outAllowedTime = async () => {
    try {
        let now = new Date();
        let currentHour = now.getHours();
        let currentMinutes = now.getMinutes();

        let isEveningSlot = (currentHour === 18 || (currentHour === 19 && currentMinutes === 0));
        return isEveningSlot;
    } catch (error) {
        console.error('Error checking time intervals:', error);
        return false;
    }
};