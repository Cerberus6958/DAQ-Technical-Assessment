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


**Below is my new brainstorming for this term's intake**

Started off by debugging *server.ts* to figure out why just the timestamp itself was being sent to the ui frontend. 
Discovered this was because I had included an extra line of code that printed out the timestamp to the console, I imagine this was because of debugging purposes from the T1 assessment.

Next, I am having another go at the *frontend* features, this time delving into the tailwind documentation and the code in page.tsx to try and see how the ui has been coded display wise

Just like last intake, for some reason afetr every change in the ui, I need to run the --build option with docker compose up for the changes to come and take effect. I experimented with this by moving the box with the temperatures to the top left by changing **justify** and **items** to be at the start (left).

### Error Messages Interface

This can now allow room for an error messages interface and potential graphing of values which I am attempting to implement.
Have successfully managed to implement the error message interface which displays an error when the temperature is invalid or outside the safe operating range, and the temperature itself displays as **-**. Vice versa occurs when the temperatur is valid-the temperature board displays the temperature with the relevant colour, and the error message board displaying a **-** in *red*

This took me quite a while to implement, as I still haven't done any frontend until this point, so I had to look carefully at the formatting and positioning of this partiuclar board, as well as how to get the correct font size and the correct error messages over from the backend into the frontend. This involved having to change the code slightly in *server.ts*, instead of returning when there is an error, pass this error message to the frontend, but have a **regex check** in the frontend to see whether the value that has been passes is an error, or a valid temperature. The regex checks for whether the value includes the statement *Error* at the start, in which case it will display on the error message board. 

To change the font and keep the red colour, I had to go to back to *numeric.tsx* and add the same regex check there so that all messages on the error board display in red, as red is typically the error message colour, and of an appropriate size of 2XL. To keep things simple, I kept the box, and main formatting of the interface itself very similar to the Temperature interface, only changing the positioning.

### Graph Interface

Found this very hard to implement, and like last time was sill unsuccessful in fully implementing this, but was able to make quite a bit of progress before being unable to debug any further. Similarly to my other interfaces, this box was of the same size and format, but when I tried to position it in the *bottom left* corner, fo some reason it pushed up the error messages interface box into the *right middle*, instead of the *bottom right*. This doesn't really make sense to me as I used justify and items with the start and end options which shoukd place items in the corners of the screen

Next, I copied a template from **Recharts** for a bsic line graph that plots a line, in our case **temperature** on the *Y-axis* and **timestamp** on the *X-axis* whilst keeping the line colour default. 

I then tried to make a variable that stores the 20 latest temperatures + timestamps, and have this be put on the line graph, but for some reason this doesn't seem to have work ed. I looked a little into use effects, but for some reason it seems to plot the same timestamp + temperature 20 times meaning it displays a horizontal line on the ui. I tried experimenting with some of the code as well, such as getting rid of the lastJSONmessage change requirement for the newData variable to update with the latest temperature, but this still didn't see to work. I'm guessing it is probably because the current state of the variable is forgotten every time a new timestamp + temperature is sent to the ui?

So it correctly plots the most recent value, but it doesn't show any values before the current temperature and timestamp. I also made sure not to have a key on the *Y-Axis*, as apparently this lets the graph scale itself based on the temperatures that are being graphed.

### Light Mode debugging

For some reason as well, now the light and dark mode toggle no longer seems to work and displays a client side error. I had a look through *mode-toggle.tsx* a file I created last time which successfully gave the option for the user to change into light mode, but also couldn't seem to find the error. I didn't change any of this code from last time, so the error must've come from adding the two new boards. 

### Task 5

Was trying to have a go at this task too, but was unfrotunately quite busy this week and was therefore unable to make any progress with this, along with finishing debugging Task 4.

## Cloud