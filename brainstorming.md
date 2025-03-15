# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder

Installed nodemon, and tried running nodemon server.ts, but told ts-node exec is not found
Installing ts-node with npm install -g ts-node
Now to fix the code itself in server.ts
found I need to add dom in my lib section of tsconfig.json
Installed all relevant packages from a lightbulb on the side of the page?
Then ran npm install --save-dev nodemon and successfully found that nodemon was installed in ui under devDependencies
Installed docker desktop as a prerequisite
Edit the docker file Command to npm start dev
The current node.js version does not support next.js, which is under scripts in package.json
Unistalled v18.14.0, works with the latest version
UI and Streaming Service both successfully work when using npm run dev

Testing the UI
See that sometimes special characters or even letters passed as values in the UI for battery
Researching to understand typescript syntax
(msg) => {} is passing msg as an argument into the function
Msg is being passed in through the TCP Port and we have a web socket on port 8080, with the TCP port listening on 12000. But the link is on port 3000?
Need to make sue only numerical values are passed through to the ui
Potentially use JSON.Parse and Number.isFinite to prevent non numerical values from passing through?
Works, the UI no longer prints non numerical values, instead I just return the function early i a non-numerical value is given
Instead the prvious value stays for half a second longer before the next numerical value comes in, docker compose up prints an error message

For task 3, need to use .filter method to filter out unsafe battery temperatures with time range of 5 seconds
Since battery temperature can be a number or a string, we have to convert it into a number first use Number
Then create a fresh array of the unsafe temperatures and push a timestamp to that array whenever the temperature is unsafe. 
Since each input takes roughly half a second, each time a value comes in we can filter out the unsafe temperature array for the temperatures that occurred in the last 5000 milliseconds (5 seconds) an if the length of this filtered array ens up being longer than 3, then we can print out the error message and the current timestamp as asked, and then return the function

Navigated to the page.tsx file to try and find why the interface only says connecting and not connected
found the react module to be the source and need to find out more about it
Use state - takes the current state of a variabkle and updates it to the new state
Use effect - Takes in a function and the function will only run if the dependancy is true
In our case the changing of connection status will only run if the array is empty (the first time)
Since the status changes to connecting, the array is no longer empty and so the use effect won't run and the status won't change to connected
This means we just have to remove the dependancy so the UseEffect will run every time and now the status correctly updates when the ui is connected vs disconnected
After observing the other functions have useEffect dependencies, we can just change the dependancy to be if the connection status changes and so it will update accordingly
But then I got rid of it again back to an empty array (what it was before) and it still updates? 
And now it doesn't work again? Not sure why?

Need to now look up html elements to understand how to change the colours
Tailwind and shadcn to change the colour
Navigated to the numeric.tsx file in order to change the colour
Copied the return type into multiple if statements, one for each situtation of the safety of the temperature, and just added the text from Tailwind css for each colour and the appropriate shade onto each className, green, red and yellow for each range
Edited the battery temperature constant to just be fixed to 3 decimal places as requested in the spec using Number.toFixed(3)
Updated the data.batteryTemperature object to be a maximum of 3 decimal places and then returns the updated data object conveted into a JSON string instead of the original message, which not successfully displays the temperature to a maximum of 3 decmal places

So apparently my nodemon is not configured properly in my ui directory, which is why the changes aren't applying while the ui is running as per the connecting/connected sign changes in page.tsx
But apparently next.js itself has hot code reloading which is what nodemon does.
THrough turbopack?
Can't seem to find why it is not working for page.tsx though
Do I need to use --watch?
Tried playing around with turbopack in next.config.ts but it didn't work
Still don't understand why it doesn't update

Now trying to implmenet being able to switch from light to dark mode and vice versa
Found an implmentation on the shadcn website using next.js
Realised I needed to install the button and dropdoen menu modules for shadcn
Created a new file called mode-toggle.tsx for this implementation
Added the modeToggle into the page.tsx file in the header so now it successfully appears in the top right
But I can't seem to change the colour-icon goes red when I try to change it
Realised that was because setTheme was already being initialised in page.tsx to always be dark, so I commented this out and now I can toggle between light and dark mode.
To finish this off, I needed to make sure the Redback Logo itself would be able to toggle between light and dark mode, so I had to edit the line in page.tsx where the redback logo is called, making it conditional to be dark mode when the page is dark and light mode when the page is light.

Next is to be able to graph the data, specifically the battery values
I need to install the shadcn chart module first 
Tried importing into page.tsx, but too difficult even after research-not sure how to fully implement this
## Cloud