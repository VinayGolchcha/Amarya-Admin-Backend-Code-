export const incrementId = async(id)=>{

    if (typeof id !== 'string' || !/^[A-Za-z]+(\d+)$/.test(id)) {
        throw new Error('Invalid input format');
    }
    
    const [, prefix, number] = id.match(/^([A-Za-z]+)(\d+)$/);
    const incrementedNumber = String(Number(number) + 1).padStart(number.length, '0');
    console.log(`${prefix}${incrementedNumber}`);
    return `${prefix}${incrementedNumber}`;
      
}