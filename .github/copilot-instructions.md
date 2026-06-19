Always store numbers in a variable, with a variable name that describes what the variable represents. Include units where applicable, for example, time units or pixel units.

All function names should accurately describe what the function does. Function names should be humanly readable and less than 32 characters long. Avoid using abbreviations or acronyms in function names unless they are widely understood.

Functions should not have side effects, meaning they should not modify any variables outside of their scope. If a function needs to modify a variable, it should return the modified value instead. Functions should not be longer than 36 lines long. If a function is longer than 36 lines, break it into smaller functions with descriptive names.

When refactoring, be certain not to change any logic. Always test the code after refactoring to ensure that it still works as expected.