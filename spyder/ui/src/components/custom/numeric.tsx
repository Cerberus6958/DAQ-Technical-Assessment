interface TemperatureProps {
  temp: any;
}

/**
 * Numeric component that displays the temperature value.
 * 
 * @param {number} props.temp - The temperature value to be displayed.
 * @returns {JSX.Element} The rendered Numeric component.
 */
function Numeric({ temp }: TemperatureProps) {
  // TODO: Change the color of the text based on the temperature
  // HINT:
  //  - Consider using cn() from the utils folder for conditional tailwind styling
  //  - (or) Use the div's style prop to change the colour
  //  - (or) other solution

  if (temp > 25 &&  temp < 75 ) {
    return (
      <div className="text-foreground text-4xl font-bold text-lime-500">
        {`${temp}°C`}
      </div>
    );
  }
  else if ((temp >= 20 && temp <= 25) || (temp >= 75 && temp <= 80)) {
    return (
      <div className="text-foreground text-4xl font-bold text-yellow-400">
        {`${temp}°C`}
      </div>
    );
  }
  else {
    return (
      <div className="text-foreground text-4xl font-bold text-red-600">
        {`${temp}°C`}
      </div>
    );
  }
  

  // Justify your choice of implementation in brainstorming.md
}

export default Numeric;
