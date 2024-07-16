

export class StringEx {
    static padStart(str: string, targetLength: number, padString: string): string {
        if (str.length >= targetLength) {
          return str;
        }
      
        const padding = padString.repeat(Math.ceil((targetLength - str.length) / padString.length));
        return padding.slice(0, targetLength - str.length) + str;
      }
}


