# UI should be side-effect of data flow.

As a frontend developer, when we create a app, we wrote business logic and UI logic.

UI logic is painful. thats why many tools came out with cli only, then it has a UI version with much fewer functionalities.

But, for frontend developers, It's almost all our responsibility to wrote UI logic. and bind it with business logic.

so, What should we do, how can we get rid of this mess coming with UI.

The key is** user interface shoud be side effect of data flow**.

which means we should focus on business logic which is the core of our app. and let Frameworks care about UI.

This sounds normal, right? React, Vue has already did this. Yes. thouse frameworks can automatically update UI, when data changed. But mose developer didn't write code like this way.

## Think about a confirmation dialog when user clicked delete button

> I'll use vue to demonstraion.

First, there will be a delete button shown on page to be clicked by users.

then, A dialog pop up to ask user if they really want to delete something.

then, if user click yes, something deleted.

If we create this feature in a cli app. we can simply write a function called `deleteSomething`, and call this function when users asked.

But now we are creating a website. when user ask us to delete something by click delete button. we cann't just call the function `deleteSomething`, cause we have a dialog to offer users. it's the confirm button of this dialog is the real delete button.

so ,you saw the core problem, right?

**the detele function isn't called by the delete button.**

Bussiness logic get messed up, because of UI logic. this will make app because hard to maintained.

what should we do? how to clean up this mess?

the answer is **UI should be side effect of data flow**

## Think about a bussiness logic you have already wrote in a component and work perfect.

but after some day your boss changed the design, another place need the same logic.

what will you do?

You may say that's alright. I'll move the logic in to a function ,and call anywhere.
