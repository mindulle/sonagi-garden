A few simple techniques help error messages stand out from the surrounding text and code.

### Link to more detailed documentation

When an error requires a lengthy explanation (for example, multiple sentences) and appropriate documentation is available, use links to redirect users to more detailed documentation.

Not recommended

> Post contains unsafe information.

Recommended

> Post contains unsafe information. Learn more about safety at <link to documentation>.

### Use progressive disclosure

Some error messages are long, requiring a lot of text to explain the problem and solution. Unfortunately, users sometimes ignore long error messages, intimidated by the "wall of text." A good compromise is to display a briefer version of the error message and then give users the option to click something to get the full context.

Not recommended

> TextField widgets require a Material widget ancestor, but none were located. In material design, most widgets are conceptually “printed” on a sheet of material. To introduce a Material widget, either directly include one or use a widget that contains a material itself.

Recommended

> TextField widgets require a Material widget ancestor, but none were located.  
> **...**(Click to see more.)  
>   
>   In material design, most widgets are conceptually "printed" on a sheet of material. To introduce a Material widget, either directly include one or use a widget that contains a material itself.

### Place error messages close to the error

For coding errors, place error messages as close as possible to the place where the error occurred.

Not recommended

> 1: program figure_1;
> 2: Grade = integer;
> 3: var
> 4. print("Hello")
> Use ':' instead of '=' when declaring a variable.

Recommended

> 1: program figure_1;
> 2: Grade = integer; 
> ---------^ Syntax Error
> Use ':' instead of '=' when declaring a variable.
> 3: var
> 4. print("Hello")

### Handle font colors carefully

A surprising percentage of readers are color blind, so be careful with colors in error messages. For example, the following error message will mystify some readers:

Not recommended

> The argument expects only digits. Therefore, the supplied value is only partially correct: 3728LJ947

Many forms of color blindness exist, so just avoiding a red/green combination isn't sufficient. Because you can't depend on all your users being comfortable with color, we recommend pairing color with another visual cue. For example, the following error message pairs color with boldface:

Recommended

> The argument expects only digits. Therefore, the highlighted part of the supplied value is incorrect: 3728**LJ**947

The following example pairs color with extra spaces:

Recommended

> The argument expects only digits. Therefore, the highlighted part of the supplied value is incorrect: 3728  LJ  947

Alternatively, you could skip color completely:

Recommended

> The argument expects only digits. Therefore, the highlighted characters in the supplied value are incorrect:
> 
> 3728LJ947
>     ^^